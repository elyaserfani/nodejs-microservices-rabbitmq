const Router = require("express").Router;
const router = new Router();
const Product = require("../models/Product");
const amqp = require("amqplib");
const { body, validationResult } = require("express-validator");

let order, channel, connection;

async function connectRabbitMQ() {
  const amqpServer = "amqp://guest:guest@localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("product-service-queue");
}
connectRabbitMQ();

router.post(
  "/",
  body("name").isLength({ min: 1 }),
  body("price").isInt({ min: 1 }),
  body("color").isLength({ min: 1 }),
  body("description").isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, price, color, description } = req.body;
    const product = await new Product({ ...req.body });
    await product.save();
    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  }
);
router.post("/buy", async (req, res) => {
  const { productIds } = req.body;
  const products = await Product.find({ _id: { $in: productIds } });
  channel.sendToQueue(
    "order-service-queue",
    Buffer.from(
      JSON.stringify({
        products,
      })
    )
  );
  channel.consume("product-service-queue", (data) => {
    console.log("Consumed from product-service-queue");
    order = JSON.parse(data.content);
    channel.ack(data);
  });
  return res.status(200).json({
    message: "Order placed successfully",
    order,
  });
});

module.exports = router;

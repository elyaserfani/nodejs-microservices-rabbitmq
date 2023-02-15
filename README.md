# Node.js Microservice Understanding

## <p><b>Microservices Understanding </b>In <b>Node.js</b> Using <b>Express.js</b> , <b>RabbitMQ</b> , <b>MongoDB</b></br>

In this project we have 2 simple services : <b>product-service</b> and <b>order-service</b></p>

## Installation :

```
docker-compose up -d
cd order-service && yarn install
cd product-service && yarn install
```

After this steps you can visit `http://localhost:15672/` to enter <b>rabbitMQ dashboard</b> and use this credentials to login :

```
username : guest
password : guest
```

You can also visit : `http://localhost:8080/` to enter <b>mongo-express database gui</b>

---

## Build :

</br>
You must start two services , first :

```
cd product-services
node index.js
```

Product Service listening on port 3001

</br>

then you should start second service in another terminal :

```
cd order-service
node index.js
```

Order Service listening on port 3002

Finally you can send requests and see the results :

### Create Product :

![Image](/images/create-product.PNG)

### Buy Product And Consume Product :

![Image](/images/buy-product.PNG)

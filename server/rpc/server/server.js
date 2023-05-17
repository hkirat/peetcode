const RabbitMQClient = require("./client.js");

RabbitMQClient.initialise();
console.log("Second: ", RabbitMQClient.instance);

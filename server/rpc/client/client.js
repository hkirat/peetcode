const amqp = require("amqplib");
const Consumer = require("./consumer");
const Producer = require("./producer");
const EventEmitter = require("events");

module.exports = class RabbitMQClient {
  async initialise() {
    let retryCount = 0;
    const maxRetries = 10;
    const delay = 4000; // 4 seconds
    let connected = false;

    while (!connected && retryCount < maxRetries) {
      try {
        console.log("Connecting to RabbitMQ...");
        this.connection = await amqp.connect("amqp://rabbitmq-service");

        connected = true;
        console.log("Connected successfully");

        this.producerChannel = await this.connection.createChannel();
        this.consumerChannel = await this.connection.createChannel();

        const { queue: replyQueueName } = await this.consumerChannel.assertQueue("", {
          exclusive: true,
        });

        this.eventEmitter = new EventEmitter();

        this.producer = new Producer(this.producerChannel, replyQueueName, this.eventEmitter);
        this.consumer = new Consumer(this.consumerChannel, replyQueueName, this.eventEmitter);
        this.consumer.consumeMessages();
      } catch (error) {
        console.log("Error in connecting to rabbitMQ...", error);
        retryCount++;
        console.log("Retrying...");
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async produce(data) {
    return await this.producer.produceMessage(data);
  }
};

const amqp = require("amqplib");
const Consumer = require("./consumer");
const Producer = require("./producer");

class RabbitMQClient {
  static instance;
  static getInstance() {
    console.log("Getting...");
    if (!RabbitMQClient.instance) {
      console.log("Getting again...");
      RabbitMQClient.instance = new RabbitMQClient();
    }
    console.log("Instance: ", RabbitMQClient.instance);
    return RabbitMQClient.instance;
  }

  async initialise() {
    if (this.isInitialised) return;

    let retryCount = 0;
    const maxRetries = 10;
    const delay = 4000; // 4 seconds
    let isConnected = false;

    while (!isConnected && retryCount < maxRetries) {
      try {
        console.log("Connecting to RabbitMQ...");
        this.connection = await amqp.connect("amqp://rabbitmq-service");
        isConnected = true;
        this.producerChannel = await this.connection.createChannel();
        this.consumerChannel = await this.connection.createChannel();

        const { queue: rpcQueue } = await this.consumerChannel.assertQueue("container_queue");

        this.producer = new Producer(this.producerChannel);
        this.consumer = new Consumer(this.consumerChannel, rpcQueue, this.producer);
        this.consumer.consumeMessages();
        this.isInitialised = true;
      } catch (error) {
        console.log("Error connecting to rabbitMQ: ", error);
        retryCount++;
        console.log("Retrying...");
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async produce(data, correlationId, replyToQueue) {
    if (!this.isInitialized) {
      await this.initialise();
    }
    this.producer.produce(data, correlationId, replyToQueue);
  }
}

module.exports = RabbitMQClient.getInstance();

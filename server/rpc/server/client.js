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
    if (this.isInitialised) {
      console.log("Yes, initalised is true");
      return;
    }
    console.log("No, initalised is false");
    this.connection = await amqp.connect("amqp://localhost");

    this.producerChannel = await this.connection.createChannel();
    this.consumerChannel = await this.connection.createChannel();

    const { queue: rpcQueue } = await this.consumerChannel.assertQueue("rpc_queue", {
      exclusive: true,
    });

    this.producer = new Producer(this.producerChannel);
    this.consumer = new Consumer(this.consumerChannel, rpcQueue, this.producer);
    this.consumer.consumeMessages();
    this.isInitialised = true;
  }

  async produce(data, correlationId, replyToQueue) {
    if (!this.isInitialized) {
      await this.initialise();
    }
    this.producer.produce(data, correlationId, replyToQueue);
  }
}

module.exports = RabbitMQClient.getInstance();

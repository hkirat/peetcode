const amqp = require("amqplib");
const Consumer = require("./consumer");
const Producer = require("./producer");
const EventEmitter = require("events");

module.exports = class RabbitMQClient {
  async initialise() {
    try {
      this.connection = await amqp.connect("amqp://localhost");

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
    }
  }

  async produce(data) {
    return await this.producer.produceMessage(data);
  }
};

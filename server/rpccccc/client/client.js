const amqp = require("amqplib");

module.exports = class RabbitMDClient {
  async initialise() {
    try {
      this.connection = amqp.connect("amqp://localhost");

      this.producerChannel = await amqp.createChannel();
      this.consumerChannel = await amqp.createChannel();
    } catch (error) {}
  }
};

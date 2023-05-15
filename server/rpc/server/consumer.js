const beginExecution = require("../../execute.js");

module.exports = class Consumer {
  constructor(channel, rpcQueue, producer) {
    this.channel = channel;
    this.rpcQueue = rpcQueue;
    this.producer = producer;
  }

  async consumeMessages() {
    console.log("Ready to consume messages...");
    this.channel.consume(
      this.rpcQueue,
      async (message) => {
        const { correlationId, replyTo } = message.properties;
        if (!correlationId || !replyTo) {
          console.log("Missing fields...");
        } else {
          const request = JSON.parse(message.content.toString());
          const result = await beginExecution(request.submission);
          console.log("Result is: ", result);
          await this.producer.produce(result, correlationId, replyTo);
        }
      },
      {
        noAck: true,
      }
    );
  }
};

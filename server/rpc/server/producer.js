module.exports = class Producer {
  constructor(channel) {
    this.channel = channel;
  }

  async produce(data, correlationId, replyToQueue) {
    console.log("Producing inside the actual...");
    console.log("Reply to queue: ", replyToQueue);
    this.channel.sendToQueue(replyToQueue, Buffer.from(JSON.stringify(data)), {
      correlationId,
    });
  }
};

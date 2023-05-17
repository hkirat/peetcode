const crypto = require("crypto");
const EventEmitter = require("events");

module.exports = class Producer {
  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async produceMessage(data) {
    const uuid = crypto.randomUUID();
    console.log(this.replyQueueName, uuid);
    this.channel.sendToQueue("container_queue", Buffer.from(JSON.stringify(data)), {
      replyTo: this.replyQueueName,
      correlationId: uuid,
      expiration: 10,
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        const reply = JSON.parse(data.content.toString());
        resolve(reply);
      });
    });
  }
};

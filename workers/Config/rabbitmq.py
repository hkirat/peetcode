from json import JSONDecodeError

import pika
from .redis import set
import json


class RabbitMQ:
    connection = None

    def __init__(self, queue, callback, host='localhost', durable=True):
        self.queue = queue
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=host))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue, durable=durable)
        self.callback = callback

        if self.connection is None:
            print("Connection not established")

    def __del__(self):
        if self.connection is not None:
            self.connection.close()

    def _callback(self, ch, method, properties, body):
        if body is None:
            return
        try:
            res = self.callback(body)
            if res:
                print(res)
                self.ack(method)
        except JSONDecodeError:
            print("JSONDecodeError")
            set('submission:' + str(body['user_id']) + ':' + str(body['problem_id']), json.dumps({"status": "Failed", "message": "Internal Error"}))

        except Exception as e:
            print(e)
            body = json.loads(body)
            print(body)
            set('submission:' + str(body['user_id']) + ':' + str(body['problem_id']), json.dumps({"status": "Failed", "message": "Internal Error"}))
            self.ack(method)

    def send(self, message):
        self.channel.basic_publish(exchange='', routing_key=self.queue, body=message)
        print(" [x] Sent %r" % message)

    def consume(self):
        self.channel.basic_consume(queue=self.queue, on_message_callback=self._callback)
        print(' [*] Waiting for messages. To exit press CTRL+C')
        self.channel.start_consuming()

    def receive_once(self):
        method_frame, header_frame, body = self.channel.basic_get(queue=self.queue, auto_ack=True)
        if method_frame:
            print(method_frame, header_frame, body)
            self.channel.basic_ack(method_frame.delivery_tag)
        else:
            print('No message returned')

    def ack(self, method_frame):
        self.channel.basic_ack(delivery_tag=method_frame.delivery_tag)

    def close(self):
        self.connection.close()

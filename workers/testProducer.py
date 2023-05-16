import pika
import json
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
# channel.queue_declare(queue='code_submission_queue')
message = {
    "lang": "cpp",
    "code": "#include <iostream>\nusing namespace std;\nint main(){\nint a,b;\ncin>>a>>b;\ncout<<a+b;\nreturn 0;\n}",
    "input": "1 2",
    "expected_output": "3",
    "problem_id": 1,
    "user_id": 1
}
channel.basic_publish(exchange='', routing_key='code_submission', body=json.dumps(message))
connection.close()
print(" [x] Sent 'Hello World!'")

import pika
import json
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
# channel.queue_declare(queue='code_submission_queue')
message = {
    "lang": "java",
    "code": "import java.util.Scanner; public class Main {\n  public static void main(String[] args) {\n int a,b; Scanner sc = new Scanner(System.in); a = sc.nextInt(); b = sc.nextInt(); System.out.println(a+b); }\n}",
    "input": "1 2",
    "expected_output": "3",
    "problem_id": 1,
    "user_id": 1
}
channel.basic_publish(exchange='', routing_key='code_submission', body=json.dumps(message))
connection.close()
print(" [x] Sent 'Hello World!'")

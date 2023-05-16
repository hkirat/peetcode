from Config.rabbitmq import RabbitMQ
from Config.redis import get, set, delete, exists, keys
from RunCode.run import compile, run, match_output, LANG_EXT_MAP
from RunCode.fs import init, cleanup, TEMP_DIR_PATH

import json
import os


def callback(body):
    body = json.loads(body)
    required_fields = ['lang', 'code', 'problem_id', 'user_id']
    for field in required_fields:
        if field not in body:
            return {
                "status": "400",
                "message": "Bad Request"
            }

    cleanup()
    print(body)
    lang = body['lang']
    code = body['code']
    input = body['input'] if 'input' in body else None
    expected_output = body['expected_output'] if 'expected_output' in body else None
    problem_id = body['problem_id']
    user_id = body['user_id']
    set('submission:' + str(user_id) + ':' + str(problem_id), json.dumps({"status": "running", "message": "Running"}))

    filename = 'Main.' + LANG_EXT_MAP[lang]
    with open(TEMP_DIR_PATH + '/' + filename, 'w') as f:
        f.write(code)

    compile_status = compile(lang, filename)
    if compile_status['status'] != '200':
        set('submission:' + str(user_id) + ':' + str(problem_id), json.dumps(compile_status))
        return compile_status

    run_status = run(lang, filename, input, 5)
    if run_status['status'] != '200':
        set('submission:' + str(user_id) + ':' + str(problem_id), json.dumps(run_status))
        return run_status

    if expected_output is not None:
        if not match_output(run_status['message'], expected_output):
            status = {
                "status": "wrong_answer",
                "message": "Wrong Answer"
            }

            set('submission:' + str(user_id) + ':' + str(problem_id), json.dumps(status))
            return status

    status = {
        "status": "correct_answer",
        "message": "Correct Answer"
    }
    set('submission:' + str(user_id) + ':' + str(problem_id), json.dumps(status))
    return status


def main():
    init()
    host = os.environ.get('RABBITMQ_HOST', 'localhost')
    print(host)
    rabbitmq = RabbitMQ("code_submission", callback, host=host)
    try:
        rabbitmq.consume()
        cleanup()
    except KeyboardInterrupt:
        cleanup()
        rabbitmq.close()


if __name__ == '__main__':
    main()

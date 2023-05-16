import os
import subprocess
import resource
import time

USER = "sudo -u peetcode"

ERROR_CODES = {
    '200': 'Success',
    'compile_error': 'Compile Error',
    'runtime_error': 'Runtime Error',
    'time_limit_exceeded': 'Time Limit Exceeded',
    'memory_limit_exceeded': 'Memory Limit Exceeded',
    'output_limit_exceeded': 'Output Limit Exceeded',
    'wrong_answer': 'Wrong Answer',
    'unknown_error': 'Unknown Error',
    'language_not_supported': 'Language Not Supported',
}

LANG_EXT_MAP = {
    'python': 'py',
    'c': 'c',
    'cpp': 'cpp',
    'java': 'java',
    'javascript': 'js',
}

LANG_COMPILE_MAP = {
    'python': '200',
    'c': 'gcc',
    'cpp': 'g++',
    'java': 'javac',
    'javascript': '200',
}

LANG_RUN_MAP = {
    'python': 'python3',
    'c': './a.out',
    'cpp': './a.out',
    'java': 'java',
    'javascript': 'node',
}

cwd = os.environ.get('TEMP_DIR_PATH', 'temp')


def compile(lang, filename):
    if lang == 'python' or lang == 'javascript':
        return {
            "status": "200",
            "message": "Success"
        }

    command = LANG_COMPILE_MAP[lang] + ' ' + filename
    command = USER + ' ' + command

    stdout = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=cwd)
    if stdout.returncode != 0:
        return {
            "status": "compile_error",
            "message": stdout.stderr.decode('utf-8')
        }

    return {
        "status": "200",
        "message": stdout.stdout.decode('utf-8')
    }


def run_with_timeout(command, input, time_limit):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               stdin=subprocess.PIPE, cwd=cwd)
    start_time = time.time()
    while process.poll() is None:
        if time.time() - start_time > time_limit:
            process.kill()
            raise subprocess.TimeoutExpired(command, time_limit)

    stdout, stderr = process.communicate(input=input.encode('utf-8'))

    if process.returncode != 0:
        error = stderr.decode('utf-8')
        if "Killed" in error:
            return {
                "status": "memory_limit_exceeded",
                "message": "Memory Limit Exceeded"
            }
        if "Resource temporarily unavailable" in error:
            return {
                "status": "output_limit_exceeded",
                "message": "No Fork Bombs >:("
            }
        return {
            "status": "runtime_error",
            "message": stderr.decode('utf-8')
        }

    return {
        "status": "200",
        "message": stdout.decode('utf-8')
    }


def run(lang, filename, input, time_limit):
    command = LANG_RUN_MAP[lang] + ' ' + filename
    command = USER + ' ' + command
    input = input if input is not None else ''

    try:
        stdout = run_with_timeout(command, input, time_limit)
    except subprocess.TimeoutExpired:
        return {
            "status": "time_limit_exceeded",
            "message": "Time Limit Exceeded"
        }

    return stdout


def match_output(output, expected_output):
    output = output.strip()
    expected_output = expected_output.strip()
    if output == expected_output:
        return True
    return False

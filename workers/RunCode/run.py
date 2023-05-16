import os
import subprocess

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


def run(lang, filename, input, time_limit):
    command = LANG_RUN_MAP[lang] + ' ' + filename
    input = input if input is not None else ''

    try:
        stdout = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, input=input.encode('utf-8'), timeout=time_limit, cwd=cwd)
    except subprocess.TimeoutExpired:
        return {
            "status": "time_limit_exceeded",
            "message": "Time Limit Exceeded"
        }

    if stdout.returncode != 0:
        return {
            "status": "runtime_error",
            "message": stdout.stderr.decode('utf-8')
        }

    return {
        "status": "200",
        "message": stdout.stdout.decode('utf-8')
    }


def match_output(output, expected_output):
    output = output.strip()
    expected_output = expected_output.strip()
    if output == expected_output:
        return True
    return False



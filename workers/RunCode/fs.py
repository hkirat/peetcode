import os

TEMP_DIR_PATH = os.getenv('TEMP_DIR_PATH', 'temp')


def init():
    os.makedirs(TEMP_DIR_PATH, exist_ok=True)


def cleanup():
    os.system('rm -rf ' + TEMP_DIR_PATH + '/*')

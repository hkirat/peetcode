import redis
import os

REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = os.getenv('REDIS_PORT', 6379)
REDIS_DB = os.getenv('REDIS_DB', 0)
REDIS_PASSWORD = os.getenv('REDIS_PASSWORD', None)

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, password=REDIS_PASSWORD, decode_responses=True)
if not r.ping():
    raise Exception("Redis is not running")


def get(key):
    return r.get(key)


def set(key, value):
    return r.set(key, value)


def delete(key):
    return r.delete(key)


def exists(key):
    return r.exists(key)


def keys(pattern):
    return r.keys(pattern)


def flushdb():
    return r.flushdb()

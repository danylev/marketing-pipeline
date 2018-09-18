from pymongo import MongoClient

from vortex.config.settings import MONGO_DATABASE, MONGO_PASSWORD, MONGO_USER, MONGO_HOST, MONGO_PORT


def mongo_uri():
    return f'mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}'


def establish_connection():
    return MongoClient(mongo_uri())

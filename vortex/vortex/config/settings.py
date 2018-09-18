from dotenv import load_dotenv
load_dotenv()

import os

MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = os.getenv('MONGO_PORT')
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASS')
MONGO_DATABASE = os.getenv('MONGO_COLLECTION')

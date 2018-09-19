from dotenv import load_dotenv
load_dotenv()

import os

MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = os.getenv('MONGO_PORT')
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASS')
MONGO_DATABASE = os.getenv('MONGO_COLLECTION')

# Medium info
MEDIUM_UID = os.getenv('MEDIUM_UID', '5aa09c5a2485')
MEDIUM_SID = os.getenv('MEDIUM_SID', '1:XZMc+PoWz3+YryO9p+oSXL1ByYmJWkiUbtafrKn9KrmxA9TzneUTGVuI2AYSVBqc')

import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
from pathlib import Path
import hashlib

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DBNAME = os.getenv("MONGODB_DB", "sports_app")

client = MongoClient(MONGO_URI)         # Lazy connection: doesn't connect until used
db = client[MONGO_DBNAME]

def get_collection(name):
    return db[name]

# helper to convert string id to ObjectId safely
def to_objectid(id_str):
    try:
        return ObjectId(id_str)
    except Exception as e:
        return None

def generate_id(created_by, created_at):
    hash_input = f"{created_by}-{created_at}".encode('utf-8')
    hash_output = hashlib.sha256(hash_input).hexdigest()
    return to_objectid(hash_output[:24])

import firebase_admin
from firebase_admin import credentials
import os

# Path to your service account key file
# Ensure this path is correct relative to where your Django app runs

## CHANGE KEY PATH HERE
SERVICE_ACCOUNT_KEY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../sports-app-db0cf-firebase-adminsdk-fbsvc-c0b41ab7ac.json')

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully!")

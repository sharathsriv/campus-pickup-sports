from firebase_admin import auth, firestore
from . import firebase_auth

db = firestore.client()
db_players = db.collection('players')

def create_firebase_user(email, password):
    try:
        user = auth.create_user(email=email, password=password)
        print(f'Successfully created new user: {user.uid}')
        return user
    except Exception as e:
        print(f'Error creating user: {e}')
        return None

def add_user_profile(uid, name, email):
    doc_ref = db_players.document(uid.uid)
    doc_ref.set({'name': name, 'email': email, 'past_games': [], 'ongoing_games': [], 'upcoming_games': []})
    print(f'User profile for {uid} added to Firestore.')

def get_user_profile(uid):
    doc_ref = db_players.document(uid)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        print(f'No such user profile for UID: {uid}')
        return None

def user_login(token):
    decoded_token = auth.verify_id_token(token)
    uid = decoded_token['uid']
    return uid

def update_user_profile(uid, update_data):
    doc_ref = db_players.document(uid)
    # only update the name
    doc_ref.update(update_data)
    print(f'User profile for {uid} updated with {update_data}.')
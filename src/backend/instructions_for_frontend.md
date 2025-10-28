# Sports Game Management API

This project provides a backend API for managing users and games using Firebase and Django. 
It allows players to register, create games, join games, and retrieve information about ongoing and scheduled matches.

---

## 🚀 Getting Started

### 1. Prerequisites
Before running the server, make sure you have:
- Python 3.10 or later
- Firebase Project set up with Firestore and Authentication enabled
- Django and Firebase Admin SDK installed

Install all required dependencies:
```bash
pip install -r requirements.txt
```

### 2. Firebase Setup
1. Go to your Firebase console → Project settings → Service accounts.
2. Click "Generate new private key" and save the JSON key file.
3. Place the key file in the `./src/backend` directory. After this replace the path to your key in the `./src/api/firebase_auth.py` file. **DO NOT PUSH THIS TO GITHUB.**
script:
```python
import firebase_admin
from firebase_admin import credentials
import os

## CHANGE KEY PATH HERE
SERVICE_ACCOUNT_KEY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'path_to_file')

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully!")
```

---

## 🏃‍♂️ Running the Server

To start the Django server locally cd into `./src/backend`:
```bash
python manage.py runserver
```

Server runs at:
```
http://127.0.0.1:8000/
```

Example API root:
```
http://127.0.0.1:8000/api/
```

If you get an error about missing trailing slashes, make sure to include a `/` at the end of URLs (e.g., `/api/players/` instead of `/api/players`).

---

## 🧩 API Structure and Endpoints

### Players

#### POST /api/players/
**Description:** Create a new user.  
**Request Body:**
```json
{ "email": "user@example.com", "password": "password123", "name": "John Doe" }
```
**Response:**
```json
{ "uid": "firebase_user_id" }
```
or  
```json
{ "error": "reason" }
```

#### GET /api/players/
**Description:** Get the UID of a user using their authentication token.  
**Request Body:**
```json
{ "token": "user_firebase_token" }
```
**Response:**
```json
{ "uid": "firebase_user_id" }
```
or  
```json
{ "error": "player not found" }
```

#### POST /api/players/account/{playerID}/
**Description:** Update account details (currently supports name changes).  
**Request Body:**
```json
{ "name": "New Name" }
```
**Response:**
```json
{ "success": "player updated" }
```
or  
```json
{ "error": "reason" }
```

#### GET /api/players/account/{playerID}/
**Description:** Get player details.  
**Response:**
```json
{
  "id": "uid",
  "name": "John Doe",
  "email": "user@example.com",
  "past_games": [],
  "ongoing_games": [],
  "upcoming_games": []
}
```

---

### Games

#### POST /api/games/
**Description:** Create a new game.  
**Request Body:**
```json
{
  "start_time": "2024-07-01T10:00:00Z",
  "end_time": "2024-07-01T12:00:00Z",
  "title": "Morning Soccer Match",
  "location_id": "1",
  "created_by": "650f1c2e4f1a2567eb8d9c3a"
}
```
**Response:**
```json
{ "id": "game_id" }
```

---

#### GET /api/games{gameID}/
**Description:** Retrieve details of a specific game.  
**Response:**
```json
{
  "created_at": "timestamp",
  "start_time": "2024-07-01T10:00:00Z",
  "end_time": "2024-07-01T12:00:00Z",
  "title": "Morning Soccer Match",
  "created_by": "user_id",
  "roster": [{ "player_id": "player_id", "joined_at": "timestamp" }],
  "status": "scheduled",
  "location_id": "1",
  "location_name": "Sylvan Court 1",
  "max_players": 10,
  "sport_type": "Basketball"
}
```

---

#### POST /api/games/{game_id}/join/
**Description:** Join a game.  
**Request Body:**
```json
{ "player_id": "firebase_uid" }
```
**Response:**
```json
{ "success": "Player player_id joined game game_id" }
```
or  
```json
{ "error": "reason" }
```

---

## 🛠 Next Steps for Development

### 1. Implement In-Memory Game Tracker
- Maintain an in-memory list or background service that tracks all scheduled and ongoing games.
- Periodically check game times to:
  - Update status (e.g., from `scheduled` to `ongoing` to `completed`).
  - Trigger email or push notifications when a game is about to start.

### 2. Add Leave Game Functionality
- Create endpoint `/api/games/{game_id}/leave/`
- Functionality:
  - Remove player from game roster.
  - Update player’s ongoing_games and upcoming_games in their profile.

### 3. Implement Email Notifications
- Send notifications when:
  - Player joins or leaves a game.
  - A game is about to start.
- Can use Firebase Cloud Messaging (FCM) or Django’s send_mail for email alerts.

---

## 🧠 Developer Notes

- All datetimes should be ISO 8601 formatted strings with UTC timezone (e.g., "2024-07-01T10:00:00Z").
- Make sure to compare timestamps using UTC to avoid timezone mismatches.
- Firebase DocumentReference objects should be serialized as IDs or strings before returning in API responses.

---

## 📂 Example Game Document Structure

```json
{
  "created_at": "2025-10-27T23:00:50Z",
  "start_time": "2024-07-01T10:00:00Z",
  "end_time": "2024-07-01T12:00:00Z",
  "title": "Morning Soccer Match",
  "sport_type": "Basketball",
  "created_by": "650f1c2e4f1a2567eb8d9c3a",
  "roster": [
    {
      "player_id": "650f1c2e4f1a2567eb8d9c3a",
      "joined_at": "2025-10-27T23:00:50Z"
    }
  ],
  "location_name": "Sylvan Court 1",
  "location_id": "1",
  "max_players": 10,
  "status": "scheduled"
}
```

---

## 👨‍💻 Contributors

**Developer:** Kirat, Rohit, Angad, Sharath  
**Project:** CS 520 Final Project  
**Institution:** University of Massachusetts Amherst

---
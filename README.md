# Campus-pickup-sports
Our project focuses on making it simple and fun for UMass students and community members to find and join casual pick-up sports games, like basketball, soccer, or volleyball, without the hassle of planning or organizing. Right now, it’s often hard to know who’s available to play or where a game is happening. As a result, campus courts and fields go unused, and students miss out on opportunities to stay active and meet new people.

To solve this, we’re building a web application that connects players based on their chosen sport, location, and preferred time. Users can browse upcoming games, create their own sessions, and see who else has joined. They’ll also get optional reminders and updates when new players sign up or when their game is about to start.

Our main goal is to make organizing and joining games quick and effortless, reducing coordination overhead while helping students stay active and social. We also want to encourage better use of campus recreational spaces and foster a stronger sense of community around sports. The primary users will be UMass students, while campus recreation staff and student clubs can benefit from seeing how different spaces are being used.
# How to run the backend:
## Prerequisites

- Python 3.10+
- Firebase project with Firestore and Authentication enabled
- Service account JSON key (Admin SDK) placed in `src/backend/`

## Virtual Environment Setup
1. Create a virtual environment `python -m venv .venv`
2. Activate the virtual environment `source .venv/bin/activate`
3. Install dependencies `pip install -r requirements.txt`

## Firebase Setup
1. Go to your Firebase console → Project settings → Service accounts.
2. Click "Generate new private key" and save the JSON key file.
3. Place the key file in the `./src/backend` directory. After this replace the path to your key in the `./src/api/firebase_auth.py` file. **DO NOT PUSH THIS TO GITHUB: Add the name of this key into .gitignore to avoid pushing it to main.** 
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
## Environment Setup
Environment file `src/backend/.env` should contain:
```
SECRET_KEY=dev-secret-key-please-change-12345
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
```
Add this file to `.gitignore` and to the backend directory.

## 🏃‍♂️ Running the Server
To start the Cron Job run:
``` bash
python manage.py qcluster
```

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

# How to run the frontend:

## Environment Setup

Environment file `src/frontend/.env` should contain:
```
VITE_API_BASE=http://127.0.0.1:8000/api
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

Add this file to `.gitignore` and to the frontend directory.

## Running the Frontend

Run `npm install` in the frontend directory to install dependencies. To run the frontend locally cd into `./src/frontend`:
```bash
npm run dev
```

Frontend runs at:
```
http://127.0.0.1:5173/
```

---

# How to Run tests:

Make sure the application is running before running tests.

```bash
1. Run `python manage.py test api` in the backend directory for unit tests
2. Run `python test_api_live.py` in the tests directory for integration tests
3. Run `python test_selenium_game_creation.py` in the tests directory for selenium tests
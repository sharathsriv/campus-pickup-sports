# Sports Game Management API (Backend)

Django + Firebase (Firestore + Admin SDK) for players and games. Exposes REST APIs under `/api/...`.

---

## 1) Prerequisites

- Python 3.10+
- Firebase project with Firestore and Authentication enabled
- Service account JSON key (Admin SDK) placed in `src/backend/`

---

## 2) Local Setup

```bash
cd src/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt
```

Environment file `src/backend/.env` (example):
```
SECRET_KEY=dev-secret-key-please-change-12345
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
```

Firebase key path in `api/firebase_auth.py`:
```python
SERVICE_ACCOUNT_KEY_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    '../<your-key-file>.json'
)
```
Add the key filename and `.env` to `.gitignore`.

---

## 3) Required Firestore Collections

- `players` (docs keyed by uid)
- `games`
- `locations` (e.g., doc id `1` with fields: `location_name`, `max_players`, `sport_type`)
- `in_memory` collection with docs `scheduled` and `ongoing`, each with field `storage` = []

---

## 4) Running the Server

```bash
cd src/backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

Default: http://127.0.0.1:8000/

---

## 5) API Endpoints

- `POST /api/players/` — create Firebase user + Firestore profile
- `GET /api/players/?token=<idToken>` — resolve uid from Firebase ID token
- `GET /api/players/account/<player_id>/` — player details
- `POST /api/players/account/<player_id>/` — update name/email
- `GET /api/games/` — list games
- `GET /api/games/<game_id>/` — game detail
- `POST /api/games/` — create game
  - requires `start_time`, `end_time` (ISO), `title`, `location_id`, `created_by`
  - start < end, duration ≤ 2h, start in future
- `POST /api/games/<game_id>/join/` — join game (requires `player_id`)
- `POST /api/games/<game_id>/leave/` — leave game (requires `player_id`)

---

## 6) Notes

- CORS is enabled for local dev (`django-cors-headers`).
- All datetimes should be ISO 8601 with offset, e.g., `2025-12-12T18:00:00+00:00`.
- Validation checks location existence, player existence, time window, and duration.

---

## 7) Ownership

- Backend: Kirat Arora
- Integration: Sharath Srivatsan Manivannan


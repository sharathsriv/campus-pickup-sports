# UMass PickUp Sports (Frontend)

A React + Vite web app for discovering and joining campus pick-up sports games on campus. Built for **CS 520 – Theory and Practice of Software Engineering**.

---

## 1. Overview

- **Backend (teammate)** – Django + Firebase (Firestore + Firebase Auth via Admin SDK), exposes `/api/...`.
- **Frontend** – React + Vite (this repo), now wired to the backend APIs.

Roles:
- Kirat Arora – Backend
- Angad Deep Singh – Frontend UI
- Rohit Reddy Goli – Architecture / testing
- Sharath Srivatsan Manivannan – Integration (frontend ↔ backend)

---

## 2. Current Behavior

- Sign Up: Calls backend `POST /api/players/` to create Firebase user + player profile.
- Login: Still mock-token-based (not yet using Firebase client SDK). Use Sign Up to get a valid `uid`.
- Games list: Calls backend `GET /api/games/`.
- Create Game: Calls backend `POST /api/games/` (requires valid `created_by` uid, future start time, ≤2h duration).
- Join / Leave: Calls backend `POST /api/games/{id}/join/` and `/leave/`, then reloads list to update spots.

---

## 3. Tech Stack

- React (Vite), JavaScript (ES6+)
- Inline styles + small global reset
- State via React hooks (`useState`, `useEffect`)
- API calls via `fetch` in `src/api/index.js`

---

## 4. Project Structure (frontend)

```
frontend/
├── src/
│   ├── api/            # API wrapper (calls Django backend)
│   ├── components/     # Button, Dropdown, GameCard, Input
│   ├── pages/          # Login, Games, CreateGame
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## 5. Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

Environment variable (create `frontend/.env`):
```
VITE_API_BASE=http://127.0.0.1:8000/api
```

---

## 6. Flows to Try (integrated)

1) **Sign Up → Games**
   - Use Sign Up (not Login) to create a user; this gives you a valid `uid` for create/join.
2) **Create Game**
   - Future date/time, duration ≤ 2 hours, valid location_id (e.g., “1”).
   - Should appear on Games list after creation.
3) **Join / Leave**
   - Join should succeed and spots update after the list reloads.
   - Leave should restore spots.

---

## 7. Future Work (Auth)

- Implement Firebase client SDK on the frontend.
- On Login, obtain Firebase ID token and call `GET /api/players/?token=<idToken>` to resolve `uid`.
- Persist session to avoid re-signup.

---

## 8. Credits

- Frontend UI: Angad Deep Singh
- Integration and wiring to backend APIs: Sharath Srivatsan Manivannan
- Backend: Kirat Arora
- Architecture/testing: Rohit Reddy Goli

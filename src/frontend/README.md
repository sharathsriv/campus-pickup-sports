# UMass PickUp Sports

A web application that helps UMass students find and join casual pick-up sports games on campus.

This project was built as the final project for **CS 520 – Theory and Practice of Software Engineering**.

---

## 1. Overview

The system has two major parts:

- **Backend (teammate)** – Django + Firebase
  - Manages players, games, and join requests
  - Exposes REST APIs under `/api/...`

- **Frontend (this work)** – React + Vite
  - Fully implemented by Angad
  - Implements all user-facing screens and interactions
  - Currently uses **mock APIs** for demo (no backend required)

For the course project, my responsibility was **frontend design and implementation**: turning our Figma mockups into a working web UI.

---

## 2. Features (Frontend)

### Authentication UI

- Login / Sign Up tabs on a single screen
- Input validation on the client side (required fields)
- Friendly error messages and loading states

> Note: Login / Signup currently use a **mock API**.  
> The real authentication flow will be wired to Firebase by the backend owner.

### Games List

- “Pick-Up Sports Games” dashboard
- Filters:
  - **Sport** dropdown (All Sports, Basketball, Soccer, Volleyball, …)
  - **Skill Level** dropdown (All Levels, Beginner, Intermediate, Advanced)
- Responsive card layout for games:
  - Sport and skill badge
  - Location, date, time
  - Players and spots left
  - Organizer name
- Buttons:
  - **Join Game** (mock – shows success alert)
  - **Leave** (mock)

### Create Game (UI only)

- Dedicated page with a form to create a new game:
  - Title
  - Sport
  - Skill level
  - Location
  - Date & time
  - Max players
  - Description
- “Create Game (Mock)” button logs payload to console and shows success message
- “Back to Games” button returns to the games list

This page is intentionally **frontend-only**: it demonstrates the user flow and UI, and can later be connected to a real `/api/games/` endpoint.

---

## 3. Tech Stack

- **Frontend:** React (Vite)
- **Language:** JavaScript (ES6+)
- **Styling:** Inline styles + small global reset
- **State Management:** React hooks (`useState`, `useEffect`)
- **Mock Data:** Local `mock/games.js` and `api/index.js`

---

## 4. Project Structure

```text
campus-pickup-sports/
├── backend/            # Django backend (teammate's work)
├── frontend/           # React frontend (this work)
│   ├── src/
│   │   ├── api/        # Mock API wrapper
│   │   ├── components/ # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── GameCard.jsx
│   │   │   └── Input.jsx
│   │   ├── mock/       # Mock games data
│   │   │   └── games.js
│   │   ├── pages/      # Top-level screens
│   │   │   ├── Login.jsx
│   │   │   ├── Games.jsx
│   │   │   └── CreateGame.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md           # This file
```

---

## 5. Running the Frontend (Mock Mode – No Backend Needed)

You can run and demo the UI without starting Django or Firebase.

```bash
cd frontend
npm install
npm run dev
```

Then open:

- http://localhost:5173

Flows to try:

1. **Sign Up → Games**
   - Click _Sign Up_ tab
   - Enter name, email, password
   - You are taken to the Games dashboard (mock user)

2. **Filter Games**
   - Change Sport / Skill Level filters
   - Cards update based on selected filters

3. **Join / Leave Game**
   - Click **Join Game** → shows a success alert (mock)
   - Click **Leave** → shows a mock message

4. **Create Game**
   - Click **+ Create Game**
   - Fill the form and press **Create Game (Mock)**
   - Data is logged in the browser console

---

## 6. Backend Integration (Future Work)

Right now the frontend uses a **mock API** in `src/api/index.js`.  
To integrate with the real backend, we plan to:

- Replace mock calls with `axios` requests to:
  - `POST /api/players/` – create player
  - `GET /api/games/` – list games
  - `POST /api/games/{id}/join/` – join game
- Hook Create Game page to `POST /api/games/`

This work will be done by the backend owner and is **not part of my CS 520 frontend deliverable**.

---

## 7. My Contributions (Angad – Frontend)

- Set up React + Vite project inside the shared repo
- Implemented:
  - Login / Sign Up UI with tab switching
  - Games dashboard UI and layout
  - GameCard, Dropdown, Button, and Input reusable components
  - Create Game UI page and navigation
- Implemented mock API and data layer so the entire frontend can be demoed without a running backend
- Ensured the implementation matches the Figma mockups provided in the mid-project report

// frontend/src/api/index.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  // try json, else return text
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const signup = async (name, email, password) => {
  // create Firebase user via backend and return uid
  const res = await request("/players/", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return { uid: res.uid, email };
};

// Login without Firebase client SDK: lookup uid by email (no password verification).
// This matches current backend capability: GET /api/players/by-email/?email=...
export const login = async (email, password) => {
  const res = await request(`/players/by-email/?email=${encodeURIComponent(email)}`, {
    method: "GET",
  });
  return { uid: res.uid, email };
};

export const getGames = async () => {
  return request("/games/", { method: "GET" });
};

export const joinGame = async (gameId, playerId) => {
  return request(`/games/${gameId}/join/`, {
    method: "POST",
    body: JSON.stringify({ player_id: playerId }),
  });
};

export const leaveGame = async (gameId, playerId) => {
  return request(`/games/${gameId}/leave/`, {
    method: "POST",
    body: JSON.stringify({ player_id: playerId }),
  });
};

export const createGame = async (payload) => {
  return request("/games/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
// frontend/src/api/index.js
import { mockGames } from "../mock/games";

// small helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const signup = async (name, email, password) => {
  await delay(500);
  return { uid: "mock-user-id", name, email };
};

export const login = async (email, password) => {
  await delay(500);
  return { uid: "mock-user-id", name: "Mock User", email };
};

export const getGames = async () => {
  await delay(300);
  return mockGames;
};

export const joinGame = async (gameId, playerId) => {
  await delay(300);
  return { success: true };
};

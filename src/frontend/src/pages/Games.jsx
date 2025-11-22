// frontend/src/pages/Games.jsx
import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import GameCard from "../components/GameCard";
import Button from "../components/Button";
import * as api from "../api";

const SPORT_OPTIONS = [
  "All Sports",
  "Basketball",
  "Soccer",
  "Volleyball",
  "Tennis",
  "Baseball",
  "Football",
];

const LEVEL_OPTIONS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function Games({ currentUser, onCreateGameClick }) {
  const [sportFilter, setSportFilter] = useState("All Sports");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getGames();
        setGames(data);
      } catch (err) {
        console.error("Failed to load games", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredGames = games.filter((g) => {
    const bySport =
      sportFilter === "All Sports" ? true : g.sport === sportFilter;
    const byLevel =
      levelFilter === "All Levels" ? true : g.level === levelFilter;
    return bySport && byLevel;
  });

  const handleJoin = async (game) => {
    try {
      await api.joinGame(game.id, currentUser?.uid || "mock-user-id");
      alert(`Joined ${game.sport} game!`);
    } catch (err) {
      console.error(err);
      alert("Failed to join (mock).");
    }
  };

  const handleLeave = (game) => {
    alert(`Left ${game.sport} game (mock).`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        background: "#F4F7FE",
      }}
    >
      <div style={{ maxWidth: "1120px", width: "100%" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 600 }}>
              Pick-Up Sports Games
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Find and join casual sports games around campus
            </p>
          </div>
          <Button onClick={onCreateGameClick}>
            <span style={{ marginRight: "6px", fontSize: "18px" }}>+</span>
            Create Game
          </Button>
        </div>

        {/* Filters */}
        {/* (rest of file unchanged) */}
        {/* ... keep your existing filters and cards code here ... */}

        {loading ? (
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading games...</p>
        ) : filteredGames.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            No games match your filters.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onJoin={handleJoin}
                onLeave={handleLeave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

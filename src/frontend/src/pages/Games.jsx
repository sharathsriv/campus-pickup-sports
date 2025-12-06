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

  const mapGames = (data) =>
    data.map((g) => ({
      id: g.id,
      sport: g.sport_type || "Basketball",
      level: "All Levels",
      title: g.title,
      location: g.location_name,
      date: g.start_time?.slice(0, 10),
      time: `${g.start_time?.slice(11, 16)} - ${g.end_time?.slice(11, 16)}`,
      players: (g.roster || []).length,
      spotsLeft: (g.max_players || 0) - (g.roster || []).length,
      organizer: g.created_by,
    }));

  const loadGames = async () => {
    setLoading(true);
    try {
      const data = await api.getGames();
      setGames(mapGames(data));
    } catch (err) {
      console.error("Failed to load games", err);
      alert("Failed to load games from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const filteredGames = games.filter((g) => {
    const bySport = sportFilter === "All Sports" ? true : g.sport === sportFilter;
    const byLevel = levelFilter === "All Levels" ? true : g.level === levelFilter;
    return bySport && byLevel;
  });

  const handleJoin = async (game) => {
    try {
      await api.joinGame(game.id, currentUser?.uid || "mock-user-id");
      await loadGames(); // refresh to update spots
      alert(`Joined ${game.sport} game!`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to join game.");
    }
  };

  const handleLeave = async (game) => {
    try {
      await api.leaveGame(game.id, currentUser?.uid || "mock-user-id");
      await loadGames(); // refresh to update spots
      alert(`Left ${game.sport} game.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to leave game.");
    }
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

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <Dropdown
            label="Sport"
            options={SPORT_OPTIONS}
            value={sportFilter}
            onChange={setSportFilter}
          />
          <Dropdown
            label="Skill Level"
            options={LEVEL_OPTIONS}
            value={levelFilter}
            onChange={setLevelFilter}
          />
        </div>

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
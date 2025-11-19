import { useEffect, useState } from "react";
import axios from "axios";
import GameCard from "../components/GameCard";

const GAMES_API_URL = "http://127.0.0.1:8000/games";

function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(GAMES_API_URL);
        setGames(response.data || []);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Available Games</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {games.map((game) => (
          <GameCard key={game.id || game._id} game={game} />
        ))}
      </div>
    </div>
  );
}

export default Games;

// frontend/src/components/GameCard.jsx
import Button from "./Button";

export default function GameCard({ game, onJoin, onLeave }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "16px",
        boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
        width: "320px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{game.sport}</h3>
        <span
          style={{
            fontSize: "11px",
            padding: "4px 10px",
            borderRadius: "999px",
            background: "#020617",
            color: "white",
          }}
        >
          {game.level}
        </span>
      </div>

      <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "12px" }}>
        {game.title}
      </p>

      <div style={{ fontSize: "13px", color: "#4b5563", marginBottom: "12px" }}>
        <div>📍 {game.location}</div>
        <div>📅 {game.date}</div>
        <div>⏰ {game.time}</div>
        <div>
          👥 {game.playersText}{" "}
          <span style={{ color: "#16a34a" }}>
            ({game.spotsLeft} spots left)
          </span>
        </div>
        <div>🙋 Organized by {game.organizer}</div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          fullWidth
          onClick={() => onJoin && onJoin(game)}
        >
          Join Game
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => onLeave && onLeave(game)}
        >
          Leave
        </Button>
      </div>
    </div>
  );
}

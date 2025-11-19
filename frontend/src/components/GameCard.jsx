import { useState } from "react";
import axios from "axios";
import Button from "./Button";

const JOIN_GAME_API_URL = "http://127.0.0.1:8000/game/join";

/**
 * Expects a `game` object with fields like:
 *  - id or _id (identifier used for join)
 *  - sport
 *  - skillLevel
 *  - location
 *  - date
 *  - time
 *  - playersNeeded
 *  - joined (optional initial flag)
 */
function GameCard({ game }) {
  const {
    id,
    _id,
    sport = "Unknown sport",
    skillLevel = "Any level",
    location = "TBD location",
    date = "",
    time = "",
    playersNeeded = "",
    joined: initialJoined = false,
  } = game || {};

  const gameId = id || _id; // works with either field name

  const [joined, setJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinClick = async () => {
    // If backend requires id, we stop if it's missing
    if (!gameId) {
      console.error("No game_id found on game object");
      setError("Unable to join: missing game id.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call backend join API
      await axios.post(JOIN_GAME_API_URL, { game_id: gameId });

      // If call succeeds, mark as joined in UI
      setJoined(true);
    } catch (err) {
      console.error(err);
      setError("Failed to join game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#020617",
        borderRadius: "16px",
        padding: "14px 14px 12px",
        border: "1px solid #1f2937",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Top row: sport title + skill badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 600,
            color: "#e5e7eb",
          }}
        >
          {sport}
        </h3>

        <span
          style={{
            fontSize: "11px",
            padding: "4px 8px",
            borderRadius: "999px",
            background: "#1e293b",
            color: "#a5b4fc",
            whiteSpace: "nowrap",
          }}
        >
          {skillLevel}
        </span>
      </div>

      {/* Location */}
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "#9ca3af",
        }}
      >
        📍 {location}
      </p>

      {/* Time & date */}
      {(date || time) && (
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          🕒 {date} {time}
        </p>
      )}

      {/* Players + Join button */}
      <div
        style={{
          marginTop: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {playersNeeded && (
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#a5b4fc",
            }}
          >
            Players needed: {playersNeeded}
          </p>
        )}

        <Button
          variant={joined ? "outline" : "primary"}
          disabled={loading || joined}
          onClick={handleJoinClick}
        >
          {joined ? "Joined" : loading ? "Joining..." : "Join"}
        </Button>
      </div>

      {error && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "12px",
            color: "#fecaca",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default GameCard;

// frontend/src/pages/CreateGame.jsx
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  padding: "32px 16px",
  background: "#F4F7FE",
};

const innerStyle = {
  width: "100%",
  maxWidth: "720px",
};

const cardStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  marginBottom: "4px",
  color: "#374151",
};

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  fontSize: "14px",
  backgroundColor: "#f9fafb",
};

export default function CreateGame({ onBack }) {
  const [form, setForm] = useState({
    title: "",
    sport: "Basketball",
    level: "Beginner",
    location: "",
    date: "",
    time: "",
    maxPlayers: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mock game created:", form);
    setMessage("Game created (mock only – UI demo).");
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 600 }}>
              Create a Pick-Up Game
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Fill out the details below to create a new game (frontend mock).
            </p>
          </div>

          {onBack && (
            <Button variant="secondary" onClick={onBack}>
              ← Back to Games
            </Button>
          )}
        </div>

        {/* Form card */}
        <form style={cardStyle} onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <Input
                label="Title"
                name="title"
                placeholder="Evening 5v5 at Boyden"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Sport</label>
              <select
                name="sport"
                value={form.sport}
                onChange={handleChange}
                style={selectStyle}
              >
                <option>Basketball</option>
                <option>Soccer</option>
                <option>Volleyball</option>
                <option>Tennis</option>
                <option>Baseball</option>
                <option>Football</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Skill Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                style={selectStyle}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <Input
                label="Date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <Input
                label="Location"
                name="location"
                placeholder="Boyden Gym, Court 2"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <Input
                label="Max Players"
                name="maxPlayers"
                type="number"
                placeholder="10"
                value={form.maxPlayers}
                onChange={handleChange}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Quick casual game, all levels welcome."
                value={form.description}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  backgroundColor: "#f9fafb",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          {message && (
            <p
              style={{
                fontSize: "14px",
                color: "#16a34a",
                marginBottom: "12px",
              }}
            >
              {message}
            </p>
          )}

          <Button fullWidth type="submit">
            Create Game (Mock)
          </Button>

          <p
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            Note: This page is purely frontend UI. Data is not saved to the
            backend.
          </p>
        </form>
      </div>
    </div>
  );
}

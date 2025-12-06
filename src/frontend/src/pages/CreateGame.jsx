// frontend/src/pages/CreateGame.jsx
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import * as api from "../api";

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

// Generate time slots in 30-minute intervals for the whole day
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const date = new Date(2025, 0, 1, hour, minute);
      const label = date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      const value = date.toTimeString().slice(0, 5); // "HH:MM"
      slots.push({ label, value });
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export default function CreateGame({ onBack, currentUser }) {
  const [form, setForm] = useState({
    title: "",
    sport: "Basketball",
    location: "1", // location_id (must exist in Firestore)
    date: "",
    startTime: "",
    endTime: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!currentUser?.uid) {
      setMessage("Please sign up or log in first.");
      return;
    }
    try {
      // Build ISO strings with offset for Python fromisoformat
      const startIso = `${form.date}T${form.startTime}:00+00:00`;
      const endIso = `${form.date}T${form.endTime}:00+00:00`;
      const payload = {
        title: form.title,
        sport_type: form.sport,
        location_id: form.location,
        start_time: startIso,
        end_time: endIso,
        created_by: currentUser.uid,
      };
      await api.createGame(payload);
      setMessage("Game created!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create game.");
    }
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
              Fill out the details below to create a new game.
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
              <label style={labelStyle}>Start Time</label>
              <select
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="">Select start time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={`start-${slot.value}`} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>End Time</label>
              <select
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="">Select end time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={`end-${slot.value}`} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Location</label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                style={selectStyle}
              >
                {/* values must match Firestore doc IDs */}
                <option value="1">Sylvan Court 1</option>
                <option value="2">Southwest Court 1</option>
                <option value="3">Southwest Court 2</option>
                <option value="4">Boyden Court 1</option>
                <option value="5">Boyden Court 2</option>
                <option value="6">Rec Field 1</option>
                <option value="7">Rec Field 2</option>
                <option value="8">Rec Turf 1</option>
              </select>
            </div>
          </div>

          {message && (
            <p
              style={{
                fontSize: "14px",
                color: message.includes("Failed") ? "#ef4444" : "#16a34a",
                marginBottom: "12px",
              }}
            >
              {message}
            </p>
          )}

          <Button fullWidth type="submit">
            Create Game
          </Button>
        </form>
      </div>
    </div>
  );
}
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

// Generate time slots in 30-minute intervals for the whole day
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const date = new Date(2025, 0, 1, hour, minute);
      const label = date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }); // e.g. "6:00 AM"
      const value = date.toTimeString().slice(0, 5); // "HH:MM"
      slots.push({ label, value });
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export default function CreateGame({ onBack }) {
  const [form, setForm] = useState({
    title: "",
    sport: "Basketball",
    location: "Sylvan Court 1",
    date: "",
    startTime: "",
    endTime: "",
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
            {/* Title - full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <Input
                label="Title"
                name="title"
                placeholder="Evening 5v5 at Boyden"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            {/* Sport (Basketball / Soccer only) */}
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

            {/* Date */}
            <div>
              <Input
                label="Date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            {/* Start Time dropdown */}
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

            {/* End Time dropdown */}
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

            {/* Location dropdown - full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Location</label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                style={selectStyle}
              >
                <option>Sylvan Court 1</option>
                <option>Southwest Court 1</option>
                <option>Southwest Court 2</option>
                <option>Boyden Court 1</option>
                <option>Boyden Court 2</option>
                <option>Rec Field 1</option>
                <option>Rec Field 2</option>
                <option>Rec Turf 1</option>
              </select>
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

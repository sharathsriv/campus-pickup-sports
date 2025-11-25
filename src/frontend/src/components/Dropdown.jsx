// frontend/src/components/Dropdown.jsx
import { useEffect, useRef, useState } from "react";

export default function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          fontSize: "14px",
          textAlign: "left",
        }}
      >
        {value || label}
        <span style={{ float: "right", fontSize: "12px", color: "#6b7280" }}>
          ▼
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
            zIndex: 10,
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "14px",
                textAlign: "left",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

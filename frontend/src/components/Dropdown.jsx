import { useState } from "react";

/**
 * Simple custom dropdown.
 *
 * Props:
 *  - label?: string (optional small label above)
 *  - value: string
 *  - options: array of strings OR { value, label } objects
 *  - onChange: (newValue: string) => void
 *  - fullWidth?: boolean
 */
function Dropdown({ label, value, options = [], onChange, fullWidth = false }) {
  const [open, setOpen] = useState(false);

  // Normalize options so we can accept ["a","b"] or [{value,label}]
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedLabel =
    normalizedOptions.find((o) => o.value === value)?.label || "Select";

  const handleSelect = (val) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div
      style={{
        position: "relative",
        minWidth: fullWidth ? "100%" : "180px",
      }}
    >
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "12px",
            marginBottom: "4px",
            color: "#e5e7eb",
          }}
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
          borderRadius: "999px",
          border: "1px solid #1f2937",
          background: "#020617",
          color: "#e5e7eb",
          padding: "8px 12px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span>{selectedLabel}</span>
        <span
          style={{
            fontSize: "10px",
            marginLeft: "8px",
          }}
        >
          {open ? "▲" : "▼"}
        </span>
      </div>

      {/* Options list */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            background: "#020617",
            borderRadius: "12px",
            border: "1px solid #1f2937",
            marginTop: "4px",
            zIndex: 20,
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {normalizedOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                color:
                  opt.value === value ? "#22c55e" : "#e5e7eb",
                background:
                  opt.value === value ? "#111827" : "transparent",
                cursor: "pointer",
              }}
            >
              {opt.label}
            </div>
          ))}
          {normalizedOptions.length === 0 && (
            <div
              style={{
                padding: "8px 12px",
                fontSize: "13px",
                color: "#9ca3af",
              }}
            >
              No options
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

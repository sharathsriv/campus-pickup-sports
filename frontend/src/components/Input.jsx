/**
 * Reusable labeled input.
 *
 * Props:
 *  - label?: string
 *  - id?: string
 *  - type?: string
 *  - placeholder?: string
 *  - value: string
 *  - onChange: (event) => void
 */
function Input({
  label,
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: "6px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#0f172a",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #cbd5f5",
          fontSize: "14px",
          outline: "none",
        }}
        required
      />
    </div>
  );
}

export default Input;

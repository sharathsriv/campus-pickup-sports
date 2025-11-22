// frontend/src/components/Input.jsx
export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div style={{ marginBottom: "12px" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            fontSize: "14px",
            marginBottom: "4px",
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          fontSize: "14px",
          backgroundColor: "#f9fafb",
        }}
      />
    </div>
  );
}

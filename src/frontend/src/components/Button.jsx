// frontend/src/components/Button.jsx
export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
  };

  const variants = {
    primary: {
      backgroundColor: "#020617",
      color: "white",
    },
    secondary: {
      backgroundColor: "white",
      color: "#111827",
      border: "1px solid #e5e7eb",
    },
  };

  const style = {
    ...baseStyle,
    ...(variants[variant] || variants.primary),
    width: fullWidth ? "100%" : "auto",
  };

  return (
    <button style={style} className={className} {...props}>
      {children}
    </button>
  );
}

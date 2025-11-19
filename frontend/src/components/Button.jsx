/**
 * Reusable button.
 *
 * Props:
 *  - children: text inside the button
 *  - variant: "primary" | "outline" | "ghost"
 *  - fullWidth?: boolean
 *  - disabled?: boolean
 *  - onClick?: () => void
 */
function Button({
  children,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
}) {
  const baseStyle = {
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    border: "1px solid transparent",
    transition: "transform 0.08s ease, box-shadow 0.08s ease, opacity 0.08s ease",
    width: fullWidth ? "100%" : "auto",
  };

  let style = { ...baseStyle };

  if (variant === "primary") {
    style = {
      ...style,
      background: "linear-gradient(90deg,#4f46e5,#22c55e)",
      color: "white",
      boxShadow: "0 12px 25px rgba(37,99,235,0.3)",
    };
  } else if (variant === "outline") {
    style = {
      ...style,
      background: "transparent",
      color: "#e5e7eb",
      borderColor: "#4b5563",
    };
  } else if (variant === "ghost") {
    style = {
      ...style,
      background: "transparent",
      color: "#9ca3af",
    };
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      style={style}
      onMouseDown={(e) => {
        // small click feedback
        e.currentTarget.style.transform = "translateY(1px)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        if (variant === "primary") {
          e.currentTarget.style.boxShadow =
            "0 12px 25px rgba(37,99,235,0.3)";
        }
      }}
    >
      {children}
    </button>
  );
}

export default Button;

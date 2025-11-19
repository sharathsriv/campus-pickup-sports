import { useState } from "react";
import axios from "axios";

/**
 * Props:
 *  - onLoginSuccess: function coming from App.jsx
 *    → when called, it switches screen to Games page
 */
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 👉 TODO: change this to whatever your teammate's backend uses
  const LOGIN_API_URL = "http://127.0.0.1:8000/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(LOGIN_API_URL, {
        email,
        password,
      });

      // Example: if backend returns { success: true, token: "...", user: {...} }
      // You can store token if you want:
      // localStorage.setItem("token", response.data.token);

      // For now we just assume login was successful if no error was thrown
      onLoginSuccess();
    } catch (err) {
      console.error(err);

      // Show helpful error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a", // dark navy (nice background)
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "32px 28px",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.3)",
        }}
      >
        {/* App title (matches your mockup vibe) */}
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "700",
            textAlign: "center",
            color: "#0f172a",
          }}
        >
          Campus Pickup Sports
        </h1>
        <p
          style={{
            marginTop: "8px",
            marginBottom: "24px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Log in to find and join pickup games on campus.
        </p>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#0f172a",
              }}
            >
              UMass Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@student.umass.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5f5",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#0f172a",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5f5",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "999px",
              border: "none",
              background:
                loading ? "rgba(79, 70, 229, 0.7)" : "linear-gradient(90deg,#4f46e5,#22c55e)",
              color: "white",
              fontWeight: 600,
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s ease",
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Footer text – for future Signup page */}
        <p
          style={{
            marginTop: "16px",
            fontSize: "13px",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          Don’t have an account yet? Signup page coming soon.
        </p>
      </div>
    </div>
  );
}

export default Login;

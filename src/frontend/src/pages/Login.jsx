import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import * as api from "../api";

export default function Login({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;
      if (activeTab === "login") {
        user = await api.login(form.email, form.password); // password unused in current backend flow
      } else {
        user = await api.signup(form.name, form.email, form.password);
      }
      onLoginSuccess(user);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F7FE",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: "420px", width: "100%" }}>
        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏆</div>
          <h1 style={{ fontSize: "26px", fontWeight: 600 }}>
            UMass PickUp Sports
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Connect with students for pick-up games
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "#e5e7eb",
            borderRadius: "999px",
            padding: "4px",
            marginBottom: "16px",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background:
                activeTab === "login" ? "white" : "transparent",
              boxShadow:
                activeTab === "login"
                  ? "0 4px 10px rgba(15,23,42,0.1)"
                  : "none",
              fontWeight: activeTab === "login" ? 600 : 400,
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background:
                activeTab === "signup" ? "white" : "transparent",
              boxShadow:
                activeTab === "signup"
                  ? "0 4px 10px rgba(15,23,42,0.1)"
                  : "none",
              fontWeight: activeTab === "signup" ? 600 : 400,
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: 4 }}>
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: 16 }}>
            {activeTab === "login"
              ? "Log in to your account to find games"
              : "Sign up to join pick-up games"}
          </p>

          {activeTab === "signup" && (
            <Input
              label="Full Name"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />
          )}

          <Input
            label="Email"
            name="email"
            placeholder="name@umass.edu"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: 8 }}>
              {error}
            </p>
          )}

          <div style={{ marginTop: "8px", marginBottom: "8px" }}>
            <Button fullWidth type="submit" disabled={loading}>
              {loading
                ? "Loading..."
                : activeTab === "login"
                ? "Log In"
                : "Sign Up"}
            </Button>
          </div>

          {activeTab === "login" && (
            <p
              style={{
                color: "#2563eb",
                fontSize: "13px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Forgot password?
            </p>
          )}
        </form>

        <p
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

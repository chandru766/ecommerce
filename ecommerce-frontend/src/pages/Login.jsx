import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api"; 
import logo from "../assets/logo.jpg"; // ✅ Import your logo (adjust path if needed)

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await loginUser(form);
      const token = res.data.token;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Parse JWT to extract role
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role || "ROLE_USER";

      setMessage("✅ Login successful! Redirecting...");

      // Redirect based on role
      setTimeout(() => {
        if (role === "ROLE_ADMIN") navigate("/admin-dashboard");
        else navigate("/dashboard");
      }, 800);
    } catch (err) {
      setMessage(err.response?.data || "❌ Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* ✅ Logo at top */}
        <img
          src={logo}
          alt="E-commerce Logo"
          style={{ width: "90px", marginBottom: "10px" }}
        />

        <h2 style={{ color: "#16a34a", marginBottom: "30px" }}>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <div style={{ textAlign: "right", marginBottom: "18px" }}>
            <Link to="/forgot-password" style={forgotPasswordStyle}>
              Forgot Password?
            </Link>
          </div>
          <button type="submit" style={buttonStyle} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: message.includes("✅") ? "green" : "red",
              marginTop: "15px",
            }}
          >
            {message}
          </p>
        )}

        {/* ✅ Link to register */}
        <p style={{ marginTop: "20px" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#16a34a", fontWeight: "600" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #c3f0fc 0%, #e0f2fe 100%)",
  fontFamily: "'Segoe UI', sans-serif",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  background: "#fff",
  borderRadius: "20px",
  padding: "40px 30px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "18px",
  borderRadius: "12px",
  border: "1px solid #cbd5e0",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#16a34a",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const forgotPasswordStyle = {
  fontSize: "14px",
  color: "#2563eb",
  textDecoration: "none",
};

export default LoginPage;

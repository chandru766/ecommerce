import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      // Call backend to register user
      await registerUser(form);

      setMessage("✅ Registration successful! Redirecting to login...");

      // Redirect to login page after short delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data || "❌ Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "450px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    padding: "40px 30px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#16a34a",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const messageStyle = (success) => ({
    marginTop: "15px",
    color: success ? "green" : "red",
    fontWeight: "500",
  });

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "30px", color: "#16a34a" }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            style={inputStyle}
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="username"
            placeholder="Username"
            style={inputStyle}
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            style={inputStyle}
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" style={buttonStyle} disabled={isLoading}>
            {isLoading ? "Processing..." : "Register"}
          </button>
        </form>
        {message && <p style={messageStyle(message.includes("✅"))}>{message}</p>}
        <p style={{ marginTop: "20px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#16a34a", cursor: "pointer", fontWeight: "600" }}
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

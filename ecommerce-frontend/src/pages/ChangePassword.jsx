import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8080/api/profile/password",
        null,
        {
          params: {
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data); // "Password updated successfully!"
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage(err.response?.data || "❌ Password update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#16a34a",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  };

  const messageStyle = (success) => ({
    color: success ? "green" : "red",
    marginTop: "10px",
    fontWeight: "500",
  });

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px", color: "#16a34a" }}>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
      {message && (
        <p style={messageStyle(message.includes("successfully"))}>{message}</p>
      )}
      <p style={{ marginTop: "15px", cursor: "pointer", color: "#16a34a" }} onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </p>
    </div>
  );
};

export default ChangePassword;

import { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profile);
      setMessage("✅ Profile updated!");
    } catch (err) {
      setMessage(err.response?.data || "❌ Update failed");
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(passwords.oldPassword, passwords.newPassword);
      setMessage("✅ Password changed!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage(err.response?.data || "❌ Password change failed");
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <input name="name" value={profile.name} onChange={handleProfileChange} />
      <input name="email" value={profile.email} onChange={handleProfileChange} />
      <button onClick={handleUpdateProfile}>Update Profile</button>

      <h3>Change Password</h3>
      <input
        name="oldPassword"
        type="password"
        placeholder="Old Password"
        value={passwords.oldPassword}
        onChange={handlePasswordChange}
      />
      <input
        name="newPassword"
        type="password"
        placeholder="New Password"
        value={passwords.newPassword}
        onChange={handlePasswordChange}
      />
      <button onClick={handleChangePassword}>Change Password</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
// import Dashboard from "./pages/Dashboard";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";


function App() {
  const token = localStorage.getItem("token");

  // Decode role from token
  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (e) {
      localStorage.removeItem("token");
    }
  }

  return (
<Routes>
  <Route path="/" element={<div>Home Page Works</div>} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
  {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
  <Route path="/orders" element={<OrdersPage />} />
  <Route path="/users" element={<UsersPage />} />

  <Route path="*" element={<div>404 Not Found</div>} />
</Routes>

  );
}

export default App;

import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// ✅ Reuse AdminNavbar
const AdminNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-brand">
        <i className="fas fa-store"></i>
        <span>Admin Panel</span>
      </div>
      <div className="navbar-links">
        <Link to="/admin-dashboard" className="nav-link">
          <i className="fas fa-th-large"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/product" className="nav-link">
          <i className="fas fa-box"></i>
          <span>Products</span>
        </Link>
        <Link to="/orders" className="nav-link active">
          <i className="fas fa-shopping-cart"></i>
          <span>Orders</span>
        </Link>
        <Link to="#users" className="nav-link">
          <i className="fas fa-users"></i>
          <span>Users</span>
        </Link>
        <Link to="#settings" className="nav-link">
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </Link>
      </div>
      <div className="navbar-user">
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-details">
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

// ✅ Orders Page
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8080/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ View single order
  const handleView = (order) => {
    setViewingOrder(order);
  };

  const handleCloseView = () => {
    setViewingOrder(null);
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />

      <div className="admin-content">
        <div className="admin-dashboard">
          <header className="dashboard-header">
            <h2><i className="fas fa-shopping-cart"></i> Orders Dashboard</h2>
          </header>

          {message && (
            <div className={`message ${message.includes("failed") ? "error" : "success"}`}>
              <i className={`icon ${message.includes("failed") ? "fas fa-exclamation-circle" : "fas fa-check-circle"}`}></i>
              {message}
            </div>
          )}

          {isLoading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>No orders found.</p>
            </div>
          ) : (
            <div className="products-grid">
              {orders.map((o) => (
                <div key={o.id} className="product-card">
                  <div className="card-header">
                    <h4>Order #{o.id}</h4>
                    <span className="category-badge">{o.status}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>User:</strong> {o.user?.username || "Unknown"}</p>
                    <p><strong>Total:</strong> ${o.totalPrice.toFixed(2)}</p>
                    <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleView(o)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ✅ Order Detail Modal */}
          {viewingOrder && (
            <div className="modal-overlay" onClick={handleCloseView}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Order #{viewingOrder.id}</h3>
                  <button className="close-modal" onClick={handleCloseView}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <p><strong>User:</strong> {viewingOrder.user?.username || "Unknown"}</p>
                  <p><strong>Status:</strong> {viewingOrder.status}</p>
                  <p><strong>Total Price:</strong> ${viewingOrder.totalPrice.toFixed(2)}</p>
                  <p><strong>Date:</strong> {new Date(viewingOrder.createdAt).toLocaleString()}</p>
                  <h4>Products:</h4>
                  <ul>
                    {viewingOrder.products.map((p, idx) => (
                      <li key={idx}>
                        {p.name} (x{p.quantity}) - ${p.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={handleCloseView}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

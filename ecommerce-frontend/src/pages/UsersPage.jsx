import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UsersPage.css";

// ✅ Reuse AdminNavbar
const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <nav className="admin-navbar">
        <div className="navbar-brand">
          <i className="fas fa-store"></i>
          <span>Admin Panel</span>
        </div>
        
        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/admin-dashboard" className="nav-link">
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/product" className="nav-link">
            <i className="fas fa-box"></i>
            <span>Products</span>
          </Link>
          <Link to="/orders" className="nav-link">
            <i className="fas fa-shopping-cart"></i>
            <span>Orders</span>
          </Link>
          <Link to="/users" className="nav-link active">
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
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </nav>
      
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </>
  );
};

// ✅ Users Page
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isModalClosing, setIsModalClosing] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Close modal with animation
  const closeModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setViewingUser(null);
      setIsModalClosing(false);
    }, 300);
  };

  // ✅ Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-layout">
      <AdminNavbar />

      <div className="admin-content">
        <div className="admin-dashboard">
          <header className="dashboard-header">
            <h2>
              <i className="fas fa-users"></i> Users Dashboard
            </h2>
            <p>Manage and view all user accounts</p>
          </header>

          <div className="dashboard-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-select">
              <i className="fas fa-filter"></i>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="USER">Users</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          {message && (
            <div
              className={`message ${
                message.includes("Failed") ? "error" : "success"
              }`}
            >
              <i className={`fas ${message.includes("Failed") ? "fa-exclamation-circle" : "fa-check-circle"}`}></i>
              {message}
              <button onClick={() => setMessage("")} className="message-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-slash"></i>
              <h3>No users found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="users-grid">
              {filteredUsers.map((u, index) => (
                <div 
                  key={u.id} 
                  className="user-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="card-header">
                    <div className="user-avatar">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h4>{u.username}</h4>
                      <span className="user-email">{u.email}</span>
                    </div>
                    <span
                      className={`role-badge ${
                        u.role === "ADMIN" ? "admin" : "user"
                      }`}
                    >
                      <i className={`fas ${u.role === "ADMIN" ? "fa-crown" : "fa-user"}`}></i>
                      {u.role}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="user-detail">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-view"
                      onClick={() => setViewingUser(u)}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ✅ User Detail Modal */}
          {viewingUser && (
            <div 
              className={`modal-overlay ${isModalClosing ? 'closing' : ''}`} 
              onClick={closeModal}
            >
              <div 
                className={`modal ${isModalClosing ? 'closing' : ''}`} 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="modal-user-header">
                    <div className="modal-avatar">
                      {viewingUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{viewingUser.username}</h3>
                      <p>{viewingUser.email}</p>
                    </div>
                  </div>
                  <button
                    className="close-modal"
                    onClick={closeModal}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">
                        <i className="fas fa-id-card"></i> User ID
                      </span>
                      <span className="detail-value">{viewingUser.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">
                        <i className="fas fa-user-tag"></i> Role
                      </span>
                      <span className={`detail-value role ${viewingUser.role.toLowerCase()}`}>
                        <i className={`fas ${viewingUser.role === "ADMIN" ? "fa-crown" : "fa-user"}`}></i>
                        {viewingUser.role}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fas fa-calendar-plus"></i> Joined Date
                    </span>
                    <span className="detail-value">
                      {new Date(viewingUser.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn-secondary"
                    onClick={closeModal}
                  >
                    <i className="fas fa-times"></i> Close
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

export default UsersPage;
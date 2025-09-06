import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://localhost:8080/api/admin/product";

// AdminNavbar Component
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
        <Link to="/admin-dashboard" className="nav-link active">
          <i className="fas fa-th-large"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/orders" className="nav-link">
          <i className="fas fa-shopping-cart"></i>
          <span>Orders</span>
        </Link>
        <Link to="/users" className="nav-link">
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

// Main AdminDashboard Component
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    imageFile: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewingProduct, setViewingProduct] = useState(null);

  const token = localStorage.getItem("token");

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Toys",
    "Food",
    "Other",
  ];

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const productsWithImages = await Promise.all(
        res.data.map(async (p) => {
          try {
            const imgRes = await axios.get(`${API_URL}/${p.id}/image`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            });
            const imageUrl = URL.createObjectURL(imgRes.data);
            return { ...p, imageUrl };
          } catch {
            return { ...p, imageUrl: null };
          }
        })
      );

      setProducts(productsWithImages);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      if (editingProduct) {
        await axios.put(`${API_URL}/${editingProduct.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("Product updated successfully!");
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("Product added successfully!");
      }

      setForm({ name: "", description: "", category: "", price: 0, imageFile: null });
      setEditingProduct(null);
      setIsFormVisible(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("Operation failed.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleView = (product) => setViewingProduct(product);
  const handleCloseView = () => setViewingProduct(null);

  const handleCancel = () => {
    setEditingProduct(null);
    setForm({ name: "", description: "", category: "", price: 0, imageFile: null });
    setIsFormVisible(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error(err);
        setMessage("Failed to delete product.");
      }
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-dashboard">
          <header className="dashboard-header">
            <h2>
              <i className="fas fa-cog"></i> Product Management Dashboard
            </h2>
            <button 
              className="btn btn-primary add-product-btn"
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              <i className="fas fa-plus"></i>
              {isFormVisible ? 'Close Form' : 'Add Product'}
            </button>
          </header>

          {message && (
            <div
              className={`message ${
                message.includes("failed") ? "error" : "success"
              }`}
            >
              <i
                className={`icon ${
                  message.includes("failed")
                    ? "fas fa-exclamation-circle"
                    : "fas fa-check-circle"
                }`}
              ></i>
              {message}
            </div>
          )}

          {isFormVisible && (
            <div className="form-container slide-in">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      name="name"
                      placeholder="Enter product name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Product Image</label>
                    <div className="file-input-container">
                      <input
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="file-input"
                        id="file-input"
                      />
                      <label htmlFor="file-input" className="file-input-label">
                        <i className="fas fa-upload"></i>
                        {form.imageFile ? form.imageFile.name : "Choose file"}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter product description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? (
                      <>
                        <i className="fas fa-save"></i> Update Product
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus"></i> Add Product
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="products-section">
            <div className="section-header">
              <h3>Products ({filteredProducts.length})</h3>
              <div className="filters">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-filter"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-box-open"></i>
                <p>
                  No products found.{" "}
                  {searchTerm || selectedCategory !== "All"
                    ? "Try adjusting your filters."
                    : "Add your first product!"}
                </p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="product-card">
                    <div className="card-header">
                      {p.imageUrl ? (
                        <div className="product-image">
                          <img src={p.imageUrl} alt={p.name} />
                        </div>
                      ) : (
                        <div className="product-image placeholder">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                      <h4>{p.name}</h4>
                      <span className="category-badge">{p.category}</span>
                    </div>
                    <div className="card-body">
                      <p className="description">{p.description}</p>
                      <div className="price">${p.price.toFixed(2)}</div>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleView(p)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i> View
                      </button>

                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          setEditingProduct(p);
                          setForm({
                            name: p.name,
                            description: p.description,
                            category: p.category,
                            price: p.price,
                            imageFile: null,
                          });
                          setIsFormVisible(true);
                        }}
                        title="Edit Product"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.id)}
                        title="Delete Product"
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Detail Modal */}
          {viewingProduct && (
            <div className="modal-overlay" onClick={handleCloseView}>
              <div className="modal modal-slide-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{viewingProduct.name}</h3>
                  <button className="close-modal" onClick={handleCloseView}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  {viewingProduct.imageUrl && (
                    <div className="modal-image">
                      <img
                        src={viewingProduct.imageUrl}
                        alt={viewingProduct.name}
                      />
                    </div>
                  )}
                  <div className="modal-details">
                    <p>
                      <strong>Category:</strong> {viewingProduct.category}
                    </p>
                    <p>
                      <strong>Price:</strong> ${viewingProduct.price.toFixed(2)}
                    </p>
                    <p>
                      <strong>Description:</strong> {viewingProduct.description}
                    </p>
                  </div>
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

export default AdminDashboard;

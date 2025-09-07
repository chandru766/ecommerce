import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://localhost:8080/api/products";


const ModernNavbar = ({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="modern-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <Link to="/">
            <i className="fas fa-store"></i>
            <span>StyleShop</span>
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <div className={`hamburger-line ${isMobileMenuOpen ? "line-1" : ""}`}></div>
          <div className={`hamburger-line ${isMobileMenuOpen ? "line-2" : ""}`}></div>
          <div className={`hamburger-line ${isMobileMenuOpen ? "line-3" : ""}`}></div>
        </div>

        {/* Main Menu */}
        <nav className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <Link to="/dashboard" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/order" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-shopping-bag"></i> Orders
          </Link>
          <Link to="/profile" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-user"></i> Profile
          </Link>
          <div className="nav-item search-wrapper">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-select">
              <i className="fas fa-filter"></i>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
        </nav>

        {/* Right Icons */}
          <div className="navbar-icons">
            <button className="icon-btn cart-btn" aria-label="Shopping Cart">
              <i className="fas fa-shopping-cart"></i>
              <span className="btn-text">Cart</span>
              <span className="cart-badge">3</span>
            </button>

            <button
              className="icon-btn logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="btn-text">Logout</span>
            </button>
          </div>

      </div>
    </header>
  );
};

/* ------------------- Customer Reviews Section ------------------- */
const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing products and fast shipping! Will definitely shop again.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      comment: "Great quality products at reasonable prices. Customer service was excellent.",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      rating: 5,
      comment: "Love the variety of products available. The website is easy to navigate too!",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: 4,
      name: "James Wilson",
      rating: 5,
      comment: "Fast delivery and products exactly as described. Highly recommend!",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    }
  ];

  return (
    <section className="customer-reviews">
      <div className="container">
        <h2>What Our Customers Say</h2>
        <p className="section-subtitle">Don't just take our word for it - hear from our satisfied customers</p>
        
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <img src={review.avatar} alt={review.name} className="review-avatar" />
                <div className="reviewer-info">
                  <h4>{review.name}</h4>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas fa-star ${i < review.rating ? 'active' : ''}`}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-comment">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------- User Dashboard ------------------- */
const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewingProduct, setViewingProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userReview, setUserReview] = useState("");

  const productsRef = useRef(null);
  const brandsRef = useRef(null);
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

  // Brand logos for scrolling section
  const brandLogos = [
    "fas fa-apple",
    "fas fa-tshirt",
    "fas fa-book",
    "fas fa-laptop",
    "fas fa-mobile-alt",
    "fas fa-headphones",
    "fas fa-camera",
    "fas fa-gamepad",
    "fas fa-gem",
    "fas fa-shoe-prints",
    "fas fa-watch",
    "fas fa-home"
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleView = (product) => {
    setViewingProduct(product);
    setUserRating(0);
    setUserReview("");
  };
  
  const handleCloseView = () => setViewingProduct(null);

  const handleSubmitReview = () => {
    if (!userRating || !userReview) {
      alert("Please provide both a rating and review.");
      return;
    }
    const newReview = {
      id: Date.now(),
      rating: userRating,
      review: userReview,
      user: "You",
    };
    setViewingProduct((prev) => ({
      ...prev,
      reviews: prev.reviews ? [...prev.reviews, newReview] : [newReview],
    }));
    setUserRating(0);
    setUserReview("");
  };

  const scrollToProducts = () => {
    productsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="user-layout">
      {/* Navbar */}
      <ModernNavbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Welcome to StyleShop</h1>
          <p className="hero-subtitle">
            Discover the latest trends and exclusive deals
          </p>
          <button className="btn btn-primary hero-btn" onClick={scrollToProducts}>
            Shop Now <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* Brand Scrolling Section */}
      <section className="brands-section" ref={brandsRef}>
        <div className="container">
          <h2>Featured Brands</h2>
          <div className="brand-scroll-container">
            <div className="brand-scroll">
              {brandLogos.concat(brandLogos).map((logo, index) => (
                <div key={index} className="brand-item">
                  <i className={logo}></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <div className="user-content" ref={productsRef}>
        <header className="dashboard-header">
          <h2>
            <i className="fas fa-shopping-bag"></i> Featured Products
          </h2>
          <p>Discover our curated collection of premium products</p>
        </header>

        {message && <div className="message error">{message}</div>}

        <div className="products-section">
          {isLoading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="card-header">
                    {p.imageUrl ? (
                      <div className="product-image">
                        <img src={p.imageUrl} alt={p.name} />
                        <div className="product-overlay">
                          <button 
                            className="btn btn-quick-view"
                            onClick={() => handleView(p)}
                          >
                            <i className="fas fa-eye"></i> Quick View
                          </button>
                        </div>
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
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                    <button className="btn btn-success btn-sm">
                      <i className="fas fa-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* Product Modal */}
        {viewingProduct && (
          <div className="modal-overlay" onClick={handleCloseView}>
            <div
              className="modal modal-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
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

                {/* Reviews */}
                <div className="reviews-section">
                  <h4>Customer Reviews</h4>
                  {viewingProduct.reviews?.length > 0 ? (
                    <ul className="reviews-list">
                      {viewingProduct.reviews.map((r) => (
                        <li key={r.id} className="review-item">
                          <div className="review-header">
                            <span className="review-user">
                              <i className="fas fa-user"></i>{" "}
                              {r.user || "Anonymous"}
                            </span>
                            <span className="review-stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`fas fa-star ${
                                    r.rating >= star ? "active" : ""
                                  }`}
                                ></i>
                              ))}
                            </span>
                          </div>
                          <p className="review-text">{r.review}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-reviews">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>

                {/* Add Review */}
                <div className="add-review">
                  <h4>Leave a Review</h4>
                  <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fas fa-star star-input ${
                          (hoverRating || userRating) >= star ? "active" : ""
                        }`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(star)}
                      ></i>
                    ))}
                  </div>
                  <textarea
                    placeholder="Write your review..."
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    rows="3"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmitReview}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseView}>
                  Close
                </button>
                <button className="btn btn-success">
                  <i className="fas fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="dashboard-footer">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-section">
            <h4>About StyleShop</h4>
            <p>
              StyleShop is your go-to online store for the latest trends in fashion,
              electronics, and more. Shop with confidence and enjoy exclusive deals!
            </p>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/dashboard">Home</Link></li>
              <li><Link to="/order">Orders</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StyleShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
import { useState } from "react";
import { ShoppingCart, Heart, User, Search } from "lucide-react";
import { motion } from "framer-motion";

function UserDashboard() {
  const [cartCount] = useState(2);
  const [wishlistCount] = useState(3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔹 Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600 cursor-pointer">
            ShopHub
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-6">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="flex-1 bg-transparent outline-none px-2"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer">
              <Heart className="w-6 h-6 text-gray-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                  {wishlistCount}
                </span>
              )}
            </div>

            <div className="relative cursor-pointer">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 cursor-pointer">
              <User className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium">Login / Signup</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="bg-blue-600">
          <ul className="container mx-auto flex gap-6 px-6 py-2 text-white font-medium">
            <li className="cursor-pointer hover:text-yellow-300">Mobiles</li>
            <li className="cursor-pointer hover:text-yellow-300">Fashion</li>
            <li className="cursor-pointer hover:text-yellow-300">Electronics</li>
            <li className="cursor-pointer hover:text-yellow-300">Appliances</li>
            <li className="cursor-pointer hover:text-yellow-300">Beauty</li>
            <li className="cursor-pointer hover:text-yellow-300">Home</li>
          </ul>
        </nav>
      </header>

      {/* 🔹 Hero Carousel */}
      <section className="relative w-full h-72 overflow-hidden bg-gray-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="h-full w-full bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="bg-black bg-opacity-40 p-6 rounded-xl text-white text-center">
            <h2 className="text-3xl font-bold">Big Sale is Live!</h2>
            <p className="mt-2">Up to 70% off on top products</p>
            <button className="mt-4 px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300">
              Shop Now
            </button>
          </div>
        </motion.div>
      </section>

      {/* 🔹 Product Sections */}
      <main className="container mx-auto px-6 py-10 space-y-12">
        {/* Top Deals */}
        <section>
          <h3 className="text-xl font-bold mb-4">🔥 Top Deals of the Day</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={`https://picsum.photos/300/200?random=${i}`}
                  alt="deal"
                  className="w-full h-40 object-cover rounded-md"
                />
                <h4 className="mt-2 font-medium">Product {i}</h4>
                <p className="text-blue-600 font-bold">$199</p>
              </div>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section>
          <h3 className="text-xl font-bold mb-4">⭐ Best Sellers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={`https://picsum.photos/300/200?random=${i}`}
                  alt="bestseller"
                  className="w-full h-40 object-cover rounded-md"
                />
                <h4 className="mt-2 font-medium">Product {i}</h4>
                <p className="text-blue-600 font-bold">$299</p>
              </div>
            ))}
          </div>
        </section>

        {/* Personalized */}
        <section>
          <h3 className="text-xl font-bold mb-4">💡 Recommended for You</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={`https://picsum.photos/300/200?random=${i}`}
                  alt="recommended"
                  className="w-full h-40 object-cover rounded-md"
                />
                <h4 className="mt-2 font-medium">Product {i}</h4>
                <p className="text-blue-600 font-bold">$149</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 🔹 Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-3">About</h4>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Careers</li>
              <li>Sell on ShopHub</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Returns Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Follow Us</h4>
            <ul className="space-y-2">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Newsletter</h4>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-lg text-black mb-2"
            />
            <button className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-500">
              Subscribe
            </button>
          </div>
        </div>

        <div className="text-center py-4 border-t border-gray-700 text-sm">
          © 2025 ShopHub. All rights reserved. | Terms | Privacy Policy
        </div>
      </footer>
    </div>
  );
}

export default UserDashboard;

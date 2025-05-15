import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/Home.css";
const categories = [
  { 
    id: 1, 
    name: 'Electronics', 
    icon: '📱',
    color: '#3498db',
    gradient: 'linear-gradient(135deg, #3498db, #2980b9)',
    description: 'Phones, Laptops, Gadgets',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 2, 
    name: 'Furniture', 
    icon: '🛋️',
    color: '#e67e22',
    gradient: 'linear-gradient(135deg, #e67e22, #d35400)',
    description: 'Home & Office Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 3, 
    name: 'Vehicles', 
    icon: '🚗',
    color: '#27ae60',
    gradient: 'linear-gradient(135deg, #27ae60, #219653)',
    description: 'Cars, Bikes, Scooters',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 4, 
    name: 'Fashion', 
    icon: '👗',
    color: '#9b59b6',
    gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    description: 'Clothing, Shoes, Accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 5, 
    name: 'Books', 
    icon: '📚',
    color: '#f1c40f',
    gradient: 'linear-gradient(135deg, #f1c40f, #f39c12)',
    description: 'Books, Magazines, Comics',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 6, 
    name: 'Sports', 
    icon: '⚽',
    color: '#e74c3c',
    gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    description: 'Equipment, Apparel, Accessories',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  }
];

const quickFilters = [
  { id: 1, label: 'Under Rs 100' },
  { id: 2, label: 'Top Rated Sellers' },
  { id: 3, label: 'Free Items' },
];

const Home = ({ user }) => {
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
      .then(res => {
        console.log('Home page items received:', res.data);
        res.data.forEach(item => {
          console.log('Item image path:', item.image);
          console.log('Full image URL:', item.image ? `http://localhost:5000${item.image}` : 'No image');
        });
        
        setItems(res.data);
        
        const featured = res.data.slice(0, 4);
        const recent = res.data.slice(4, 8);
        
        console.log('Featured items:', featured);
        console.log('Recent items:', recent);
        
        setFeaturedItems(featured);
        setRecentItems(recent);
      })
      .catch(err => console.error('Error fetching items for home page:', err));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Buy & Sell Anything Nearby!</h1>
          <p>Discover great deals and connect with local sellers.</p>
          <Link to="/products/new" className="cta-button">Start Selling</Link>
          <Link to="/products" className="cta-button secondary">Browse Deals</Link>
        </div>
        
      </section>
      <section className="categories">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find what you need in our popular categories</p>
        </div>
        
        <div className="category-cards">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/products?category=${cat.name}`} 
              className="category-card"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${cat.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="category-content">
                <div 
                  className="category-icon-wrapper"
                  style={{ background: cat.gradient }}
                >
                  <div className="category-icon">{cat.icon}</div>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-description">{cat.description}</p>
                </div>
                <div className="category-arrow">
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-listings">
        <div className="section-header">
          <h2>Featured Listings</h2>
          <p>Discover our best products selected for you</p>
        </div>
        <div className="item-grid">
          {featuredItems.map(item => (
            <div key={item._id} className="item-card">
              {item.image ? (
                <img 
                  src={item.image.startsWith('http') 
                    ? item.image 
                    : `http://localhost:5000${item.image}`} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = `<div class="image-placeholder">Image not available</div>`;
                  }}
                />
              ) : (
                <div className="image-placeholder">No image available</div>
              )}
              <h3>{item.title}</h3>
              <p>Price: Rs {item.price.toFixed(2)}</p>
              <Link to={`/products/${item._id}`}>View Details</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="recent-listings">
        <div className="section-header">
          <h2>Recently Added</h2>
          <p>Check out the latest products on our marketplace</p>
        </div>
        <div className="item-grid">
          {recentItems.map(item => (
            <div key={item._id} className="item-card">
              {item.image ? (
                <img 
                  src={item.image.startsWith('http') 
                    ? item.image 
                    : `http://localhost:5000${item.image}`} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = `<div class="image-placeholder">Image not available</div>`;
                  }}
                />
              ) : (
                <div className="image-placeholder">No image available</div>
              )}
              <h3>{item.title}</h3>
              <p>Price: Rs {item.price.toFixed(2)}</p>
              <Link to={`/products/${item._id}`}>View Details</Link>
            </div>
          ))}
        </div>
      </section>
      <section className="search-filters">
        <h2>Quick Filters</h2>
        <div className="filter-buttons">
          {quickFilters.map(filter => (
            <button key={filter.id} className="filter-button">{filter.label}</button>
          ))}
        </div>
      </section>
      <section className="trust-safety">
        <h2>Trust & Safety</h2>
        <div className="trust-content">
          <div className="badge">✔️ Verified Sellers</div>
          <div className="badge">🔒 Buyer Protection</div>
          <div className="badge">📢 Fraud Prevention Tips</div>
          <p>Learn how to buy and sell safely with our comprehensive guide.</p>
        </div>
      </section>


      <footer className="footer">
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>

    </div>
  );
};

export default Home;

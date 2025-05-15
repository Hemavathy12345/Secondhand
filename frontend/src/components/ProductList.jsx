import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../styles/ProductList.css";

const ProductList = ({ user }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('newest');

  const categories = ['Electronics', 'Clothing', 'Furniture', 'Books', 'Vehicles', 'Other'];
  const conditions = ['New', 'Like New', 'Used', 'Refurbished'];

  useEffect(() => {
    const params = new URLSearchParams({
      search,
      priceMin,
      priceMax,
      category,
      condition,
      location,
      sort
    });
    axios.get(`http://localhost:5000/api/items?${params}`)
      .then(res => {
        console.log('Items received:', res.data);
        res.data.forEach(item => {
          console.log('Item image path:', item.image);
          console.log('Full image URL:', item.image ? `http://localhost:5000${item.image}` : 'No image');
        });
        setItems(res.data);
      })
      .catch(err => console.error('Error fetching items:', err));
  }, [search, priceMin, priceMax, category, condition, location, sort]);

  const handleFavorite = async (itemId) => {
    if (!user) return alert('Please log in to add to favorites');
    try {
      await axios.post('http://localhost:5000/api/favorites', { itemId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Added to favorites');
    } catch (err) {
      alert('Error adding to favorites');
    }
  };

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">All Conditions</option>
          {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
        </select>
        <input
          type="text"
          placeholder="Location (e.g., City)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>
      <div className="items">
        {items.map(item => (
          <div key={item._id} className="item">
            <div className="category-badge">{item.category}</div>
            <Link to={`/products/${item._id}`}>
              <img 
                src={item.image && item.image.startsWith('http') 
                  ? item.image 
                  : `http://localhost:5000${item.image}`} 
                alt={item.title} 
              />
              <div className="item-content">
                <h3>{item.title}</h3>
                <p className="price">Rs.{item.price.toFixed(2)}</p>
                <p className="details">
                  <span className={`condition ${item.condition.toLowerCase().replace(' ', '-')}`}>
                    {item.condition}
                  </span>
                </p>
              </div>
            </Link>
            {user && <button onClick={() => handleFavorite(item._id)}>Add to Favorites</button>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductList;
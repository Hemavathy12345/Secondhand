import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/Favorites.css";

const Favorites = ({ user }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;
    axios.get('http://localhost:5000/api/favorites', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setFavorites(res.data)).catch(err => console.error('Error fetching favorites:', err));
  }, [user]);

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFavorites(favorites.filter(fav => fav.itemId._id !== itemId));
    } catch (err) {
      alert('Error removing favorite');
    }
  };

  if (!user) return <div>Please log in to view your favorites</div>;

  return (
    <div className="favorites">
      <h2>Your Favorites</h2>
      <div className="items">
        {favorites.map(fav => (
          <div key={fav._id} className="item">
            <Link to={`/products/${fav.itemId._id}`}>
              <img 
                src={fav.itemId.image && fav.itemId.image.startsWith('http') 
                  ? fav.itemId.image 
                  : `http://localhost:5000${fav.itemId.image}`} 
                alt={fav.itemId.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/path/to/placeholder/image.jpg'; 
                }}
              />
              <h3>{fav.itemId.title}</h3>
              <p>RS {fav.itemId.price.toFixed(2)}</p>
            </Link>
            <button onClick={() => handleRemove(fav.itemId._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;

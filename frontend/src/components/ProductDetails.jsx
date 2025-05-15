import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/ProductDetails.css";

const ProductDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/items/${id}`).then(res => setItem(res.data));
    axios.get(`http://localhost:5000/api/reviews/${id}`).then(res => setReviews(res.data));
  }, [id]);



  const handleMarkSold = async () => {
    if (!user || user._id !== item.sellerId._id) return alert('Only the seller can mark as sold');
    try {
      await axios.patch(`http://localhost:5000/api/items/${id}`, { status: 'sold' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItem({ ...item, status: 'sold' });
    } catch (err) {
      alert('Error marking as sold');
    }
  };

  if (!item) return <div>Loading...</div>;

  // Construct full image URL
  const imageUrl = item.image && (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`);

  return (
    <div className="product-details">
      <h2>{item.title}</h2>
      {imageUrl ? (
        <img src={imageUrl} alt={item.title} className="product-image" />
      ) : (
        <div className="no-image">No image available</div>
      )}
      
      <div className="product-info">
        <div className="price-category">
          <span className="price">${item.price.toFixed(2)}</span>
          <span className={`condition ${item.condition.toLowerCase().replace(' ', '-')}`}>
            {item.condition}
          </span>
          <span className="category">{item.category}</span>
        </div>
        
        <div className="description">
          <h3>Description</h3>
          <p>{item.description}</p>
        </div>
        
        <div className="seller-info">
          <h3>Seller Information</h3>
          <p><strong>Seller:</strong> {item.sellerId.name}</p>
          {item.status === 'sold' && <p className="sold-status">This item has been sold</p>}
        </div>
      </div>
      
      <div className="actions">
        {item.status === 'sold' ? (
          <p className="sold-badge">SOLD</p>
        ) : (
          user && user._id === item.sellerId._id ? (
            <button className="sold" onClick={handleMarkSold}>Mark as Sold</button>
          ) : (
            <button className="message" onClick={() => navigate('/messages', { state: { receiverId: item.sellerId._id } })}>
              Message Seller
            </button>
          )
        )}
      </div>
      
    </div>
  );
};
export default ProductDetails;

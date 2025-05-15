

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "../styles/ProductForm.css";

const ProductForm = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tags, setTags] = useState('');
  const categories = ['Electronics', 'Clothing', 'Furniture', 'Books', 'Vehicles', 'Other'];
  const conditions = ['New', 'Like New', 'Used', 'Refurbished'];

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/items/${id}`)
        .then(res => {
          const { title, description, price, category, condition, image, tags } = res.data;
          setTitle(title);
          setDescription(description);
          setPrice(price);
          setCategory(category);
          setCondition(condition);
          setImagePreview(image);
          setTags(tags.join(', '));
        })
        .catch(err => console.error('Error fetching item:', err));
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to post an item');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', parseFloat(price));
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('tags', tags.split(',').map(tag => tag.trim()).join(','));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      if (id) {
        await axios.patch(`http://localhost:5000/api/items/${id}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/items', formData, config);
      }
      navigate('/products');
    } catch (err) {
      alert('Error saving item');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!user || !id) return;
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/products');
    } catch (err) {
      alert('Error deleting item');
      console.error(err);
    }
  };

  return (
    <div className="product-form">
      <h2>{id ? 'Edit Item' : 'Post New Item'}</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">Select Condition</option>
          {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px', borderRadius: '8px' }} />
        )}
      
        <button onClick={handleSubmit}>{id ? 'Update' : 'Post'} Item</button>
        {id && <button onClick={handleDelete} className="delete">Delete Item</button>}
      </div>
    </div>
  );
};
export default ProductForm;

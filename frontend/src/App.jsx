
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Profile from './components/Profile.jsx';
import ProductList from './components/ProductList.jsx';
import ProductDetails from './components/productDetails.jsx';
import ProductForm from './components/ProductForm.jsx';
import Messaging from './components/Messaging.jsx';
import Favorites from './components/Favorites.jsx';
import './App.css';
import './styles/Fullscreen.css';


const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="container">
        <Navbar user={user} setUser={setUser} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/products" element={<ProductList user={user} />} />
            <Route path="/products/:id" element={<ProductDetails user={user} />} />
            <Route path="/products/new" element={<ProductForm user={user} />} />
            <Route path="/products/edit/:id" element={<ProductForm user={user} />} />
            <Route path="/messages" element={<Messaging user={user} />} />
            <Route path="/favorites" element={<Favorites user={user} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
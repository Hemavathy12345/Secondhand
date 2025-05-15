import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";

const Navbar = ({ user, setUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/products?search=' + encodeURIComponent(searchTerm.trim()));
      setSearchTerm('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate('/')}>ReUse Market
</div>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search items or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="navbar-center">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>Products</NavLink>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
            <NavLink to="/messages" className={({ isActive }) => (isActive ? 'active' : '')}>Messages</NavLink>
            <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>Favorites</NavLink>
            <NavLink to="/products/new" className="sell-button">Sell</NavLink>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>Signup</NavLink>
            <NavLink to="/products/new" className="sell-button">Sell</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

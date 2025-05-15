import React, { useState, useEffect } from 'react';
import "../styles/Profile.css";

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [photo, setPhoto] = useState(user?.photo || '');
  const [location, setLocation] = useState(user?.location.lat ? `${user.location.lat},${user.location.lng}` : '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPhoto(user.photo);
      setLocation(user.location.lat ? `${user.location.lat},${user.location.lng}` : '');
    }
  }, [user]);

  if (!user) return <div>Please log in to view your profile</div>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
     
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email || 'Not set'}</p>
      <p><strong>Rating:</strong> {user.rating !== undefined && user.rating !== null ? user.rating.toFixed(1) : 'N/A'}/5</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
export default Profile;
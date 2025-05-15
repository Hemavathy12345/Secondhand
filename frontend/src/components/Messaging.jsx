import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "../styles/Messaging.css";

const Messaging = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const receiverId = location.state?.receiverId;

  useEffect(() => {
    if (!user) return;
    axios.get('http://localhost:5000/api/messages', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setConversations(res.data));
    const interval = setInterval(() => {
      if (selectedUser) {
        axios.get(`http://localhost:5000/api/messages/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setMessages(res.data));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user, selectedUser]);

  useEffect(() => {
    if (receiverId) {
      axios.get(`http://localhost:5000/api/users/${receiverId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => {
        setSelectedUser(res.data);
        axios.get(`http://localhost:5000/api/messages/${res.data._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setMessages(res.data));
      });
    }
  }, [receiverId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const filtered = res.data.filter(u =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  const handleSend = async () => {
    if (!user || !selectedUser || !newMessage) return;
    try {
      const res = await axios.post('http://localhost:5000/api/messages', {
        receiverId: selectedUser._id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      const convRes = await axios.get('http://localhost:5000/api/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConversations(convRes.data);
    } catch (err) {
      alert('Error sending message');
    }
  };

  if (!user) return <div>Please log in to view messages</div>;

  return (
    <div className="messaging">
      <h2>Messages</h2>
      <div>
        <input
          type="text"
          placeholder="Search users to start a conversation"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        {searchResults.length > 0 && (
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: '10px' }}>
            {searchResults.map(user => (
              <div
                key={user._id}
                style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                onClick={() => {
                  setSelectedUser(user);
                  setSearchTerm('');
                  setSearchResults([]);
                }}
              >
                {user.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="messaging-container">
        <div className="conversation-list">
          {conversations.map(conv => (
            <div
              key={conv.user._id}
              className={`conversation ${selectedUser?._id === conv.user._id ? 'selected' : ''}`}
              onClick={() => setSelectedUser(conv.user)}
            >
              <p>{conv.user.name}</p>
              {conv.unread > 0 && <span className="notification">{conv.unread}</span>}
            </div>
          ))}
        </div>
        <div className="chat">
          {selectedUser ? (
            <>
              <h3>Chat with {selectedUser.name}</h3>
              <div className="messages">
                {messages.map(msg => (
                  <div
                    key={msg._id}
                    className={`message ${msg.senderId._id === user._id ? 'sent' : 'received'}`}
                  >
                    <p>{msg.content}</p>
                    <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
              </div>
            </>
          ) : (
            <p>Select a conversation</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;

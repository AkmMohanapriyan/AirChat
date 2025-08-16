// src/pages/ChatPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import { toast } from 'react-toastify';
import './ChatPage.css';

const ChatPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Sample users data
  useEffect(() => {
    const sampleUsers = [
      { id: 1, name: "Joei", lastSeen: "9/30/21", lastMessage: "Hi how are youu ??", unread: 2, profilePic: null },
      { id: 2, name: "Virtual user", lastSeen: "9/30/21", lastMessage: "You added Karl", unread: 0, profilePic: null },
      { id: 3, name: "Ross", lastSeen: "9/12/21", lastMessage: "You were added", unread: 0, profilePic: null },
      { id: 4, name: "Rachel", lastSeen: "9/12/21", lastMessage: "You created group?", unread: 1, profilePic: null },
      { id: 5, name: "James", lastSeen: "9/12/21", lastMessage: "", unread: 0, profilePic: null },
      { id: 6, name: "Emma", lastSeen: "Today", lastMessage: "Can we meet tomorrow?", unread: 0, profilePic: null },
      { id: 7, name: "Michael", lastSeen: "Yesterday", lastMessage: "Sent a document", unread: 3, profilePic: null },
      { id: 8, name: "Sophia", lastSeen: "Online", lastMessage: "👍", unread: 0, profilePic: null },
    ];
    setUsers(sampleUsers);
    
    // Initialize messages
    const initialMessages = {};
    sampleUsers.forEach(user => {
      initialMessages[user.id] = [
        { id: 1, text: user.lastMessage || "Hello!", time: "9:30 AM", sender: user.id === 1 ? 'me' : 'them' },
        { id: 2, text: "How are you doing?", time: "9:32 AM", sender: 'me' },
        { id: 3, text: "I'm good, thanks for asking!", time: "9:35 AM", sender: 'them' },
      ];
    });
    setMessages(initialMessages);
  }, []);

  const handleLogout = () => {
    // In a real app, you would clear tokens/session
    toast.success("Logged out successfully");
    navigate("/");
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;
    
    const newMessage = {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me'
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...prev[activeChat.id], newMessage]
    }));
    
    setMessage('');
    
    // Simulate reply after a delay
    setTimeout(() => {
      const replies = [
        "Got your message!",
        "I'll get back to you soon",
        "Thanks for the message!",
        "Can we talk later?",
        "👍"
      ];
      
      const replyMessage = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'them'
      };
      
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...prev[activeChat.id], replyMessage]
      }));
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="airchat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="app-logo">
            <span className="logo-text">AirChat</span>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <FaSearch />
            </button>
            <button className="icon-btn">
              <FaEllipsisV />
            </button>
          </div>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            CHATS
          </button>
          {/* <button 
            className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            STATUS
          </button> */}
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="chats-list">
          {filteredUsers.map(user => (
            <div 
              key={user.id} 
              className={`chat-item ${activeChat?.id === user.id ? 'active' : ''}`}
              onClick={() => setActiveChat(user)}
            >
              <div className="avatar">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <div className="user-name">{user.name}</div>
                  <div className="last-seen">{user.lastSeen}</div>
                </div>
                <div className="last-message">
                  {user.lastMessage}
                  {user.unread > 0 && <span className="unread-count">{user.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="main-chat-area">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-partner">
                <div className="avatar">
                  {activeChat.profilePic ? (
                    <img src={activeChat.profilePic} alt={activeChat.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {activeChat.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="partner-info">
                  <div className="partner-name">{activeChat.name}</div>
                  <div className="partner-status">
                    {activeChat.lastSeen === "Online" 
                      ? <span className="online-dot"></span> 
                      : null}
                    {activeChat.lastSeen}
                  </div>
                </div>
              </div>
              <div className="header-actions">
                <button className="icon-btn">
                  <FaSearch />
                </button>
                <button className="icon-btn">
                  <FaEllipsisV />
                </button>
              </div>
            </div>
            
            <div className="chat-messages">
              {messages[activeChat.id]?.map(msg => (
                <div 
                  key={msg.id} 
                  className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    {msg.text}
                  </div>
                  <div className="message-time">
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="message-input-area">
              <button className="icon-btn">
                <FaSmile />
              </button>
              <button className="icon-btn">
                <FaPaperclip />
              </button>
              <div className="message-input-container">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message"
                  rows={1}
                />
              </div>
              {message ? (
                <button className="send-btn" onClick={handleSendMessage}>
                  <IoIosSend />
                </button>
              ) : (
                <button className="icon-btn">
                  <FaMicrophone />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-container">
              <div className="logo-large">
                <span className="logo-text">AirChat</span>
              </div>
              <h2>Welcome to AirChat</h2>
              <p>Select a chat to start messaging</p>
              <p>Or start a new conversation</p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
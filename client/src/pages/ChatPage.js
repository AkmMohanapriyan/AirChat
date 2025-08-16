


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
  FaSignOutAlt, FaCheck, FaClock
} from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ChatPage.css';

const ChatPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);

  // Simulate online status
  useEffect(() => {
    // Mark some users as online for demonstration
    const onlineUserIds = new Set(['1', '3', '8']); // Sample online users
    setOnlineUsers(onlineUserIds);
    
    // Update current user's last active time every minute
    const interval = setInterval(() => {
      // In a real app, you would ping the server to update last active
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch all users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get('/api/users');
        // Filter out the current user
        const otherUsers = response.data.filter(u => u._id !== user.id);
        setUsers(otherUsers);
        
        // Initialize messages cache
        const initialMessages = {};
        otherUsers.forEach(user => {
          initialMessages[user._id] = [];
        });
        setMessages(initialMessages);
      } catch (error) {
        toast.error('Failed to load users');
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user.id]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      
      try {
        setLoadingMessages(true);
        const response = await axios.get(`/api/messages/${activeChat._id}`);
        setMessages(prev => ({
          ...prev,
          [activeChat._id]: response.data
        }));
      } catch (error) {
        toast.error('Failed to load messages');
        console.error('Error fetching messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to send email notification
  const sendEmailNotification = async (receiverId) => {
    try {
      await axios.post('/api/notifications/new-message', {
        receiverId,
        senderName: user.name
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  };

const handleSendMessage = async () => {
  if (!message.trim() || !activeChat) return;
  
  // Capture receiver ID before async operations
  const receiverId = activeChat._id;
  
  const newMessage = {
    text: message,
    sender: user.id,
    receiver: receiverId,
    createdAt: new Date()
  };
  
  // Declare tempId in outer scope
  let tempId;
  
  try {
    setIsSending(true);
    
    // Optimistic UI update
    tempId = Date.now();
    const optimisticMessage = {
      ...newMessage,
      _id: tempId,
      createdAt: new Date().toISOString(),
      status: 'pending', // Initial status
      isOptimistic: true
    };
    
    setMessages(prev => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), optimisticMessage]
    }));
    
    setMessage('');
    
    // Send message to backend
    const response = await axios.post('/api/messages', newMessage);
    
    // Replace optimistic message with real one with 'sent' status
    const sentMessage = {
      ...response.data,
      status: 'sent' // Message sent but not read yet
    };
    
    setMessages(prev => ({
      ...prev,
      [receiverId]: prev[receiverId].map(msg => 
        msg._id === tempId ? sentMessage : msg
      )
    }));
    
    // Simulate message read after receiver opens it
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [receiverId]: prev[receiverId].map(msg => 
          msg._id === sentMessage._id ? {...msg, status: 'read'} : msg
        )
      }));
    }, 3000); // Simulate read after 3 seconds
    
    // Send email notification to the receiver
    sendEmailNotification(receiverId);
    
  } catch (error) {
    // Mark message as failed
    setMessages(prev => ({
      ...prev,
      [receiverId]: prev[receiverId].map(msg => 
        msg._id === tempId ? {...msg, status: 'failed'} : msg
      )
    }));
  } finally {
    setIsSending(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format date for last seen
  const formatLastSeen = (dateString) => {
    if (!dateString) return "Long time ago";
    
    const now = new Date();
    const date = new Date(dateString);
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for messages
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get last message for a user
  const getLastMessage = (userId) => {
    const userMessages = messages[userId] || [];
    if (userMessages.length === 0) return null;
    
    const lastMessage = userMessages[userMessages.length - 1];
    return {
      text: lastMessage.text,
      time: formatMessageTime(lastMessage.createdAt),
      status: lastMessage.status,
      isFromMe: lastMessage.sender === user.id
    };
  };

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
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
            <button 
              className="icon-btn logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt />
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
          {loadingUsers ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-4">
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map(user => {
              const lastMessage = getLastMessage(user._id);
              const isOnline = isUserOnline(user._id);
              
              return (
                <div 
                  key={user._id} 
                  className={`chat-item ${activeChat?._id === user._id ? 'active' : ''}`}
                  onClick={() => setActiveChat(user)}
                >
                  <div className="avatar">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.firstName.charAt(0)}
                      </div>
                    )}
                    {isOnline && <span className="online-badge"></span>}
                  </div>
                  <div className="chat-info">
                    <div className="chat-header">
                      <div className="user-name">{user.firstName} {user.lastName}</div>
                      <div className="last-seen">
                        {isOnline ? (
                          <span className="online-text">Online</span>
                        ) : (
                          <span>Last seen {formatLastSeen(user.lastActive)}</span>
                        )}
                      </div>
                    </div>
                    <div className="last-message-container">
                      {lastMessage ? (
                        <>
                          <div className="last-message-text">
{lastMessage.isFromMe && (
  <span className="message-status">
    {lastMessage.status === 'pending' && <FaClock className="text-muted" />}
    {lastMessage.status === 'sent' && <FaCheck className="text-muted" />}
    {lastMessage.status === 'read' && (
      <span className="double-check blue">
        <FaCheck />
        <FaCheck />
      </span>
    )}
    {lastMessage.status === 'failed' && (
      <span className="text-danger">!</span>
    )}
  </span>
)}
                            {lastMessage.text}
                          </div>
                          <div className="last-message-time">{lastMessage.time}</div>
                        </>
                      ) : (
                        <div className="no-messages-text">No messages yet</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="main-chat-area">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-partner">
                <div className="avatar">
                  {activeChat.profilePhoto ? (
                    <img src={activeChat.profilePhoto} alt={`${activeChat.firstName} ${activeChat.lastName}`} />
                  ) : (
                    <div className="avatar-placeholder">
                      {activeChat.firstName.charAt(0)}
                    </div>
                  )}
                  {isUserOnline(activeChat._id) && <span className="online-badge"></span>}
                </div>
                <div className="partner-info">
                  <div className="partner-name">
                    {activeChat.firstName} {activeChat.lastName}
                  </div>
                  <div className="partner-status">
                    {isUserOnline(activeChat._id) ? (
                      <span className="online-text">Online</span>
                    ) : (
                      <span>Last seen {formatLastSeen(activeChat.lastActive)}</span>
                    )}
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
              {loadingMessages ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading messages...</span>
                  </div>
                </div>
              ) : messages[activeChat._id]?.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages[activeChat._id]?.map(msg => (
                  <div 
                    key={msg._id || msg.id} 
                    className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      {msg.text}
                      {msg.isOptimistic && (
                        <span className="sending-indicator">Sending...</span>
                      )}
                    </div>
                    <div className="message-meta">
                      <div className="message-time">
                        {formatMessageTime(msg.createdAt)}
                      </div>
{msg.sender === user.id && (
  <div className="message-status">
    {msg.status === 'pending' && <FaClock className="text-muted" />}
    {msg.status === 'sent' && <FaCheck className="text-muted" />}
    {msg.status === 'read' && (
      <span className="double-check blue">
        <FaCheck />
        <FaCheck />
      </span>
    )}
    {msg.status === 'failed' && (
      <span className="text-danger">!</span>
    )}
  </div>
)}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
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
                <button 
                  className="send-btn" 
                  onClick={handleSendMessage}
                  disabled={isSending}
                >
                  {isSending ? (
                    <div className="sending-spinner"></div>
                  ) : (
                    <IoIosSend />
                  )}
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
              <h2>Welcome, {user.name}</h2>
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


// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
//     FaSignOutAlt, FaCheck, FaClock, FaTimes, FaArrowUp, FaArrowDown,
//     FaPalette, FaImage, FaBan, FaTrash, 
// } from 'react-icons/fa';
// import { IoIosSend } from 'react-icons/io';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import './ChatPage.css';

// const ChatPage = ({ user, onLogout }) => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('chats');
//     const [users, setUsers] = useState([]);
//     const [activeChat, setActiveChat] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState({});
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loadingUsers, setLoadingUsers] = useState(true);
//     const [loadingMessages, setLoadingMessages] = useState(false);
//     const [isSending, setIsSending] = useState(false);
//     const [onlineUsers, setOnlineUsers] = useState(new Set());
//     const messagesEndRef = useRef(null);

//     // New states for features
//     const [isSearchActive, setIsSearchActive] = useState(false);
//     const [chatSearchQuery, setChatSearchQuery] = useState('');
//     const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
//     const [showMoreOptions, setShowMoreOptions] = useState(false);
//     const [showThemeModal, setShowThemeModal] = useState(false);
//     const [themeTab, setThemeTab] = useState('color');
//     const [selectedColor, setSelectedColor] = useState('#d9fdd3');
//     const [selectedWallpaper, setSelectedWallpaper] = useState(null);
//     const [showContactModal, setShowContactModal] = useState(false);
//     const [clearedChats, setClearedChats] = useState(() => {
//         try {
//             const saved = localStorage.getItem('clearedChats');
//             return saved ? JSON.parse(saved) : {};
//         } catch (error) {
//             console.error('Error parsing cleared chats:', error);
//             return {};
//         }
//     });
//     const [blockedUsers, setBlockedUsers] = useState(() => {
//         try {
//             const saved = localStorage.getItem('blockedUsers');
//             return saved ? new Set(JSON.parse(saved)) : new Set();
//         } catch (error) {
//             console.error('Error parsing blocked users:', error);
//             return new Set();
//         }
//     });
//     const messageRefs = useRef({});

//     // New state for blocked users view
//     const [showBlockedUsers, setShowBlockedUsers] = useState(false);

//     // Simulate online status
//     useEffect(() => {
//         const onlineUserIds = new Set(['1', '3', '8']);
//         setOnlineUsers(onlineUserIds);

//         const interval = setInterval(() => { }, 60000);

//         return () => clearInterval(interval);
//     }, []);

//     // Fetch all users from the database
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 setLoadingUsers(true);
//                 const response = await axios.get('/api/users');
//                 const otherUsers = response.data.filter(u => u._id !== user.id);
//                 setUsers(otherUsers);

//                 const initialMessages = {};
//                 otherUsers.forEach(user => {
//                     initialMessages[user._id] = [];
//                 });
//                 setMessages(initialMessages);
//             } catch (error) {
//                 toast.error('Failed to load users');
//                 console.error('Error fetching users:', error);
//             } finally {
//                 setLoadingUsers(false);
//             }
//         };

//         fetchUsers();
//     }, [user.id]);

//     // Fetch messages when a chat is selected
//     useEffect(() => {
//         const fetchMessages = async () => {
//             if (!activeChat) return;

//             try {
//                 setLoadingMessages(true);
//                 const response = await axios.get(`/api/messages/${activeChat._id}`);

//                 // Filter out cleared messages
//                 const clearedMessages = clearedChats[activeChat._id] || [];
//                 const filteredMessages = response.data.filter(msg =>
//                     !clearedMessages.includes(msg._id)
//                 );

//                 setMessages(prev => ({
//                     ...prev,
//                     [activeChat._id]: filteredMessages
//                 }));
//             } catch (error) {
//                 toast.error('Failed to load messages');
//                 console.error('Error fetching messages:', error);
//             } finally {
//                 setLoadingMessages(false);
//             }
//         };

//         fetchMessages();
//     }, [activeChat, clearedChats]);

//     // Scroll to bottom when messages change
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, activeChat]);

//     // Focus search input when activated
//     useEffect(() => {
//         if (isSearchActive) {
//             setTimeout(() => {
//                 document.getElementById('chat-search-input')?.focus();
//             }, 100);
//         }
//     }, [isSearchActive]);

//     // Save cleared chats to localStorage
//     useEffect(() => {
//         try {
//             localStorage.setItem('clearedChats', JSON.stringify(clearedChats));
//         } catch (error) {
//             console.error('Error saving cleared chats:', error);
//         }
//     }, [clearedChats]);

//     // Save blocked users to localStorage
//     useEffect(() => {
//         try {
//             localStorage.setItem('blockedUsers', JSON.stringify([...blockedUsers]));
//         } catch (error) {
//             console.error('Error saving blocked users:', error);
//         }
//     }, [blockedUsers]);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     const handleLogout = () => {
//         onLogout();
//         navigate("/");
//     };

//     const filteredUsers = users.filter(user =>
//         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Get blocked users
//     const getBlockedUsers = () => {
//         return users.filter(user => blockedUsers.has(user._id));
//     };

//     const sendEmailNotification = async (receiverId) => {
//         try {
//             await axios.post('/api/notifications/new-message', {
//                 receiverId,
//                 senderName: user.name
//             });
//         } catch (error) {
//             console.error('Failed to send notification email:', error);
//         }
//     };

//     const handleSendMessage = async () => {
//         if (!message.trim() || !activeChat || blockedUsers.has(activeChat._id)) return;

//         const receiverId = activeChat._id;

//         const newMessage = {
//             text: message,
//             sender: user.id,
//             receiver: receiverId,
//             createdAt: new Date()
//         };

//         let tempId;

//         try {
//             setIsSending(true);

//             tempId = Date.now();
//             const optimisticMessage = {
//                 ...newMessage,
//                 _id: tempId,
//                 createdAt: new Date().toISOString(),
//                 status: 'pending',
//                 isOptimistic: true
//             };

//             setMessages(prev => ({
//                 ...prev,
//                 [receiverId]: [...(prev[receiverId] || []), optimisticMessage]
//             }));

//             setMessage('');

//             const response = await axios.post('/api/messages', newMessage);

//             const sentMessage = {
//                 ...response.data,
//                 status: 'sent'
//             };

//             setMessages(prev => ({
//                 ...prev,
//                 [receiverId]: prev[receiverId].map(msg =>
//                     msg._id === tempId ? sentMessage : msg
//                 )
//             }));

//             setTimeout(() => {
//                 setMessages(prev => ({
//                     ...prev,
//                     [receiverId]: prev[receiverId].map(msg =>
//                         msg._id === sentMessage._id ? { ...msg, status: 'read' } : msg
//                     )
//                 }));
//             }, 3000);

//             sendEmailNotification(receiverId);

//         } catch (error) {
//             setMessages(prev => ({
//                 ...prev,
//                 [receiverId]: prev[receiverId].map(msg =>
//                     msg._id === tempId ? { ...msg, status: 'failed' } : msg
//                 )
//             }));
//         } finally {
//             setIsSending(false);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     // Format date for last seen
//     const formatLastSeen = (dateString) => {
//         if (!dateString) return "Long time ago";

//         const now = new Date();
//         const date = new Date(dateString);
//         const diffMinutes = Math.floor((now - date) / (1000 * 60));

//         if (diffMinutes < 1) return "Just now";
//         if (diffMinutes < 60) return `${diffMinutes} min ago`;

//         const diffHours = Math.floor(diffMinutes / 60);
//         if (diffHours < 24) return `${diffHours} hr ago`;

//         const diffDays = Math.floor(diffHours / 24);
//         if (diffDays === 1) return "Yesterday";
//         if (diffDays < 7) return `${diffDays} days ago`;

//         return date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     // Format time for messages
//     const formatMessageTime = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     // Get last message for a user
//     const getLastMessage = (userId) => {
//         const userMessages = messages[userId] || [];
//         if (userMessages.length === 0) return null;

//         const lastMessage = userMessages[userMessages.length - 1];
//         return {
//             text: lastMessage.text,
//             time: formatMessageTime(lastMessage.createdAt),
//             status: lastMessage.status,
//             isFromMe: lastMessage.sender === user.id
//         };
//     };

//     // Check if user is online
//     const isUserOnline = (userId) => {
//         return onlineUsers.has(userId);
//     };

//     // Highlight search matches in messages
//     const highlightMatches = (text) => {
//         if (!chatSearchQuery || !text) return text;

//         const regex = new RegExp(`(${chatSearchQuery})`, 'gi');
//         return text.split(regex).map((part, index) =>
//             regex.test(part) ? <mark key={index}>{part}</mark> : part
//         );
//     };

//     // Find all messages that match search query
//     const getSearchResults = () => {
//         if (!activeChat || !chatSearchQuery) return [];

//         const chatMessages = messages[activeChat._id] || [];
//         return chatMessages
//             .map((msg, index) => ({ msg, index }))
//             .filter(({ msg }) =>
//                 msg.text && msg.text.toLowerCase().includes(chatSearchQuery.toLowerCase())
//             );
//     };

//     // Navigate to next search result
//     const goToNextSearchResult = () => {
//         const results = getSearchResults();
//         if (results.length === 0) return;

//         const nextIndex = (currentSearchIndex + 1) % results.length;
//         setCurrentSearchIndex(nextIndex);
//         scrollToMessage(results[nextIndex].index);
//     };

//     // Navigate to previous search result
//     const goToPrevSearchResult = () => {
//         const results = getSearchResults();
//         if (results.length === 0) return;

//         const prevIndex = (currentSearchIndex - 1 + results.length) % results.length;
//         setCurrentSearchIndex(prevIndex);
//         scrollToMessage(results[prevIndex].index);
//     };

//     // Scroll to a specific message
//     const scrollToMessage = (index) => {
//         const messageId = messages[activeChat._id][index]._id;
//         messageRefs.current[messageId]?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//         });
//     };

//     // Handle chat search
//     const handleChatSearch = (e) => {
//         const query = e.target.value;
//         setChatSearchQuery(query);

//         if (query) {
//             const results = getSearchResults();
//             if (results.length > 0) {
//                 setCurrentSearchIndex(0);
//                 scrollToMessage(results[0].index);
//             }
//         } else {
//             setCurrentSearchIndex(-1);
//         }
//     };

//     // Clear chat search
//     const clearChatSearch = () => {
//         setChatSearchQuery('');
//         setIsSearchActive(false);
//         setCurrentSearchIndex(-1);
//     };

//     // Handle theme color change
//     const handleColorChange = (color) => {
//         setSelectedColor(color);
//     };

//     // Handle wallpaper change
//     const handleWallpaperChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 setSelectedWallpaper(event.target.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Apply theme changes
//     const applyTheme = () => {
//         try {
//             const stored = localStorage.getItem('chatThemes');
//             const themes = stored ? JSON.parse(stored) : {};

//             themes[activeChat._id] = { color: selectedColor, wallpaper: selectedWallpaper };
//             localStorage.setItem('chatThemes', JSON.stringify(themes));
//         } catch (error) {
//             console.error('Error saving theme:', error);
//             toast.error('Failed to save theme');
//         }

//         setShowThemeModal(false);
//     };

//     // Get current theme for active chat
//     const getCurrentTheme = () => {
//         try {
//             const stored = localStorage.getItem('chatThemes');
//             if (!stored) return {};

//             const themes = JSON.parse(stored);
//             return themes[activeChat?._id] || {};
//         } catch (error) {
//             console.error('Error parsing chat themes:', error);
//             return {};
//         }
//     };

//     // Clear chat messages
//     const clearChat = () => {
//         if (!activeChat) return;

//         const chatId = activeChat._id;
//         const messageIds = messages[chatId]?.map(msg => msg._id) || [];

//         setClearedChats(prev => ({
//             ...prev,
//             [chatId]: [...(prev[chatId] || []), ...messageIds]
//         }));

//         setMessages(prev => ({
//             ...prev,
//             [chatId]: []
//         }));

//         setShowMoreOptions(false);
//         toast.success('Chat cleared');
//     };

//     // Block user
//     const blockUser = () => {
//         if (!activeChat) return;

//         setBlockedUsers(prev => {
//             const newSet = new Set(prev);
//             newSet.add(activeChat._id);
//             return newSet;
//         });

//         setActiveChat(null);
//         setShowMoreOptions(false);
//         toast.info(`${activeChat.firstName} has been blocked`);
//     };

//     // Unblock user
//     const unblockUser = (userId) => {
//         setBlockedUsers(prev => {
//             const newSet = new Set(prev);
//             newSet.delete(userId);
//             return newSet;
//         });
//         toast.success('User unblocked successfully');
//     };

//     // View contact details
//     const viewContact = () => {
//         setShowContactModal(true);
//         setShowMoreOptions(false);
//     };

//     // Predefined color options
//     const colorOptions = [
//         '#d9fdd3', // WhatsApp green
//         '#ffffff', // White
//         '#fff8e1', // Light yellow
//         '#e3f2fd', // Light blue
//         '#f3e5f5', // Light purple
//         '#ffebee', // Light red
//         '#e8f5e9', // Light green
//         '#fce4ec', // Soft pink
// '#ede7f6', // Lavender
// '#f1f8e9', // Pale green
// '#fff3e0', // Peach
// '#e0f7fa', // Aqua blue
// '#e0f2f1', // Mint gray
// '#f9fbe7', // Lemon yellow
// '#fbe9e7', // Coral peach
// '#f3f4f6', // Light gray (neutral)
// '#f0f4c3', // Lime tint
// '#c8e6c9', // Pastel green
// '#d7ccc8', // Warm beige
// '#f5f5f5', // Soft neutral white-gray
// '#ffe0b2', // Pastel orange
// '#cfd8dc', // Cool gray-blue

//     ];

//     // Predefined wallpaper options
//     const wallpaperOptions = [
//         'https://example.com/wallpaper1.jpg',
//         'https://example.com/wallpaper2.jpg',
//         'https://example.com/wallpaper3.jpg',
//     ];

//     // Current theme settings
//     const currentTheme = getCurrentTheme();

//     return (
//         <div className="airchat-container">
//             {/* Sidebar */}
//             <div className="sidebar">
//                 <div className="sidebar-header">
//                     <div className="app-logo">
//                         <span className="logo-text">AirChat</span>
//                     </div>
//                     <div className="header-actions">
//                         <button
//                             className="icon-btn"
//                             onClick={() => setShowBlockedUsers(!showBlockedUsers)}
//                             title={showBlockedUsers ? "Show Chats" : "Show Blocked Users"}
//                         >
//                             <FaBan />
//                         </button>
//                         <button
//                             className="icon-btn logout-btn"
//                             onClick={handleLogout}
//                             title="Logout"
//                         >
//                             <FaSignOutAlt />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="tabs">
//                     <button
//                         className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('chats')}
//                     >
//                         CHATS
//                     </button>
//                 </div>

//                 <div className="search-container">
//                     <div className="search-box">
//                         <FaSearch className="search-icon" />
//                         <input
//                             type="text"
//                             placeholder={showBlockedUsers ? "Search blocked users" : "Search or start new chat"}
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <div className="chats-list">
//                     {showBlockedUsers ? (
//                         <>
//                             <div className="section-title">Blocked Users</div>
//                             {loadingUsers ? (
//                                 <div className="text-center py-4">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                 </div>
//                             ) : getBlockedUsers().length === 0 ? (
//                                 <div className="text-center py-4">
//                                     <p>No blocked users</p>
//                                 </div>
//                             ) : (
//                                 getBlockedUsers()
//                                     .filter(user =>
//                                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//                                     )
//                                     .map(user => (
//                                         <div
//                                             key={user._id}
//                                             className="chat-item blocked-user"
//                                         >
//                                             <div className="avatar">
//                                                 {user.profilePhoto ? (
//                                                     <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
//                                                 ) : (
//                                                     <div className="avatar-placeholder">
//                                                         {user.firstName.charAt(0)}
//                                                     </div>
//                                                 )}
//                                                 <span className="blocked-badge"></span>
//                                             </div>
//                                             <div className="chat-info">
//                                                 <div className="chat-header">
//                                                     <div className="user-name">{user.firstName} {user.lastName}</div>
//                                                 </div>
//                                                 <div className="last-message-container">
//                                                     <button
//                                                         className="unblock-btn"
//                                                         onClick={() => unblockUser(user._id)}
//                                                     >
//                                                         Unblock
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))
//                             )}
//                         </>
//                     ) : (
//                         <>
//                             {loadingUsers ? (
//                                 <div className="text-center py-4">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                 </div>
//                             ) : filteredUsers.length === 0 ? (
//                                 <div className="text-center py-4">
//                                     <p>No users found</p>
//                                 </div>
//                             ) : (
//                                 filteredUsers
//                                     .filter(user => !blockedUsers.has(user._id)) // Filter out blocked users
//                                     .map(user => {
//                                         const lastMessage = getLastMessage(user._id);
//                                         const isOnline = isUserOnline(user._id);

//                                         return (
//                                             <div
//                                                 key={user._id}
//                                                 className={`chat-item ${activeChat?._id === user._id ? 'active' : ''}`}
//                                                 onClick={() => setActiveChat(user)}
//                                             >
//                                                 <div className="avatar">
//                                                     {user.profilePhoto ? (
//                                                         <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
//                                                     ) : (
//                                                         <div className="avatar-placeholder">
//                                                             {user.firstName.charAt(0)}
//                                                         </div>
//                                                     )}
//                                                     {isOnline && <span className="online-badge"></span>}
//                                                 </div>
//                                                 <div className="chat-info">
//                                                     <div className="chat-header">
//                                                         <div className="user-name">{user.firstName} {user.lastName}</div>
//                                                         <div className="last-seen">
//                                                             {isOnline ? (
//                                                                 <span className="online-text">Online</span>
//                                                             ) : (
//                                                                 <span>Last seen {formatLastSeen(user.lastActive)}</span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                     <div className="last-message-container">
//                                                         {lastMessage ? (
//                                                             <>
//                                                                 <div className="last-message-text">
//                                                                     {lastMessage.isFromMe && (
//                                                                         <span className="message-status">
//                                                                             {lastMessage.status === 'pending' && <FaClock className="text-muted" />}
//                                                                             {lastMessage.status === 'sent' && <FaCheck className="text-muted" />}
//                                                                             {lastMessage.status === 'read' && (
//                                                                                 <span className="double-check blue">
//                                                                                     <FaCheck />
//                                                                                     <FaCheck />
//                                                                                 </span>
//                                                                             )}
//                                                                             {lastMessage.status === 'failed' && (
//                                                                                 <span className="text-danger">!</span>
//                                                                             )}
//                                                                         </span>
//                                                                     )}
//                                                                     {lastMessage.text}
//                                                                 </div>
//                                                                 <div className="last-message-time">{lastMessage.time}</div>
//                                                             </>
//                                                         ) : (
//                                                             <div className="no-messages-text">No messages yet</div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>

//             {/* Main Chat Area */}
//             <div className="main-chat-area">
//                 {activeChat ? (
//                     <>
//                         <div className="chat-header">
//                             {isSearchActive ? (
//                                 <div className="chat-search-container">
//                                     <button
//                                         className="icon-btn"
//                                         onClick={goToPrevSearchResult}
//                                         disabled={!chatSearchQuery}
//                                     >
//                                         <FaArrowUp />
//                                     </button>
//                                     <button
//                                         className="icon-btn"
//                                         onClick={goToNextSearchResult}
//                                         disabled={!chatSearchQuery}
//                                     >
//                                         <FaArrowDown />
//                                     </button>
//                                     <input
//                                         id="chat-search-input"
//                                         type="text"
//                                         placeholder="Search in conversation"
//                                         value={chatSearchQuery}
//                                         onChange={handleChatSearch}
//                                     />
//                                     <button
//                                         className="icon-btn"
//                                         onClick={clearChatSearch}
//                                     >
//                                         <FaTimes />
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="chat-partner">
//                                         <div className="avatar">
//                                             {activeChat.profilePhoto ? (
//                                                 <img src={activeChat.profilePhoto} alt={`${activeChat.firstName} ${activeChat.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">
//                                                     {activeChat.firstName.charAt(0)}
//                                                 </div>
//                                             )}
//                                             {isUserOnline(activeChat._id) && <span className="online-badge"></span>}
//                                         </div>
//                                         <div className="partner-info">
//                                             <div className="partner-name">
//                                                 {activeChat.firstName} {activeChat.lastName}
//                                             </div>
//                                             <div className="partner-status">
//                                                 {isUserOnline(activeChat._id) ? (
//                                                     <span className="online-text">Online</span>
//                                                 ) : (
//                                                     <span>Last seen {formatLastSeen(activeChat.lastActive)}</span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="header-actions">
//                                         <button
//                                             className="icon-btn"
//                                             onClick={() => setIsSearchActive(true)}
//                                         >
//                                             <FaSearch />
//                                         </button>
//                                         <div className="more-options-container">
//                                             <button
//                                                 className="icon-btn"
//                                                 onClick={() => setShowMoreOptions(!showMoreOptions)}
//                                             >
//                                                 <FaEllipsisV />
//                                             </button>
//                                             {showMoreOptions && (
//                                                 <div className="more-options-dropdown">
//                                                     <button onClick={viewContact}>
//                                                         <span>View Contact</span>
//                                                     </button>
//                                                     <button onClick={() => {
//                                                         setShowThemeModal(true);
//                                                         setShowMoreOptions(false);
//                                                     }}>
//                                                         <span>Chat Theme</span>
//                                                     </button>
//                                                     <button onClick={clearChat}>
//                                                         <FaTrash className="icon" />
//                                                         <span>Clear Chat</span>
//                                                     </button>
//                                                     <button onClick={blockUser}>
//                                                         <FaBan className="icon" />
//                                                         <span>Block</span>
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>

//                         <div
//                             className="chat-messages"
//                             //   style={chatStyle}

//                             style={{
//                                 backgroundColor: currentTheme.color || '#d9fdd3',
//                                 backgroundImage: currentTheme.wallpaper ? `url(${currentTheme.wallpaper})` : 'none',
//                                 backgroundSize: 'cover',
//                                 backgroundPosition: 'center',
//                                 backgroundRepeat: 'no-repeat'
//                             }}
//                         >
//                             {loadingMessages ? (
//                                 <div className="text-center py-4">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading messages...</span>
//                                     </div>
//                                 </div>
//                             ) : messages[activeChat._id]?.length === 0 ? (
//                                 <div className="no-messages">
//                                     <p>No messages yet. Start the conversation!</p>
//                                 </div>
//                             ) : (
//                                 messages[activeChat._id]?.map((msg, index) => (
//                                     <div
//                                         key={msg._id || msg.id}
//                                         className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
//                                         ref={el => messageRefs.current[msg._id] = el}
//                                     >
//                                         <div className="message-content">
//                                             {highlightMatches(msg.text)}
//                                             {msg.isOptimistic && (
//                                                 <span className="sending-indicator">Sending...</span>
//                                             )}
//                                         </div>
//                                         <div className="message-meta">
//                                             <div className="message-time">
//                                                 {formatMessageTime(msg.createdAt)}
//                                             </div>
//                                             {msg.sender === user.id && (
//                                                 <div className="message-status">
//                                                     {msg.status === 'pending' && <FaClock className="text-muted" />}
//                                                     {msg.status === 'sent' && <FaCheck className="text-muted" />}
//                                                     {msg.status === 'read' && (
//                                                         <span className="double-check blue">
//                                                             <FaCheck />
//                                                             <FaCheck />
//                                                         </span>
//                                                     )}
//                                                     {msg.status === 'failed' && (
//                                                         <span className="text-danger">!</span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         <div className="message-input-area">
//                             <button className="icon-btn">
//                                 <FaSmile />
//                             </button>
//                             <button className="icon-btn">
//                                 <FaPaperclip />
//                             </button>
//                             <div className="message-input-container">
//                                 <textarea
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     onKeyDown={handleKeyPress}
//                                     placeholder="Type a message"
//                                     rows={1}
//                                 />
//                             </div>
//                             {message ? (
//                                 <button
//                                     className="send-btn"
//                                     onClick={handleSendMessage}
//                                     disabled={isSending || blockedUsers.has(activeChat._id)}
//                                 >
//                                     {isSending ? (
//                                         <div className="sending-spinner"></div>
//                                     ) : (
//                                         <IoIosSend />
//                                     )}
//                                 </button>
//                             ) : (
//                                 <button className="icon-btn">
//                                     <FaMicrophone />
//                                 </button>
//                             )}
//                         </div>
//                     </>
//                 ) : (
//                     <div className="no-chat-selected">
//                         <div className="welcome-container">
//                             <div className="logo-large">
//                                 <span className="logo-text">AirChat</span>
//                             </div>
//                             <h2>Welcome, {user.name}</h2>
//                             <p>Select a chat to start messaging</p>
//                             <p>Or start a new conversation</p>
//                             {/* <button className="logout-btn" onClick={handleLogout}>
//                                 Logout
//                             </button> */}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Theme Modal */}
//             {showThemeModal && (
//                 <div className="modal-overlay">
//                     <div className="theme-modal">
//                         <div className="modal-header">
//                             <h3>Chat Theme</h3>
//                             <button className="close-btn" onClick={() => setShowThemeModal(false)}>
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="theme-tabs">
//                             <button
//                                 className={`theme-tab ${themeTab === 'color' ? 'active' : ''}`}
//                                 onClick={() => setThemeTab('color')}
//                             >
//                                 <FaPalette /> Color
//                             </button>
//                             <button
//                                 className={`theme-tab ${themeTab === 'wallpaper' ? 'active' : ''}`}
//                                 onClick={() => setThemeTab('wallpaper')}
//                             >
//                                 <FaImage /> Wallpaper
//                             </button>
//                         </div>

//                         <div className="theme-content">
//                             {themeTab === 'color' ? (
//                                 <div className="color-options">
//                                     {colorOptions.map((color, index) => (
//                                         <div
//                                             key={index}
//                                             className={`color-option ${selectedColor === color ? 'selected' : ''}`}
//                                             style={{ backgroundColor: color }}
//                                             onClick={() => handleColorChange(color)}
//                                         >
//                                             {selectedColor === color && <FaCheck className="check-icon" />}
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="wallpaper-options">
//                                     <div className="custom-wallpaper">
//                                         <label className="upload-btn">
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={handleWallpaperChange}
//                                                 style={{ display: 'none' }}
//                                             />
//                                             Upload Custom Wallpaper
//                                         </label>
//                                     </div>

//                                     <div className="predefined-wallpapers">
//                                         {wallpaperOptions.map((wallpaper, index) => (
//                                             <div
//                                                 key={index}
//                                                 className={`wallpaper-option ${selectedWallpaper === wallpaper ? 'selected' : ''}`}
//                                                 onClick={() => setSelectedWallpaper(wallpaper)}
//                                                 style={{ backgroundImage: `url(${wallpaper})` }}
//                                             >
//                                                 {selectedWallpaper === wallpaper && <FaCheck className="check-icon" />}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="modal-footer">
//                             <button className="btn-cancel" onClick={() => setShowThemeModal(false)}>
//                                 Cancel
//                             </button>
//                             <button className="btn-apply" onClick={applyTheme}>
//                                 Apply
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Contact Modal */}
//             {showContactModal && (
//                 <div className="modal-overlay">
//                     <div className="contact-modal">
//                         <div className="modal-header">
//                             <h3>Contact Info</h3>
//                             <button className="close-btn" onClick={() => setShowContactModal(false)}>
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="contact-content">
//                             <div className="contact-avatar">
//                                 {activeChat.profilePhoto ? (
//                                     <img src={activeChat.profilePhoto} alt={`${activeChat.firstName} ${activeChat.lastName}`} />
//                                 ) : (
//                                     <div className="avatar-placeholder large">
//                                         {activeChat.firstName.charAt(0)}
//                                     </div>
//                                 )}
//                                 <div className="contact-name">
//                                     {activeChat.firstName} {activeChat.lastName}
//                                 </div>
//                                 <div className="contact-status">
//                                     {isUserOnline(activeChat._id) ? (
//                                         <span className="online-text">Online</span>
//                                     ) : (
//                                         <span>Last seen {formatLastSeen(activeChat.lastActive)}</span>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="contact-details">
//                                 <div className="detail-item">
//                                     <span className="detail-label">Email:</span>
//                                     <span className="detail-value">{activeChat.email || 'Not available'}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Phone:</span>
//                                     <span className="detail-value">{activeChat.phone || 'Not available'}</span>
//                                 </div>
//                             </div>

//                             <div className="contact-actions">
//                                 {blockedUsers.has(activeChat._id) ? (
//                                     <button
//                                         className="btn-unblock"
//                                         onClick={() => unblockUser(activeChat._id)}
//                                     >
//                                         Unblock User
//                                     </button>
//                                 ) : (
//                                     <button
//                                         className="btn-block"
//                                         onClick={blockUser}
//                                     >
//                                         Block User
//                                     </button>
//                                 )}
//                                 <button
//                                     className="btn-close"
//                                     onClick={() => setShowContactModal(false)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChatPage;



// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
//   FaSignOutAlt, FaCheck, FaClock, FaTimes, FaArrowUp, FaArrowDown,
//   FaPalette, FaImage, FaBan, FaTrash, FaUserPlus, FaBell, FaUserFriends
// } from 'react-icons/fa';
// import { IoIosSend, IoIosAdd } from 'react-icons/io';
// import { MdArrowBack, MdSearch, MdClose } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import './ChatPage.css';

// const ChatPage = ({ user, onLogout,setChatTheme, blockUser }) => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('chats');
//   const [friends, setFriends] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingFriends, setLoadingFriends] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [onlineUsers, setOnlineUsers] = useState(new Set());
//   const messagesEndRef = useRef(null);
//   const [showAddFriendModal, setShowAddFriendModal] = useState(false);
//   const [friendRequests, setFriendRequests] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [showFriendOptions, setShowFriendOptions] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);


//     const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showMenu, setShowMenu] = useState(false);
//   const [showContactPopup, setShowContactPopup] = useState(false);
//   const [showThemePopup, setShowThemePopup] = useState(false);
//   const [themeMode, setThemeMode] = useState('default'); // 'default', 'color', 'wallpaper'
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedWallpaper, setSelectedWallpaper] = useState(null);

//   const menuRef = useRef(null);
//   const themeRef = useRef(null);



// // Handle mobile animations
//   useEffect(() => {
//   if (showNotifications) {
//     // Timeout to allow DOM update before applying active class
//     setTimeout(() => setIsMobilePanelOpen(true), 10);
//   } else {
//     setIsMobilePanelOpen(false);
//   }
// }, [showNotifications]);


// useEffect(() => {
//   if (showNotifications && window.innerWidth <= 768) {
//     document.body.style.overflow = 'hidden';
//   } else {
//     document.body.style.overflow = 'auto';
//   }

//   return () => {
//     document.body.style.overflow = 'auto';
//   };
// }, [showNotifications]);

//   // Simulate online status
//   useEffect(() => {
//     const onlineUserIds = new Set(['1', '3', '8']);
//     setOnlineUsers(onlineUserIds);
//   }, []);

//   // Fetch friends from the database
//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         setLoadingFriends(true);
//         // This would be replaced with actual API call to get friends
//         const response = await axios.get('/api/friends');
//         setFriends(response.data);
//       } catch (error) {
//         toast.error('Failed to load friends');
//         console.error('Error fetching friends:', error);
//       } finally {
//         setLoadingFriends(false);
//       }
//     };

//     fetchFriends();
//   }, [user.id]);

//   // Fetch all users for add friend modal
//   useEffect(() => {
//     const fetchAllUsers = async () => {
//       try {
//         const response = await axios.get('/api/users');
//         setAllUsers(response.data.filter(u => u._id !== user.id));
//       } catch (error) {
//         toast.error('Failed to load users');
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchAllUsers();
//   }, [user.id]);

//   // Fetch friend requests
//   useEffect(() => {
//     const fetchFriendRequests = async () => {
//       try {
//         const response = await axios.get('/api/friend-requests');
//         setFriendRequests(response.data);
//       } catch (error) {
//         toast.error('Failed to load friend requests');
//         console.error('Error fetching friend requests:', error);
//       }
//     };

//     fetchFriendRequests();
//   }, [user.id]);

//   // Fetch messages when a chat is selected
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!activeChat) return;

//       try {
//         setLoadingMessages(true);
//         const response = await axios.get(`/api/messages/${activeChat._id}`);
//         setMessages(prev => ({
//           ...prev,
//           [activeChat._id]: response.data
//         }));
//       } catch (error) {
//         toast.error('Failed to load messages');
//         console.error('Error fetching messages:', error);
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [activeChat]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, activeChat]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleLogout = () => {
//     onLogout();
//     navigate("/");
//   };

//   const filteredFriends = friends.filter(friend =>
//     `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

// const sendFriendRequest = async (userId) => {
//   try {
//     // Change 'receiverId' to 'recipientId' to match backend
//     await axios.post('/api/friend-requests', { recipientId: userId });

//     toast.success('Friend request sent');
//     setAllUsers(prev => prev.map(u => 
//       u._id === userId ? { ...u, requestSent: true } : u
//     ));
//   } catch (error) {
//     const message = error.response?.data?.message || 'Failed to send request';
//     toast.error(message);
//     console.error('Friend request error:', error.response?.data);
//   }
// };

// const acceptFriendRequest = async (requestId) => {
//   try {
//     await axios.put(`/api/friend-requests/${requestId}`, { status: 'accepted' });

//     // Update UI
//     setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//     toast.success('Friend request accepted');
//   } catch (error) {
//     toast.error('Failed to accept request');
//     console.error('Accept error:', error);
//   }
// };

// const rejectFriendRequest = async (requestId) => {
//   try {
//     await axios.put(`/api/friend-requests/${requestId}`, { status: 'rejected' });

//     // Update UI
//     setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//     toast.info('Friend request rejected');
//   } catch (error) {
//     toast.error('Failed to reject request');
//     console.error('Reject error:', error);
//   }
// };

//   const handleSendMessage = async () => {
//     if (!message.trim() || !activeChat) return;

//     const receiverId = activeChat._id;

//     const newMessage = {
//       text: message,
//       sender: user.id,
//       receiver: receiverId,
//       createdAt: new Date()
//     };

//     try {
//       setIsSending(true);
//       const response = await axios.post('/api/messages', newMessage);

//       setMessages(prev => ({
//         ...prev,
//         [receiverId]: [...(prev[receiverId] || []), response.data]
//       }));

//       setMessage('');
//     } catch (error) {
//       toast.error('Failed to send message');
//       console.error('Error sending message:', error);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Format time for messages
//   const formatMessageTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Check if user is online
//   const isUserOnline = (userId) => {
//     return onlineUsers.has(userId);
//   };

//   // Toggle sidebar on mobile
//   const toggleSidebar = () => {
//     setShowSidebar(!showSidebar);
//   };

//   // View user details
//   const viewUserDetails = (user) => {
//     setSelectedUser(user);
//   };


//   const handleClose = () => {
//   setShowNotifications(false);

//   // Reset body overflow when closing panel
//   if (window.innerWidth <= 768) {
//     document.body.style.overflow = 'auto';
//   }
// };




//   const handleThemeSelection = () => {
//     if (selectedColor) {
//       setChatTheme({ type: 'color', value: selectedColor });
//     } else if (selectedWallpaper) {
//       setChatTheme({ type: 'wallpaper', value: selectedWallpaper });
//     }
//     setShowThemePopup(false);
//   };

//   const handleBlockUser = () => {
//     blockUser(activeChat._id);
//     setShowMenu(false);
//   };

//   const handleClearChat = () => {
//     clearChatHistory(activeChat._id);
//     setShowMenu(false);
//   };



//     useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setShowMenu(false);
//       }
//       if (themeRef.current && !themeRef.current.contains(e.target)) {
//         setShowThemePopup(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Highlight search matches
//   useEffect(() => {
//     if (searchQuery) {
//       // Implement your message highlighting logic here
//       console.log(`Searching for: ${searchQuery}`);
//       // This would typically iterate through messages and highlight matches
//     }
//   }, [searchQuery]);

// const clearChatHistory = async (userId) => {
//   try {
//     const token = localStorage.getItem('token'); 

//     await axios.delete(`http://localhost:5000/api/chats/${userId}/clear`, {  // FIX: use backend port
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     setMessages([]);
//     localStorage.removeItem(`chat_${userId}`);
//   } catch (error) {
//     console.error('Clear chat error:', error.response?.data || error.message);
//   }
// };

//   return (
//     <div className="airchat-container">
//       {/* Sidebar - Only show on large screens or when toggled on mobile */}
//       {(showSidebar || window.innerWidth > 768) && (
//         <div className="sidebar">
//           <div className="sidebar-header">
//             <div className="app-logo">
//               <span className="logo-text">AirChat</span>
//             </div>
//             <div className="header-actions">
//               <button
//                 className="icon-btn notification-btn"
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 title="Notifications"
//               >
//                 <FaBell />
//                 {friendRequests.length > 0 && (
//                   <span className="notification-badge">{friendRequests.length}</span>
//                 )}
//               </button>
//               <button
//                 className="icon-btn logout-btn"
//                 onClick={handleLogout}
//                 title="Logout"
//               >
//                 <FaSignOutAlt />
//               </button>
//             </div>
//           </div>

//           <div className="tabs">
//             <button
//               className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
//               onClick={() => setActiveTab('chats')}
//             >
//               CHATS
//             </button>
//             <button
//               className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
//               onClick={() => setActiveTab('status')}
//             >
//               STATUS
//             </button>
//           </div>

//           {/* <div className="search-container">
//             <div className="search-box">
//               <FaSearch className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search friends"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div> */}

//           <div className="chats-list">
//             {loadingFriends ? (
//               <div className="text-center py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             ) : filteredFriends.length === 0 ? (
//               <div className="text-center py-4">
//                 <p>No friends found</p>
//               </div>
//             ) : (
//               filteredFriends.map(friend => {
//                 const lastMessage = messages[friend._id]?.[messages[friend._id]?.length - 1];
//                 const isOnline = isUserOnline(friend._id);

//                 return (
//                   <div
//                     key={friend._id}
//                     className={`chat-item ${activeChat?._id === friend._id ? 'active' : ''}`}
//                     onClick={() => {
//                       setActiveChat(friend);
//                       if (window.innerWidth <= 768) setShowSidebar(false);
//                     }}
//                   >
//                     <div className="avatar">
//                       {friend.profilePhoto ? (
//                         <img src={friend.profilePhoto} alt={`${friend.firstName} ${friend.lastName}`} />
//                       ) : (
//                         <div className="avatar-placeholder">
//                           {friend.firstName.charAt(0)}
//                         </div>
//                       )}
//                       {isOnline && <span className="online-badge"></span>}
//                     </div>
//                     <div className="chat-info">
//                       <div className="chat-header">
//                         <div className="user-name">{friend.firstName} {friend.lastName}</div>
//                         <div className="last-seen">
//                           {isOnline ? (
//                             <span className="online-text">Online</span>
//                           ) : (
//                             <span>Offline</span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="last-message-container">
//                         {lastMessage ? (
//                           <>
//                             <div className="last-message-text">
//                               {lastMessage.text}
//                             </div>
//                             <div className="last-message-time">
//                               {formatMessageTime(lastMessage.createdAt)}
//                             </div>
//                           </>
//                         ) : (
//                           <div className="no-messages-text">No messages yet</div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* Friend Options Toggle */}
//           <div className="friend-options-toggle">
//             <button
//               className="toggle-btn"
//               onClick={() => setShowFriendOptions(!showFriendOptions)}
//             >
//               <IoIosAdd />
//             </button>

//             {showFriendOptions && (
//               <div className="friend-options">
//                 <button 
//                   className="friend-option-btn"
//                   onClick={() => {
//                     setShowAddFriendModal(true);
//                     setShowFriendOptions(false);
//                   }}
//                 >
//                   <FaUserPlus /> Add Friend
//                 </button>
//                 <button 
//                   className="friend-option-btn"
//                   onClick={() => setShowFriendOptions(false)}
//                 >
//                   <MdArrowBack /> Back
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Main Chat Area */}
//       <div className={`main-chat-area ${!showSidebar && window.innerWidth <= 768 ? 'expanded' : ''}`}>
//         {activeChat ? (
//           <>
//             {/* <div className="chat-header">
//               {window.innerWidth <= 768 && (
//                 <button 
//                   className="back-btn"
//                   onClick={() => {
//                     setShowSidebar(true);
//                     setActiveChat(null);
//                   }}
//                 >
//                   <MdArrowBack />
//                 </button>
//               )}
//               <div className="chat-partner">
//                 <div className="avatar">
//                   {activeChat.profilePhoto ? (
//                     <img src={activeChat.profilePhoto} alt={`${activeChat.firstName} ${activeChat.lastName}`} />
//                   ) : (
//                     <div className="avatar-placeholder">
//                       {activeChat.firstName.charAt(0)}
//                     </div>
//                   )}
//                   {isUserOnline(activeChat._id) && <span className="online-badge"></span>}
//                 </div>
//                 <div className="partner-info">
//                   <div className="partner-name">
//                     {activeChat.firstName} {activeChat.lastName}
//                   </div>
//                   <div className="partner-status">
//                     {isUserOnline(activeChat._id) ? (
//                       <span className="online-text">Online</span>
//                     ) : (
//                       <span>Offline</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="header-actions">
//                 <button className="icon-btn">
//                   <FaEllipsisV />
//                 </button>
//               </div>
//             </div> */}

// <div className="chat-header">
//       {/* Left section - Back button & Profile */}
//       <div className="header-left">
//         {window.innerWidth <= 768 && (
//           <button 
//             className="back-btn"
//             onClick={() => {
//               setShowSidebar(true);
//               setActiveChat(null);
//             }}
//           >
//             <MdArrowBack />
//           </button>
//         )}

//         <div className="chat-partner">
//           <div className="avatar">
//             {activeChat.profilePhoto ? (
//               <img 
//                 src={activeChat.profilePhoto} 
//                 alt={`${activeChat.firstName} ${activeChat.lastName}`} 
//               />
//             ) : (
//               <div className="avatar-placeholder">
//                 {activeChat.firstName?.charAt(0)}
//               </div>
//             )}
//             {isUserOnline(activeChat._id) && <span className="online-badge"></span>}
//           </div>
//           <div className="partner-info">
//             <div className="partner-name">
//               {activeChat.firstName} {activeChat.lastName}
//             </div>
//             <div className="partner-status">
//               {isUserOnline(activeChat._id) ? (
//                 <span className="online-text">Online</span>
//               ) : (
//                 <span>Offline</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Center section - Search */}
//       {/* <div className="header-center">
//         {showSearch ? (
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search messages..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               autoFocus
//             />
//             <button 
//               className="close-search"
//               onClick={() => {
//                 setShowSearch(false);
//                 setSearchQuery('');
//               }}
//             >
//               <MdClose />
//             </button>
//           </div>
//         ) : null}
//       </div> */}

//       {/* Right section - Actions */}
//       <div className="header-actions">
//         {/* <button 
//           className="icon-btn"
//           onClick={() => setShowSearch(!showSearch)}
//         >
//           <MdSearch />
//         </button> */}

//         <div className="menu-container" ref={menuRef}>
//           <button 
//             className="icon-btn"
//             onClick={() => setShowMenu(!showMenu)}
//           >
//             <FaEllipsisV />
//           </button>

//           {showMenu && (
//             <div className="menu-popup">
//               <button onClick={() => {
//                 setShowContactPopup(true);
//                 setShowMenu(false);
//               }}>
//                 View Contact
//               </button>
//               <button onClick={() => {
//                 setShowThemePopup(true);
//                 setShowMenu(false);
//               }}>
//                 Chat Theme
//               </button>
//               <button onClick={handleBlockUser}>
//                 Block User
//               </button>
//               {/* <button onClick={handleClearChat}>
//                 Clear Chat
//               </button> */}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Contact Popup */}
//       {showContactPopup && (
//         <div className="contact-popup">
//           <div className="popup-content">
//             <button 
//               className="close-popup"
//               onClick={() => setShowContactPopup(false)}
//             >
//               <MdClose />
//             </button>

//             <div className="contact-header">
//               <div className="contact-avatar">
//                 {activeChat.profilePhoto ? (
//                   <img 
//                     src={activeChat.profilePhoto} 
//                     alt={`${activeChat.firstName} ${activeChat.lastName}`} 
//                   />
//                 ) : (
//                   <div className="avatar-placeholder large">
//                     {activeChat.firstName?.charAt(0)}
//                   </div>
//                 )}
//               </div>
//               <h3>{activeChat.firstName} {activeChat.lastName}</h3>
//             </div>

//             <div className="contact-details">
//               <div className="detail-item">
//                 <label>Email:</label>
//                 <span>{activeChat.email || 'Not provided'}</span>
//               </div>
//               <div className="detail-item">
//                 <label>Phone:</label>
//                 <span>{activeChat.phoneNumber || 'Not provided'}</span>
//               </div>
//               <div className="detail-item">
//                 <label>Country:</label>
//                 <span>{activeChat.country || 'Not provided'}</span>
//               </div>
//               <div className="detail-item">
//                 <label>Status:</label>
//                 <span>
//                   {isUserOnline(activeChat._id) 
//                     ? 'Online' 
//                     : 'Offline'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Theme Popup */}
//       {showThemePopup && (
//         <div className="theme-popup" ref={themeRef}>
//           <div className="popup-content">
//             <button 
//               className="close-popup"
//               onClick={() => setShowThemePopup(false)}
//             >
//               <MdClose />
//             </button>

//             <h3>Chat Theme</h3>

//             <div className="theme-tabs">
//               <button 
//                 className={themeMode === 'color' ? 'active' : ''}
//                 onClick={() => setThemeMode('color')}
//               >
//                 Color Theme
//               </button>
//               <button 
//                 className={themeMode === 'wallpaper' ? 'active' : ''}
//                 onClick={() => setThemeMode('wallpaper')}
//               >
//                 Wallpaper
//               </button>
//             </div>

//             <div className="theme-content">
//               {themeMode === 'color' ? (
//                 <div className="color-themes">
//                   <h4>Select a color theme:</h4>
//                   <div className="color-grid">
//                     {['#f0f8ff', '#fff0f5', '#f5f5dc', '#e6e6fa', '#f0fff0', '#fffacd'].map(color => (
//                       <div 
//                         key={color}
//                         className={`color-option ${selectedColor === color ? 'selected' : ''}`}
//                         style={{ backgroundColor: color }}
//                         onClick={() => setSelectedColor(color)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="wallpaper-themes">
//                   <h4>Select a wallpaper:</h4>
//                   <input 
//                     type="file" 
//                     accept="image/*"
//                     onChange={(e) => {
//                       if (e.target.files[0]) {
//                         const reader = new FileReader();
//                         reader.onload = (event) => {
//                           setSelectedWallpaper(event.target.result);
//                         };
//                         reader.readAsDataURL(e.target.files[0]);
//                       }
//                     }}
//                   />
//                   {selectedWallpaper && (
//                     <div className="wallpaper-preview">
//                       <img src={selectedWallpaper} alt="Wallpaper preview" />
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="theme-actions">
//               <button 
//                 className="cancel-btn"
//                 onClick={() => setShowThemePopup(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="confirm-btn"
//                 onClick={handleThemeSelection}
//                 disabled={!selectedColor && !selectedWallpaper}
//               >
//                 Apply Theme
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>


//             <div className="chat-messages">
//               {loadingMessages ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading messages...</span>
//                   </div>
//                 </div>
//               ) : messages[activeChat._id]?.length === 0 ? (
//                 <div className="no-messages">
//                   <p>No messages yet. Start the conversation!</p>
//                 </div>
//               ) : (
//                 messages[activeChat._id]?.map((msg) => (
//                   <div
//                     key={msg._id}
//                     className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
//                   >
//                     <div className="message-content">
//                       {msg.text}
//                     </div>
//                     <div className="message-meta">
//                       <div className="message-time">
//                         {formatMessageTime(msg.createdAt)}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="message-input-area">
//               <button className="icon-btn">
//                 <FaSmile />
//               </button>
//               <button className="icon-btn">
//                 <FaPaperclip />
//               </button>
//               <div className="message-input-container">
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyDown={handleKeyPress}
//                   placeholder="Type a message"
//                   rows={1}
//                 />
//               </div>
//               {message ? (
//                 <button
//                   className="send-btn"
//                   onClick={handleSendMessage}
//                   disabled={isSending}
//                 >
//                   {isSending ? (
//                     <div className="sending-spinner"></div>
//                   ) : (
//                     <IoIosSend />
//                   )}
//                 </button>
//               ) : (
//                 <button className="icon-btn">
//                   <FaMicrophone />
//                 </button>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="no-chat-selected">
//             <div className="welcome-container">
//               <div className="logo-large">
//                 <span className="logo-text">AirChat</span>
//               </div>
//               <h2>Welcome, {user.name}</h2>
//               <p>Select a chat to start messaging</p>
//               <p>Or start a new conversation</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add Friend Modal */}
//       {showAddFriendModal && (
//         <div className="modal-overlay">
//           <div className="add-friend-modal">
//             <div className="modal-header">
//               <h3>Add Friends</h3>
//               <button 
//                 className="close-btn" 
//                 onClick={() => setShowAddFriendModal(false)}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="modal-content">
//               {allUsers
//                 .filter(u => 
//                   !friends.some(f => f._id === u._id) && 
//                   !friendRequests.some(r => r.senderId === u._id)
//                 )
//                 .map(user => (
//                   <div key={user._id} className="user-item">
//                     <div className="user-avatar">
//                       {user.profilePhoto ? (
//                         <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
//                       ) : (
//                         <div className="avatar-placeholder">
//                           {user.firstName.charAt(0)}
//                         </div>
//                       )}
//                     </div>
//                     <div className="user-info">
//                       <div className="user-name">{user.firstName} {user.lastName}</div>
//                       <div className="user-country">{user.country || 'Unknown'}</div>
//                     </div>
//                     <div className="user-actions">
//                       <button 
//                         className="view-btn"
//                         onClick={() => viewUserDetails(user)}
//                       >
//                         View
//                       </button>
//                       <button 
//                         className={`add-btn ${user.requestSent ? 'sent' : ''}`}
//                         onClick={() => sendFriendRequest(user._id)}
//                         disabled={user.requestSent}
//                       >
//                         {user.requestSent ? 'Request Sent' : 'Add'}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* User Detail Modal */}
//       {selectedUser && (
//         <div className="modal-overlay">
//           <div className="user-detail-modal">
//             <div className="modal-header">
//               <h3>User Details</h3>
//               <button 
//                 className="close-btn" 
//                 onClick={() => setSelectedUser(null)}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="modal-content">
//               <div className="user-avatar-large">
//                 {selectedUser.profilePhoto ? (
//                   <img src={selectedUser.profilePhoto} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
//                 ) : (
//                   <div className="avatar-placeholder large">
//                     {selectedUser.firstName.charAt(0)}
//                   </div>
//                 )}
//               </div>

//               <div className="user-details">
//                 <div className="detail-item">
//                   <span className="detail-label">First Name:</span>
//                   <span className="detail-value">{selectedUser.firstName}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Last Name:</span>
//                   <span className="detail-value">{selectedUser.lastName}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Country:</span>
//                   <span className="detail-value">{selectedUser.country || 'Unknown'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Email:</span>
//                   <span className="detail-value">{selectedUser.email}</span>
//                 </div>
//               </div>

//               <div className="modal-actions">
//                 <button 
//                   className="close-detail-btn"
//                   onClick={() => setSelectedUser(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Notifications Panel */}

// {/* Add backdrop for mobile */}
// <div 
//   className={`notifications-backdrop ${showNotifications ? 'active' : ''}`} 
//   onClick={() => setShowNotifications(false)}
// />

// {/* Updated notifications panel */}
// <div className={`notifications-panel ${showNotifications ? 'active' : ''}`}>
//   <div className="panel-header">
//     <h3>Friend Requests</h3>
//     <button 
//       className="close-btn" 
//       onClick={handleClose}
//     >
//       <FaTimes />
//     </button>
//   </div>

// <div className="panel-content">
//   {friendRequests.length === 0 ? (
//     <div className="no-requests">
//       <p>No pending friend requests</p>
//     </div>
//   ) : (
//     friendRequests.map(request => (
//       <div key={request._id} className="request-item">
//         <div className="request-main">
//           <div className="request-avatar">
//             {request.requester?.profilePhoto ? (
//               <img 
//                 src={request.requester.profilePhoto} 
//                 alt={`${request.requester.firstName} ${request.requester.lastName}`} 
//               />
//             ) : (
//               <div className="avatar-placeholder">
//                 {request.requester?.firstName?.charAt(0)}
//               </div>
//             )}
//           </div>

//           <div className="request-details">
//             <div className="request-name">
//               {request.requester?.firstName} {request.requester?.lastName}
//             </div>
//             <div className="request-message">
//               Wants to be your friend
//             </div>
//           </div>
//         </div>

//         <div className="request-actions">
//           <button 
//             className="accept-btn"
//             onClick={() => acceptFriendRequest(request._id)}
//           >
//             Accept
//           </button>
//           <button 
//             className="reject-btn"
//             onClick={() => rejectFriendRequest(request._id)}
//           >
//             Reject
//           </button>
//         </div>
//       </div>
//     ))
//   )}
// </div>
// </div>

//     </div>
//   );
// };

// export default ChatPage;



// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
//     FaSignOutAlt, FaCheck, FaClock, FaTimes, FaArrowUp, FaArrowDown,
//     FaPalette, FaImage, FaBan, FaTrash, FaUserPlus, FaBell, FaUserFriends
// } from 'react-icons/fa';
// import { IoIosSend, IoIosAdd } from 'react-icons/io';
// import { MdArrowBack, MdSearch, MdClose } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import './ChatPage.css';

// const ChatPage = ({ user, onLogout }) => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('chats');
//     const [friends, setFriends] = useState([]);
//     const [allUsers, setAllUsers] = useState([]);
//     const [activeChat, setActiveChat] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState({});
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loadingFriends, setLoadingFriends] = useState(true);
//     const [loadingMessages, setLoadingMessages] = useState(false);
//     const [isSending, setIsSending] = useState(false);
//     const [onlineUsers, setOnlineUsers] = useState(new Set());
//     const messagesEndRef = useRef(null);
//     const [showAddFriendModal, setShowAddFriendModal] = useState(false);
//     const [friendRequests, setFriendRequests] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showSidebar, setShowSidebar] = useState(true);
//     const [showFriendOptions, setShowFriendOptions] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
//     const [showSearch, setShowSearch] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showMenu, setShowMenu] = useState(false);
//     const [showContactPopup, setShowContactPopup] = useState(false);
//     const [showThemePopup, setShowThemePopup] = useState(false);
//     const [themeMode, setThemeMode] = useState('default');
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [selectedWallpaper, setSelectedWallpaper] = useState(null);
//     const menuRef = useRef(null);
//     const themeRef = useRef(null);

// const BACKEND_URL = "http://localhost:5000";

//     const [currentTheme, setCurrentTheme] = useState({});

//     useEffect(() => {
//         if (activeChat?._id) {
//             const themeData = localStorage.getItem('chatThemes');
//             const themes = themeData ? JSON.parse(themeData) : {};
//             setCurrentTheme(themes[activeChat._id] || {});
//         } else {
//             setCurrentTheme({});
//         }
//     }, [activeChat]);

//     // Handle mobile animations
//     useEffect(() => {
//         if (showNotifications) {
//             setTimeout(() => setIsMobilePanelOpen(true), 10);
//         } else {
//             setIsMobilePanelOpen(false);
//         }
//     }, [showNotifications]);

//     useEffect(() => {
//         if (showNotifications && window.innerWidth <= 768) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'auto';
//         }

//         return () => {
//             document.body.style.overflow = 'auto';
//         };
//     }, [showNotifications]);

//     // Simulate online status
//     useEffect(() => {
//         const onlineUserIds = new Set(['1', '3', '8']);
//         setOnlineUsers(onlineUserIds);
//     }, []);

//     // Fetch friends from the database
//     useEffect(() => {
//         const fetchFriends = async () => {
//             try {
//                 setLoadingFriends(true);
//                 const response = await axios.get('/api/friends');
//                 setFriends(response.data);
//             } catch (error) {
//                 toast.error('Failed to load friends');
//                 console.error('Error fetching friends:', error);
//             } finally {
//                 setLoadingFriends(false);
//             }
//         };

//         fetchFriends();
//     }, [user.id]);

//     // Fetch all users for add friend modal
//     useEffect(() => {
//         const fetchAllUsers = async () => {
//             try {
//                 const response = await axios.get('/api/users');
//                 const filteredUsers = response.data.filter(u => u._id !== user.id);

//                 // Add default properties to each user
//                 const usersWithDefaults = filteredUsers.map(user => ({
//                     ...user,
//                     profilePhoto: user.profilePhoto || '',
//                     email: user.email || '',
//                     phone: user.phone || '',
//                     country: user.country || ''
//                 }));

//                 setAllUsers(usersWithDefaults);
//             } catch (error) {
//                 toast.error('Failed to load users');
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchAllUsers();
//     }, [user.id]);

//     // Fetch friend requests
//     useEffect(() => {
//         const fetchFriendRequests = async () => {
//             try {
//                 const response = await axios.get('/api/friend-requests');
//                 setFriendRequests(response.data);
//             } catch (error) {
//                 toast.error('Failed to load friend requests');
//                 console.error('Error fetching friend requests:', error);
//             }
//         };

//         fetchFriendRequests();
//     }, [user.id]);

//     // Fetch messages when a chat is selected
//     useEffect(() => {
//         const fetchMessages = async () => {
//             if (!activeChat) return;

//             try {
//                 setLoadingMessages(true);
//                 const response = await axios.get(`/api/messages/${activeChat._id}`);
//                 setMessages(prev => ({
//                     ...prev,
//                     [activeChat._id]: response.data
//                 }));
//             } catch (error) {
//                 toast.error('Failed to load messages');
//                 console.error('Error fetching messages:', error);
//             } finally {
//                 setLoadingMessages(false);
//             }
//         };

//         fetchMessages();
//     }, [activeChat]);

//     // Scroll to bottom when messages change
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, activeChat]);


//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     const handleLogout = () => {
//         onLogout();
//         navigate("/");
//     };

//     const filteredFriends = friends.filter(friend =>
//         `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const sendFriendRequest = async (userId) => {
//         try {
//             await axios.post('/api/friend-requests', { recipientId: userId });
//             toast.success('Friend request sent');
//             setAllUsers(prev => prev.map(u =>
//                 u._id === userId ? { ...u, requestSent: true } : u
//             ));
//         } catch (error) {
//             const message = error.response?.data?.message || 'Failed to send request';
//             toast.error(message);
//             console.error('Friend request error:', error.response?.data);
//         }
//     };

//     const acceptFriendRequest = async (requestId) => {
//         try {
//             await axios.put(`/api/friend-requests/${requestId}`, { status: 'accepted' });
//             setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//             toast.success('Friend request accepted');
//         } catch (error) {
//             toast.error('Failed to accept request');
//             console.error('Accept error:', error);
//         }
//     };

//     const rejectFriendRequest = async (requestId) => {
//         try {
//             await axios.put(`/api/friend-requests/${requestId}`, { status: 'rejected' });
//             setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//             toast.info('Friend request rejected');
//         } catch (error) {
//             toast.error('Failed to reject request');
//             console.error('Reject error:', error);
//         }
//     };

//     const handleSendMessage = async () => {
//         if (!message.trim() || !activeChat) return;

//         const receiverId = activeChat._id;

//         const newMessage = {
//             text: message,
//             sender: user.id,
//             receiver: receiverId,
//             createdAt: new Date()
//         };

//         try {
//             setIsSending(true);
//             const response = await axios.post('/api/messages', newMessage);

//             setMessages(prev => ({
//                 ...prev,
//                 [receiverId]: [...(prev[receiverId] || []), response.data]
//             }));

//             setMessage('');
//         } catch (error) {
//             toast.error('Failed to send message');
//             console.error('Error sending message:', error);
//         } finally {
//             setIsSending(false);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     // Format time for messages
//     const formatMessageTime = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     // Check if user is online
//     const isUserOnline = (userId) => {
//         return onlineUsers.has(userId);
//     };

//     // Toggle sidebar on mobile
//     const toggleSidebar = () => {
//         setShowSidebar(!showSidebar);
//     };

//     // View user details
//     const viewUserDetails = (user) => {
//         setSelectedUser(user);
//     };

//     const handleClose = () => {
//         setShowNotifications(false);
//         if (window.innerWidth <= 768) {
//             document.body.style.overflow = 'auto';
//         }
//     };

//     const handleThemeSelection = () => {
//         try {
//             if (activeChat && activeChat._id) {
//                 const themeData = localStorage.getItem('chatThemes');
//                 const themes = themeData ? JSON.parse(themeData) : {};

//                 const newTheme = {
//                     color: selectedColor || null,
//                     wallpaper: selectedWallpaper || null
//                 };

//                 // Save to localStorage
//                 themes[activeChat._id] = newTheme;
//                 localStorage.setItem('chatThemes', JSON.stringify(themes));

//                 // Update state to trigger re-render
//                 setCurrentTheme(newTheme);

//                 toast.success("Theme applied successfully");
//             }
//         } catch (error) {
//             console.error("Error saving theme:", error);
//             toast.error("Failed to apply theme");
//         }
//         setShowThemePopup(false);
//     };

//     // Add at the bottom of the file
//     ChatPage.defaultProps = {
//         setChatTheme: null,
//         blockUser: () => { },
//         clearChatHistory: () => { }
//     };


//   const blockUser = async (userId) => {
//     try {
//       const token = localStorage.getItem("airchat_token");
//       if (!token) {
//         throw new Error("Missing authentication token");
//       }

//       const response = await fetch(`${BACKEND_URL}/api/users/block/${userId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         localStorage.removeItem("airchat_token");
//         throw new Error("Session expired. Please login again");
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Block request failed");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Blocking error:", error);
//       throw error;
//     }
//   };

//   const handleBlockUser = async () => {
//     if (!activeChat?._id) {
//       toast.error("No active chat selected");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("airchat_token");
//       if (!token) {
//         toast.error("Please login first");
//         return;
//       }

//       const result = await blockUser(activeChat._id);

//       const blockedUsers = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
//       if (!blockedUsers.includes(activeChat._id)) {
//         blockedUsers.push(activeChat._id);
//         localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
//       }

//       toast.success(result.message);
//       setShowMenu(false);
//     } catch (err) {
//       // Handle session expiration
//       if (err.message === "Session expired. Please login again") {
//         toast.error("Session expired. Please log in again");
//         onLogout();  // Trigger logout flow
//       } else {
//         toast.error(err.message || "User blocking failed");
//       }
//     }
//   };

//   // ... rest of component ...
// }

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (menuRef.current && !menuRef.current.contains(e.target)) {
//                 setShowMenu(false);
//             }
//             if (themeRef.current && !themeRef.current.contains(e.target)) {
//                 setShowThemePopup(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     return (
//         <div className="airchat-container">
//             {/* Sidebar - Only show on large screens or when toggled on mobile */}
//             {(showSidebar || window.innerWidth > 768) && (
//                 <div className="sidebar">
//                     <div className="sidebar-header">
//                         <div className="app-logo">
//                             <span className="logo-text">AirChat</span>
//                         </div>
//                         <div className="header-actions">
//                             <button
//                                 className="icon-btn notification-btn"
//                                 onClick={() => setShowNotifications(!showNotifications)}
//                                 title="Notifications"
//                             >
//                                 <FaBell />
//                                 {friendRequests.length > 0 && (
//                                     <span className="notification-badge">{friendRequests.length}</span>
//                                 )}
//                             </button>
//                             <button
//                                 className="icon-btn logout-btn"
//                                 onClick={handleLogout}
//                                 title="Logout"
//                             >
//                                 <FaSignOutAlt />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="tabs">
//                         <button
//                             className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('chats')}
//                         >
//                             CHATS
//                         </button>
//                         <button
//                             className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('status')}
//                         >
//                             STATUS
//                         </button>
//                     </div>

//                     <div className="chats-list">
//                         {loadingFriends ? (
//                             <div className="text-center py-4">
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                             </div>
//                         ) : filteredFriends.length === 0 ? (
//                             <div className="text-center py-4">
//                                 <p>No friends found</p>
//                             </div>
//                         ) : (
//                             filteredFriends.map(friend => {
//                                 const lastMessage = messages[friend._id]?.[messages[friend._id]?.length - 1];
//                                 const isOnline = isUserOnline(friend._id);

//                                 return (
//                                     <div
//                                         key={friend._id}
//                                         className={`chat-item ${activeChat?._id === friend._id ? 'active' : ''}`}
//                                         onClick={() => {
//                                             // Find full user details from allUsers
//                                             const fullUser = allUsers.find(u => u._id === friend._id) || friend;
//                                             setActiveChat({
//                                                 ...fullUser,
//                                                 phone: fullUser.phone || '',
//                                                 email: fullUser.email || '',
//                                                 country: fullUser.country || '',
//                                                 profilePhoto: fullUser.profilePhoto || ''
//                                             });
//                                             if (window.innerWidth <= 768) setShowSidebar(false);
//                                         }}
//                                     >
//                                         <div className="avatar">
//                                             {friend.profilePhoto ? (
//                                                 <img src={friend.profilePhoto} alt={`${friend.firstName} ${friend.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">
//                                                     {friend.firstName.charAt(0)}
//                                                 </div>
//                                             )}
//                                             {isOnline && <span className="online-badge"></span>}
//                                         </div>
//                                         <div className="chat-info">
//                                             <div className="chat-header">
//                                                 <div className="user-name">{friend.firstName} {friend.lastName}</div>
//                                                 <div className="last-seen">
//                                                     {isOnline ? (
//                                                         <span className="online-text">Online</span>
//                                                     ) : (
//                                                         <span>Offline</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div className="last-message-container">
//                                                 {lastMessage ? (
//                                                     <>
//                                                         <div className="last-message-text">
//                                                             {lastMessage.text}
//                                                         </div>
//                                                         <div className="last-message-time">
//                                                             {formatMessageTime(lastMessage.createdAt)}
//                                                         </div>
//                                                     </>
//                                                 ) : (
//                                                     <div className="no-messages-text">No messages yet</div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>

//                     {/* Friend Options Toggle */}
//                     <div className="friend-options-toggle">
//                         <button
//                             className="toggle-btn"
//                             onClick={() => setShowFriendOptions(!showFriendOptions)}
//                         >
//                             <IoIosAdd />
//                         </button>

//                         {showFriendOptions && (
//                             <div className="friend-options">
//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => {
//                                         setShowAddFriendModal(true);
//                                         setShowFriendOptions(false);
//                                     }}
//                                 >
//                                     <FaUserPlus /> Add Friend
//                                 </button>
//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => setShowFriendOptions(false)}
//                                 >
//                                     <MdArrowBack /> Back
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Main Chat Area */}
//             <div className={`main-chat-area ${!showSidebar && window.innerWidth <= 768 ? 'expanded' : ''}`}>
//                 {activeChat ? (
//                     <>
//                         <div className="chat-header">
//                             {/* Left section - Back button & Profile */}
//                             <div className="header-left">
//                                 {window.innerWidth <= 768 && (
//                                     <button
//                                         className="back-btn"
//                                         onClick={() => {
//                                             setShowSidebar(true);
//                                             setActiveChat(null);
//                                         }}
//                                     >
//                                         <MdArrowBack />
//                                     </button>
//                                 )}

//                                 <div className="chat-partner">
//                                     <div className="avatar">
//                                         {activeChat.profilePhoto ? (
//                                             <img
//                                                 src={activeChat.profilePhoto}
//                                                 alt={`${activeChat.firstName} ${activeChat.lastName}`}
//                                             />
//                                         ) : (
//                                             <div className="avatar-placeholder">
//                                                 {activeChat.firstName?.charAt(0)}
//                                             </div>
//                                         )}
//                                         {isUserOnline(activeChat._id) && <span className="online-badge"></span>}
//                                     </div>
//                                     <div className="partner-info">
//                                         <div className="partner-name">
//                                             {activeChat.firstName} {activeChat.lastName}
//                                         </div>
//                                         <div className="partner-status">
//                                             {isUserOnline(activeChat._id) ? (
//                                                 <span className="online-text">Online</span>
//                                             ) : (
//                                                 <span>Offline</span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Right section - Actions */}
//                             <div className="header-actions">
//                                 <div className="menu-container" ref={menuRef}>
//                                     <button
//                                         className="icon-btn"
//                                         onClick={() => setShowMenu(!showMenu)}
//                                     >
//                                         <FaEllipsisV />
//                                     </button>

//                                     {showMenu && (
//                                         <div className="menu-popup">
//                                             <button onClick={() => {
//                                                 setShowContactPopup(true);
//                                                 setShowMenu(false);
//                                             }}>
//                                                 View Contact
//                                             </button>
//                                             <button onClick={() => {
//                                                 setShowThemePopup(true);
//                                                 setShowMenu(false);
//                                             }}>
//                                                 Chat Theme
//                                             </button>
//                                             <button onClick={handleBlockUser}>
//                                                 Block User
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Contact Popup */}
//                             {showContactPopup && activeChat && (
//                                 <div className="contact-popup">
//                                     <div className="popup-content">
//                                         <button
//                                             className="close-popup"
//                                             onClick={() => setShowContactPopup(false)}
//                                         >
//                                             <MdClose />
//                                         </button>

//                                         <div className="contact-header">
//                                             <div className="contact-avatar">
//                                                 {activeChat.profilePhoto ? (
//                                                     <img
//                                                         src={activeChat.profilePhoto}
//                                                         alt={`${activeChat.firstName} ${activeChat.lastName}`}
//                                                     />
//                                                 ) : (
//                                                     <div className="avatar-placeholder large">
//                                                         {activeChat.firstName?.charAt(0)}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <h3>{activeChat.firstName} {activeChat.lastName}</h3>
//                                         </div>

//                                         <div className="contact-details">
//                                             <div className="detail-item">
//                                                 <label>Email:</label>
//                                                 <span>{activeChat.email || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Phone:</label>
//                                                 <span>{activeChat.phoneNumber || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Country:</label>
//                                                 <span>{activeChat.country || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Status:</label>
//                                                 <span>
//                                                     {isUserOnline(activeChat._id)
//                                                         ? 'Online'
//                                                         : 'Offline'}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Theme Popup */}
//                             {showThemePopup && (
//                                 <div className="theme-popup" ref={themeRef}>
//                                     <div className="popup-content">
//                                         <button
//                                             className="close-popup"
//                                             onClick={() => setShowThemePopup(false)}
//                                         >
//                                             <MdClose />
//                                         </button>

//                                         <h3>Chat Theme</h3>

//                                         <div className="theme-tabs">
//                                             <button
//                                                 className={themeMode === 'color' ? 'active' : ''}
//                                                 onClick={() => setThemeMode('color')}
//                                             >
//                                                 Color Theme
//                                             </button>
//                                             <button
//                                                 className={themeMode === 'wallpaper' ? 'active' : ''}
//                                                 onClick={() => setThemeMode('wallpaper')}
//                                             >
//                                                 Wallpaper
//                                             </button>
//                                         </div>

//                                         <div className="theme-content">
//                                             {themeMode === 'color' ? (
//                                                 <div className="color-themes">
//                                                     <h4>Select a color theme:</h4>
//                                                     <div className="color-grid">
//                                                         {['#f0f8ff', '#fff0f5', '#f5f5dc', '#e6e6fa', '#f0fff0', '#fffacd'].map(color => (
//                                                             <div
//                                                                 key={color}
//                                                                 className={`color-option ${selectedColor === color ? 'selected' : ''}`}
//                                                                 style={{ backgroundColor: color }}
//                                                                 onClick={() => setSelectedColor(color)}
//                                                             />
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="wallpaper-themes">
//                                                     <h4>Select a wallpaper:</h4>
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         onChange={(e) => {
//                                                             if (e.target.files[0]) {
//                                                                 const reader = new FileReader();
//                                                                 reader.onload = (event) => {
//                                                                     setSelectedWallpaper(event.target.result);
//                                                                 };
//                                                                 reader.readAsDataURL(e.target.files[0]);
//                                                             }
//                                                         }}
//                                                     />
//                                                     {selectedWallpaper && (
//                                                         <div className="wallpaper-preview">
//                                                             <img src={selectedWallpaper} alt="Wallpaper preview" />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className="theme-actions">
//                                             <button
//                                                 className="cancel-btn"
//                                                 onClick={() => setShowThemePopup(false)}
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 className="confirm-btn"
//                                                 onClick={handleThemeSelection}
//                                                 disabled={!selectedColor && !selectedWallpaper}
//                                             >
//                                                 Apply Theme
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="chat-messages"
//                             style={{
//                                 backgroundColor: currentTheme.color || '#d9fdd3',
//                                 backgroundImage: currentTheme.wallpaper
//                                     ? `url(${currentTheme.wallpaper})`
//                                     : 'none',
//                                 backgroundSize: 'cover',
//                                 backgroundPosition: 'center'
//                             }}>
//                             {loadingMessages ? (
//                                 <div className="text-center py-4">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading messages...</span>
//                                     </div>
//                                 </div>
//                             ) : messages[activeChat._id]?.length === 0 ? (
//                                 <div className="no-messages">
//                                     <p>No messages yet. Start the conversation!</p>
//                                 </div>
//                             ) : (
//                                 messages[activeChat._id]?.map((msg) => (
//                                     <div
//                                         key={msg._id}
//                                         className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
//                                     >
//                                         <div className="message-content">
//                                             {msg.text}
//                                         </div>
//                                         <div className="message-meta">
//                                             <div className="message-time">
//                                                 {formatMessageTime(msg.createdAt)}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         <div className="message-input-area">
//                             <button className="icon-btn">
//                                 <FaSmile />
//                             </button>
//                             <button className="icon-btn">
//                                 <FaPaperclip />
//                             </button>
//                             <div className="message-input-container">
//                                 <textarea
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     onKeyDown={handleKeyPress}
//                                     placeholder="Type a message"
//                                     rows={1}
//                                 />
//                             </div>
//                             {message ? (
//                                 <button
//                                     className="send-btn"
//                                     onClick={handleSendMessage}
//                                     disabled={isSending}
//                                 >
//                                     {isSending ? (
//                                         <div className="sending-spinner"></div>
//                                     ) : (
//                                         <IoIosSend />
//                                     )}
//                                 </button>
//                             ) : (
//                                 <button className="icon-btn">
//                                     <FaMicrophone />
//                                 </button>
//                             )}
//                         </div>
//                     </>
//                 ) : (
//                     <div className="no-chat-selected">
//                         <div className="welcome-container">
//                             <div className="logo-large">
//                                 <span className="logo-text">AirChat</span>
//                             </div>
//                             <h2>Welcome, {user.name}</h2>
//                             <p>Select a chat to start messaging</p>
//                             <p>Or start a new conversation</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Add Friend Modal */}
//             {showAddFriendModal && (
//                 <div className="modal-overlay">
//                     <div className="add-friend-modal">
//                         <div className="modal-header">
//                             <h3>Add Friends</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setShowAddFriendModal(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             {allUsers
//                                 .filter(u =>
//                                     !friends.some(f => f._id === u._id) &&
//                                     !friendRequests.some(r => r.senderId === u._id)
//                                 )
//                                 .map(user => (
//                                     <div key={user._id} className="user-item">
//                                         <div className="user-avatar">
//                                             {user.profilePhoto ? (
//                                                 <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">
//                                                     {user.firstName.charAt(0)}
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="user-info">
//                                             <div className="user-name">{user.firstName} {user.lastName}</div>
//                                             <div className="user-country">{user.country || 'Unknown'}</div>
//                                         </div>
//                                         <div className="user-actions">
//                                             <button
//                                                 className="view-btn"
//                                                 onClick={() => viewUserDetails(user)}
//                                             >
//                                                 View
//                                             </button>
//                                             <button
//                                                 className={`add-btn ${user.requestSent ? 'sent' : ''}`}
//                                                 onClick={() => sendFriendRequest(user._id)}
//                                                 disabled={user.requestSent}
//                                             >
//                                                 {user.requestSent ? 'Request Sent' : 'Add'}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* User Detail Modal */}
//             {selectedUser && (
//                 <div className="modal-overlay">
//                     <div className="user-detail-modal">
//                         <div className="modal-header">
//                             <h3>User Details</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setSelectedUser(null)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             <div className="user-avatar-large">
//                                 {selectedUser.profilePhoto ? (
//                                     <img src={selectedUser.profilePhoto} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
//                                 ) : (
//                                     <div className="avatar-placeholder large">
//                                         {selectedUser.firstName.charAt(0)}
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="user-details">
//                                 <div className="detail-item">
//                                     <span className="detail-label">First Name:</span>
//                                     <span className="detail-value">{selectedUser.firstName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Last Name:</span>
//                                     <span className="detail-value">{selectedUser.lastName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Country:</span>
//                                     <span className="detail-value">{selectedUser.country || 'Unknown'}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Email:</span>
//                                     <span className="detail-value">{selectedUser.email}</span>
//                                 </div>
//                             </div>

//                             <div className="modal-actions">
//                                 <button
//                                     className="close-detail-btn"
//                                     onClick={() => setSelectedUser(null)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Notifications Panel */}
//             <div
//                 className={`notifications-backdrop ${showNotifications ? 'active' : ''}`}
//                 onClick={() => setShowNotifications(false)}
//             />

//             <div className={`notifications-panel ${showNotifications ? 'active' : ''}`}>
//                 <div className="panel-header">
//                     <h3>Friend Requests</h3>
//                     <button
//                         className="close-btn"
//                         onClick={handleClose}
//                     >
//                         <FaTimes />
//                     </button>
//                 </div>

//                 <div className="panel-content">
//                     {friendRequests.length === 0 ? (
//                         <div className="no-requests">
//                             <p>No pending friend requests</p>
//                         </div>
//                     ) : (
//                         friendRequests.map(request => (
//                             <div key={request._id} className="request-item">
//                                 <div className="request-main">
//                                     <div className="request-avatar">
//                                         {request.requester?.profilePhoto ? (
//                                             <img
//                                                 src={request.requester.profilePhoto}
//                                                 alt={`${request.requester.firstName} ${request.requester.lastName}`}
//                                             />
//                                         ) : (
//                                             <div className="avatar-placeholder">
//                                                 {request.requester?.firstName?.charAt(0)}
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="request-details">
//                                         <div className="request-name">
//                                             {request.requester?.firstName} {request.requester?.lastName}
//                                         </div>
//                                         <div className="request-message">
//                                             Wants to be your friend
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="request-actions">
//                                     <button
//                                         className="accept-btn"
//                                         onClick={() => acceptFriendRequest(request._id)}
//                                     >
//                                         Accept
//                                     </button>
//                                     <button
//                                         className="reject-btn"
//                                         onClick={() => rejectFriendRequest(request._id)}
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };


// ChatPage.defaultProps = {
//     setChatTheme: () => {},
//     blockUser: () => console.warn("blockUser function not provided"),
//     clearChatHistory: () => console.warn("clearChatHistory function not provided")
// };

// export default ChatPage;



// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
//     FaSignOutAlt, FaCheck, FaClock, FaTimes, FaArrowUp, FaArrowDown,
//     FaPalette, FaImage, FaBan, FaTrash, FaUserPlus, FaBell, FaUserFriends
// } from 'react-icons/fa';
// import { IoIosSend, IoIosAdd } from 'react-icons/io';
// import { MdArrowBack, MdSearch, MdClose } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import './ChatPage.css';

// const ChatPage = ({ user, token , onLogout }) => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('chats');
//     const [friends, setFriends] = useState([]);
//     const [allUsers, setAllUsers] = useState([]);
//     const [activeChat, setActiveChat] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState({});
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loadingFriends, setLoadingFriends] = useState(true);
//     const [loadingMessages, setLoadingMessages] = useState(false);
//     const [isSending, setIsSending] = useState(false);
//     const [onlineUsers, setOnlineUsers] = useState(new Set());
//     const messagesEndRef = useRef(null);
//     const [showAddFriendModal, setShowAddFriendModal] = useState(false);
//     const [friendRequests, setFriendRequests] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showSidebar, setShowSidebar] = useState(true);
//     const [showFriendOptions, setShowFriendOptions] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
//     const [showSearch, setShowSearch] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showMenu, setShowMenu] = useState(false);
//     const [showContactPopup, setShowContactPopup] = useState(false);
//     const [showThemePopup, setShowThemePopup] = useState(false);
//     const [themeMode, setThemeMode] = useState('default');
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [selectedWallpaper, setSelectedWallpaper] = useState(null);
//     const menuRef = useRef(null);
//     const themeRef = useRef(null);

//     const BACKEND_URL = "http://localhost:5000";

//     const [currentTheme, setCurrentTheme] = useState({});

//     useEffect(() => {
//         if (activeChat?._id) {
//             const themeData = localStorage.getItem('chatThemes');
//             const themes = themeData ? JSON.parse(themeData) : {};
//             setCurrentTheme(themes[activeChat._id] || {});
//         } else {
//             setCurrentTheme({});
//         }
//     }, [activeChat]);

//     // Handle mobile animations
//     useEffect(() => {
//         if (showNotifications) {
//             setTimeout(() => setIsMobilePanelOpen(true), 10);
//         } else {
//             setIsMobilePanelOpen(false);
//         }
//     }, [showNotifications]);

//     useEffect(() => {
//         if (showNotifications && window.innerWidth <= 768) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'auto';
//         }

//         return () => {
//             document.body.style.overflow = 'auto';
//         };
//     }, [showNotifications]);

//     // Simulate online status
//     useEffect(() => {
//         const onlineUserIds = new Set(['1', '3', '8']);
//         setOnlineUsers(onlineUserIds);
//     }, []);

//     // Fetch friends from the database
//     useEffect(() => {
//   const fetchFriends = async () => {
//     try {
//       setLoadingFriends(true);
//       const response = await axios.get('/api/friends', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setFriends(response.data);
//     } catch (error) {
//       toast.error('Failed to load friends');
//       console.error('Error fetching friends:', error);
//     } finally {
//       setLoadingFriends(false);
//     }
//   };

//         fetchFriends();
//     }, [user.id]);

//     // Fetch all users for add friend modal
//     useEffect(() => {
//         const fetchAllUsers = async () => {
//             try {
//                 const response = await axios.get('/api/users');
//                 const filteredUsers = response.data.filter(u => u._id !== user.id);

//                 // Add default properties to each user
//                 const usersWithDefaults = filteredUsers.map(user => ({
//                     ...user,
//                     profilePhoto: user.profilePhoto || '',
//                     email: user.email || '',
//                     phone: user.phone || '',
//                     country: user.country || ''
//                 }));

//                 setAllUsers(usersWithDefaults);
//             } catch (error) {
//                 toast.error('Failed to load users');
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchAllUsers();
//     }, [user.id]);

//     // Fetch friend requests
//     useEffect(() => {
//         const fetchFriendRequests = async () => {
//             try {
//                 const response = await axios.get('/api/friend-requests');
//                 setFriendRequests(response.data);
//             } catch (error) {
//                 toast.error('Failed to load friend requests');
//                 console.error('Error fetching friend requests:', error);
//             }
//         };

//         fetchFriendRequests();
//     }, [user.id]);

//     // Fetch messages when a chat is selected
//     useEffect(() => {
//         const fetchMessages = async () => {
//             if (!activeChat) return;

//             try {
//                 setLoadingMessages(true);
//                 const response = await axios.get(`/api/messages/${activeChat._id}`);
//                 setMessages(prev => ({
//                     ...prev,
//                     [activeChat._id]: response.data
//                 }));
//             } catch (error) {
//                 toast.error('Failed to load messages');
//                 console.error('Error fetching messages:', error);
//             } finally {
//                 setLoadingMessages(false);
//             }
//         };

//         fetchMessages();
//     }, [activeChat]);

//     // Scroll to bottom when messages change
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, activeChat]);


//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     const handleLogout = () => {
//         onLogout();
//         navigate("/");
//     };

//     const filteredFriends = friends.filter(friend =>
//         `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const sendFriendRequest = async (userId) => {
//         try {
//             await axios.post('/api/friend-requests', { recipientId: userId });
//             toast.success('Friend request sent');
//             setAllUsers(prev => prev.map(u =>
//                 u._id === userId ? { ...u, requestSent: true } : u
//             ));
//         } catch (error) {
//             const message = error.response?.data?.message || 'Failed to send request';
//             toast.error(message);
//             console.error('Friend request error:', error.response?.data);
//         }
//     };

//     const acceptFriendRequest = async (requestId) => {
//         try {
//             await axios.put(`/api/friend-requests/${requestId}`, { status: 'accepted' });
//             setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//             toast.success('Friend request accepted');
//         } catch (error) {
//             toast.error('Failed to accept request');
//             console.error('Accept error:', error);
//         }
//     };

//     const rejectFriendRequest = async (requestId) => {
//         try {
//             await axios.put(`/api/friend-requests/${requestId}`, { status: 'rejected' });
//             setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//             toast.info('Friend request rejected');
//         } catch (error) {
//             toast.error('Failed to reject request');
//             console.error('Reject error:', error);
//         }
//     };

//     const handleSendMessage = async () => {
//         if (!message.trim() || !activeChat) return;

//         const receiverId = activeChat._id;

//         const newMessage = {
//             text: message,
//             sender: user.id,
//             receiver: receiverId,
//             createdAt: new Date()
//         };

//         try {
//             setIsSending(true);
//             const response = await axios.post('/api/messages', newMessage);

//             setMessages(prev => ({
//                 ...prev,
//                 [receiverId]: [...(prev[receiverId] || []), response.data]
//             }));

//             setMessage('');
//         } catch (error) {
//             toast.error('Failed to send message');
//             console.error('Error sending message:', error);
//         } finally {
//             setIsSending(false);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     // Format time for messages
//     const formatMessageTime = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     // Check if user is online
//     const isUserOnline = (userId) => {
//         return onlineUsers.has(userId);
//     };

//     // Toggle sidebar on mobile
//     const toggleSidebar = () => {
//         setShowSidebar(!showSidebar);
//     };

//     // View user details
//     const viewUserDetails = (user) => {
//         setSelectedUser(user);
//     };

//     const handleClose = () => {
//         setShowNotifications(false);
//         if (window.innerWidth <= 768) {
//             document.body.style.overflow = 'auto';
//         }
//     };

//     const handleThemeSelection = () => {
//         try {
//             if (activeChat && activeChat._id) {
//                 const themeData = localStorage.getItem('chatThemes');
//                 const themes = themeData ? JSON.parse(themeData) : {};

//                 const newTheme = {
//                     color: selectedColor || null,
//                     wallpaper: selectedWallpaper || null
//                 };

//                 // Save to localStorage
//                 themes[activeChat._id] = newTheme;
//                 localStorage.setItem('chatThemes', JSON.stringify(themes));

//                 // Update state to trigger re-render
//                 setCurrentTheme(newTheme);

//                 toast.success("Theme applied successfully");
//             }
//         } catch (error) {
//             console.error("Error saving theme:", error);
//             toast.error("Failed to apply theme");
//         }
//         setShowThemePopup(false);
//     };

//     const blockUser = async (userId) => {
//         try {
//             const token = localStorage.getItem("airchat_token");
//             if (!token) {
//                 throw new Error("Missing authentication token");
//             }

//             const response = await fetch(`${BACKEND_URL}/api/users/block/${userId}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem("airchat_token");
//                 throw new Error("Session expired. Please login again");
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Block request failed");
//             }

//             return await response.json();
//         } catch (error) {
//             console.error("Blocking error:", error);
//             throw error;
//         }
//     };

//     const handleBlockUser = async () => {
//         if (!activeChat?._id) {
//             toast.error("No active chat selected");
//             return;
//         }

//         try {
//             const token = localStorage.getItem("airchat_token");
//             if (!token) {
//                 toast.error("Please login first");
//                 return;
//             }

//             const result = await blockUser(activeChat._id);

//             const blockedUsers = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
//             if (!blockedUsers.includes(activeChat._id)) {
//                 blockedUsers.push(activeChat._id);
//                 localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
//             }

//             toast.success(result.message);
//             setShowMenu(false);
//         } catch (err) {
//             // Handle session expiration
//             if (err.message === "Session expired. Please login again") {
//                 toast.error("Session expired. Please log in again");
//                 onLogout();  // Trigger logout flow
//             } else {
//                 toast.error(err.message || "User blocking failed");
//             }
//         }
//     };

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (menuRef.current && !menuRef.current.contains(e.target)) {
//                 setShowMenu(false);
//             }
//             if (themeRef.current && !themeRef.current.contains(e.target)) {
//                 setShowThemePopup(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     return (
//         <div className="airchat-container">
//             {/* Sidebar - Only show on large screens or when toggled on mobile */}
//             {(showSidebar || window.innerWidth > 768) && (
//                 <div className="sidebar">
//                     <div className="sidebar-header">
//                         <div className="app-logo">
//                             <span className="logo-text">AirChat</span>
//                         </div>
//                         <div className="header-actions">
//                             <button
//                                 className="icon-btn notification-btn"
//                                 onClick={() => setShowNotifications(!showNotifications)}
//                                 title="Notifications"
//                             >
//                                 <FaBell />
//                                 {friendRequests.length > 0 && (
//                                     <span className="notification-badge">{friendRequests.length}</span>
//                                 )}
//                             </button>
//                             <button
//                                 className="icon-btn logout-btn"
//                                 onClick={handleLogout}
//                                 title="Logout"
//                             >
//                                 <FaSignOutAlt />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="tabs">
//                         <button
//                             className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('chats')}
//                         >
//                             CHATS
//                         </button>
//                         <button
//                             className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('status')}
//                         >
//                             STATUS
//                         </button>
//                     </div>

//                     <div className="chats-list">
//                         {loadingFriends ? (
//                             <div className="text-center py-4">
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                             </div>
//                         ) : filteredFriends.length === 0 ? (
//                             <div className="text-center py-4">
//                                 <p>No friends found</p>
//                             </div>
//                         ) : (
//                             filteredFriends.map(friend => {
//                                 const lastMessage = messages[friend._id]?.[messages[friend._id]?.length - 1];
//                                 const isOnline = isUserOnline(friend._id);

//                                 return (
//                                     <div
//                                         key={friend._id}
//                                         className={`chat-item ${activeChat?._id === friend._id ? 'active' : ''}`}
//                                         onClick={() => {
//                                             // Find full user details from allUsers
//                                             const fullUser = allUsers.find(u => u._id === friend._id) || friend;
//                                             setActiveChat({
//                                                 ...fullUser,
//                                                 phone: fullUser.phone || '',
//                                                 email: fullUser.email || '',
//                                                 country: fullUser.country || '',
//                                                 profilePhoto: fullUser.profilePhoto || ''
//                                             });
//                                             if (window.innerWidth <= 768) setShowSidebar(false);
//                                         }}
//                                     >
//                                         <div className="avatar">
//                                             {friend.profilePhoto ? (
//                                                 <img src={friend.profilePhoto} alt={`${friend.firstName} ${friend.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">
//                                                     {friend.firstName.charAt(0)}
//                                                 </div>
//                                             )}
//                                             {isOnline && <span className="online-badge"></span>}
//                                         </div>
//                                         <div className="chat-info">
//                                             <div className="chat-header">
//                                                 <div className="user-name">{friend.firstName} {friend.lastName}</div>
//                                                 <div className="last-seen">
//                                                     {isOnline ? (
//                                                         <span className="online-text">Online</span>
//                                                     ) : (
//                                                         <span>Offline</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div className="last-message-container">
//                                                 {lastMessage ? (
//                                                     <>
//                                                         <div className="last-message-text">
//                                                             {lastMessage.text}
//                                                         </div>
//                                                         <div className="last-message-time">
//                                                             {formatMessageTime(lastMessage.createdAt)}
//                                                         </div>
//                                                     </>
//                                                 ) : (
//                                                     <div className="no-messages-text">No messages yet</div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>

//                     {/* Friend Options Toggle */}
//                     <div className="friend-options-toggle">
//                         <button
//                             className="toggle-btn"
//                             onClick={() => setShowFriendOptions(!showFriendOptions)}
//                         >
//                             <IoIosAdd />
//                         </button>

//                         {showFriendOptions && (
//                             <div className="friend-options">
//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => {
//                                         setShowAddFriendModal(true);
//                                         setShowFriendOptions(false);
//                                     }}
//                                 >
//                                     <FaUserPlus /> Add Friend
//                                 </button>
//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => setShowFriendOptions(false)}
//                                 >
//                                     <MdArrowBack /> Back
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Main Chat Area */}
//             <div className={`main-chat-area ${!showSidebar && window.innerWidth <= 768 ? 'expanded' : ''}`}>
//                 {activeChat ? (
//                     <>
//                         <div className="chat-header">
//                             {/* Left section - Back button & Profile */}
//                             <div className="header-left">
//                                 {window.innerWidth <= 768 && (
//                                     <button
//                                         className="back-btn"
//                                         onClick={() => {
//                                             setShowSidebar(true);
//                                             setActiveChat(null);
//                                         }}
//                                     >
//                                         <MdArrowBack />
//                                     </button>
//                                 )}

//                                 <div className="chat-partner">
//                                     <div className="avatar">
//                                         {activeChat.profilePhoto ? (
//                                             <img
//                                                 src={activeChat.profilePhoto}
//                                                 alt={`${activeChat.firstName} ${activeChat.lastName}`}
//                                             />
//                                         ) : (
//                                             <div className="avatar-placeholder">
//                                                 {activeChat.firstName?.charAt(0)}
//                                             </div>
//                                         )}
//                                         {isUserOnline(activeChat._id) && <span className="online-badge"></span>}
//                                     </div>
//                                     <div className="partner-info">
//                                         <div className="partner-name">
//                                             {activeChat.firstName} {activeChat.lastName}
//                                         </div>
//                                         <div className="partner-status">
//                                             {isUserOnline(activeChat._id) ? (
//                                                 <span className="online-text">Online</span>
//                                             ) : (
//                                                 <span>Offline</span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Right section - Actions */}
//                             <div className="header-actions">
//                                 <div className="menu-container" ref={menuRef}>
//                                     <button
//                                         className="icon-btn"
//                                         onClick={() => setShowMenu(!showMenu)}
//                                     >
//                                         <FaEllipsisV />
//                                     </button>

//                                     {showMenu && (
//                                         <div className="menu-popup">
//                                             <button onClick={() => {
//                                                 setShowContactPopup(true);
//                                                 setShowMenu(false);
//                                             }}>
//                                                 View Contact
//                                             </button>
//                                             <button onClick={() => {
//                                                 setShowThemePopup(true);
//                                                 setShowMenu(false);
//                                             }}>
//                                                 Chat Theme
//                                             </button>
//                                             <button onClick={handleBlockUser}>
//                                                 Block User
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Contact Popup */}
//                             {showContactPopup && activeChat && (
//                                 <div className="contact-popup">
//                                     <div className="popup-content">
//                                         <button
//                                             className="close-popup"
//                                             onClick={() => setShowContactPopup(false)}
//                                         >
//                                             <MdClose />
//                                         </button>

//                                         <div className="contact-header">
//                                             <div className="contact-avatar">
//                                                 {activeChat.profilePhoto ? (
//                                                     <img
//                                                         src={activeChat.profilePhoto}
//                                                         alt={`${activeChat.firstName} ${activeChat.lastName}`}
//                                                     />
//                                                 ) : (
//                                                     <div className="avatar-placeholder large">
//                                                         {activeChat.firstName?.charAt(0)}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <h3>{activeChat.firstName} {activeChat.lastName}</h3>
//                                         </div>

//                                         <div className="contact-details">
//                                             <div className="detail-item">
//                                                 <label>Email:</label>
//                                                 <span>{activeChat.email || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Phone:</label>
//                                                 <span>{activeChat.phoneNumber || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Country:</label>
//                                                 <span>{activeChat.country || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Status:</label>
//                                                 <span>
//                                                     {isUserOnline(activeChat._id)
//                                                         ? 'Online'
//                                                         : 'Offline'}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Theme Popup */}
//                             {showThemePopup && (
//                                 <div className="theme-popup" ref={themeRef}>
//                                     <div className="popup-content">
//                                         <button
//                                             className="close-popup"
//                                             onClick={() => setShowThemePopup(false)}
//                                         >
//                                             <MdClose />
//                                         </button>

//                                         <h3>Chat Theme</h3>

//                                         <div className="theme-tabs">
//                                             <button
//                                                 className={themeMode === 'color' ? 'active' : ''}
//                                                 onClick={() => setThemeMode('color')}
//                                             >
//                                                 Color Theme
//                                             </button>
//                                             <button
//                                                 className={themeMode === 'wallpaper' ? 'active' : ''}
//                                                 onClick={() => setThemeMode('wallpaper')}
//                                             >
//                                                 Wallpaper
//                                             </button>
//                                         </div>

//                                         <div className="theme-content">
//                                             {themeMode === 'color' ? (
//                                                 <div className="color-themes">
//                                                     <h4>Select a color theme:</h4>
//                                                     <div className="color-grid">
//                                                         {['#f0f8ff', '#fff0f5', '#f5f5dc', '#e6e6fa', '#f0fff0', '#fffacd'].map(color => (
//                                                             <div
//                                                                 key={color}
//                                                                 className={`color-option ${selectedColor === color ? 'selected' : ''}`}
//                                                                 style={{ backgroundColor: color }}
//                                                                 onClick={() => setSelectedColor(color)}
//                                                             />
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="wallpaper-themes">
//                                                     <h4>Select a wallpaper:</h4>
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         onChange={(e) => {
//                                                             if (e.target.files[0]) {
//                                                                 const reader = new FileReader();
//                                                                 reader.onload = (event) => {
//                                                                     setSelectedWallpaper(event.target.result);
//                                                                 };
//                                                                 reader.readAsDataURL(e.target.files[0]);
//                                                             }
//                                                         }}
//                                                     />
//                                                     {selectedWallpaper && (
//                                                         <div className="wallpaper-preview">
//                                                             <img src={selectedWallpaper} alt="Wallpaper preview" />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className="theme-actions">
//                                             <button
//                                                 className="cancel-btn"
//                                                 onClick={() => setShowThemePopup(false)}
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 className="confirm-btn"
//                                                 onClick={handleThemeSelection}
//                                                 disabled={!selectedColor && !selectedWallpaper}
//                                             >
//                                                 Apply Theme
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="chat-messages"
//                             style={{
//                                 backgroundColor: currentTheme.color || '#d9fdd3',
//                                 backgroundImage: currentTheme.wallpaper
//                                     ? `url(${currentTheme.wallpaper})`
//                                     : 'none',
//                                 backgroundSize: 'cover',
//                                 backgroundPosition: 'center'
//                             }}>
//                             {loadingMessages ? (
//                                 <div className="text-center py-4">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading messages...</span>
//                                     </div>
//                                 </div>
//                             ) : messages[activeChat._id]?.length === 0 ? (
//                                 <div className="no-messages">
//                                     <p>No messages yet. Start the conversation!</p>
//                                 </div>
//                             ) : (
//                                 messages[activeChat._id]?.map((msg) => (
//                                     <div
//                                         key={msg._id}
//                                         className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
//                                     >
//                                         <div className="message-content">
//                                             {msg.text}
//                                         </div>
//                                         <div className="message-meta">
//                                             <div className="message-time">
//                                                 {formatMessageTime(msg.createdAt)}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         <div className="message-input-area">
//                             <button className="icon-btn">
//                                 <FaSmile />
//                             </button>
//                             <button className="icon-btn">
//                                 <FaPaperclip />
//                             </button>
//                             <div className="message-input-container">
//                                 <textarea
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     onKeyDown={handleKeyPress}
//                                     placeholder="Type a message"
//                                     rows={1}
//                                 />
//                             </div>
//                             {message ? (
//                                 <button
//                                     className="send-btn"
//                                     onClick={handleSendMessage}
//                                     disabled={isSending}
//                                 >
//                                     {isSending ? (
//                                         <div className="sending-spinner"></div>
//                                     ) : (
//                                         <IoIosSend />
//                                     )}
//                                 </button>
//                             ) : (
//                                 <button className="icon-btn">
//                                     <FaMicrophone />
//                                 </button>
//                             )}
//                         </div>
//                     </>
//                 ) : (
//                     <div className="no-chat-selected">
//                         <div className="welcome-container">
//                             <div className="logo-large">
//                                 <span className="logo-text">AirChat</span>
//                             </div>
//                             <h2>Welcome, {user.name}</h2>
//                             <p>Select a chat to start messaging</p>
//                             <p>Or start a new conversation</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Add Friend Modal */}
//             {showAddFriendModal && (
//                 <div className="modal-overlay">
//                     <div className="add-friend-modal">
//                         <div className="modal-header">
//                             <h3>Add Friends</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setShowAddFriendModal(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             {allUsers
//                                 .filter(u =>
//                                     !friends.some(f => f._id === u._id) &&
//                                     !friendRequests.some(r => r.senderId === u._id)
//                                 )
//                                 .map(user => (
//                                     <div key={user._id} className="user-item">
//                                         <div className="user-avatar">
//                                             {user.profilePhoto ? (
//                                                 <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">
//                                                     {user.firstName.charAt(0)}
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="user-info">
//                                             <div className="user-name">{user.firstName} {user.lastName}</div>
//                                             <div className="user-country">{user.country || 'Unknown'}</div>
//                                         </div>
//                                         <div className="user-actions">
//                                             <button
//                                                 className="view-btn"
//                                                 onClick={() => viewUserDetails(user)}
//                                             >
//                                                 View
//                                             </button>
//                                             <button
//                                                 className={`add-btn ${user.requestSent ? 'sent' : ''}`}
//                                                 onClick={() => sendFriendRequest(user._id)}
//                                                 disabled={user.requestSent}
//                                             >
//                                                 {user.requestSent ? 'Request Sent' : 'Add'}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* User Detail Modal */}
//             {selectedUser && (
//                 <div className="modal-overlay">
//                     <div className="user-detail-modal">
//                         <div className="modal-header">
//                             <h3>User Details</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setSelectedUser(null)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             <div className="user-avatar-large">
//                                 {selectedUser.profilePhoto ? (
//                                     <img src={selectedUser.profilePhoto} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
//                                 ) : (
//                                     <div className="avatar-placeholder large">
//                                         {selectedUser.firstName.charAt(0)}
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="user-details">
//                                 <div className="detail-item">
//                                     <span className="detail-label">First Name:</span>
//                                     <span className="detail-value">{selectedUser.firstName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Last Name:</span>
//                                     <span className="detail-value">{selectedUser.lastName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Country:</span>
//                                     <span className="detail-value">{selectedUser.country || 'Unknown'}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Email:</span>
//                                     <span className="detail-value">{selectedUser.email}</span>
//                                 </div>
//                             </div>

//                             <div className="modal-actions">
//                                 <button
//                                     className="close-detail-btn"
//                                     onClick={() => setSelectedUser(null)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Notifications Panel */}
//             <div
//                 className={`notifications-backdrop ${showNotifications ? 'active' : ''}`}
//                 onClick={() => setShowNotifications(false)}
//             />

//             <div className={`notifications-panel ${showNotifications ? 'active' : ''}`}>
//                 <div className="panel-header">
//                     <h3>Friend Requests</h3>
//                     <button
//                         className="close-btn"
//                         onClick={handleClose}
//                     >
//                         <FaTimes />
//                     </button>
//                 </div>

//                 <div className="panel-content">
//                     {friendRequests.length === 0 ? (
//                         <div className="no-requests">
//                             <p>No pending friend requests</p>
//                         </div>
//                     ) : (
//                         friendRequests.map(request => (
//                             <div key={request._id} className="request-item">
//                                 <div className="request-main">
//                                     <div className="request-avatar">
//                                         {request.requester?.profilePhoto ? (
//                                             <img
//                                                 src={request.requester.profilePhoto}
//                                                 alt={`${request.requester.firstName} ${request.requester.lastName}`}
//                                             />
//                                         ) : (
//                                             <div className="avatar-placeholder">
//                                                 {request.requester?.firstName?.charAt(0)}
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="request-details">
//                                         <div className="request-name">
//                                             {request.requester?.firstName} {request.requester?.lastName}
//                                         </div>
//                                         <div className="request-message">
//                                             Wants to be your friend
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="request-actions">
//                                     <button
//                                         className="accept-btn"
//                                         onClick={() => acceptFriendRequest(request._id)}
//                                     >
//                                         Accept
//                                     </button>
//                                     <button
//                                         className="reject-btn"
//                                         onClick={() => rejectFriendRequest(request._id)}
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// ChatPage.defaultProps = {
//     setChatTheme: () => {},
//     blockUser: () => console.warn("blockUser function not provided"),
//     clearChatHistory: () => console.warn("clearChatHistory function not provided")
// };

// export default ChatPage;



// Correct Code ------ 


// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
//     FaSignOutAlt, FaCheck, FaClock, FaTimes, FaArrowUp, FaArrowDown,
//     FaPalette, FaImage, FaBan, FaTrash, FaUserPlus, FaBell, FaUserFriends, FaUser, FaCog,
//     FaLock, FaUnlock, FaLockOpen, FaRegEye, FaRegEyeSlash
// } from 'react-icons/fa';
// import { IoIosSend, IoIosAdd } from 'react-icons/io';
// import { MdArrowBack, MdSearch, MdClose } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import './ChatPage.css';

// const ChatPage = ({ user, token, onLogout }) => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('chats');
//     const [friends, setFriends] = useState([]);
//     const [allUsers, setAllUsers] = useState([]);
//     const [activeChat, setActiveChat] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState({});
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loadingFriends, setLoadingFriends] = useState(true);
//     const [loadingMessages, setLoadingMessages] = useState(false);
//     const [isSending, setIsSending] = useState(false);
//     const [onlineUsers, setOnlineUsers] = useState(new Set());
//     const messagesEndRef = useRef(null);
//     const [showAddFriendModal, setShowAddFriendModal] = useState(false);
//     const [friendRequests, setFriendRequests] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showSidebar, setShowSidebar] = useState(true);
//     const [showFriendOptions, setShowFriendOptions] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
//     const [showSearch, setShowSearch] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showMenu, setShowMenu] = useState(false);
//     const [showContactPopup, setShowContactPopup] = useState(false);
//     const [showThemePopup, setShowThemePopup] = useState(false);
//     const [themeMode, setThemeMode] = useState('default');
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [selectedWallpaper, setSelectedWallpaper] = useState(null);
//     const menuRef = useRef(null);
//     const themeRef = useRef(null);

//     const BACKEND_URL = "http://localhost:5000";

//     const [currentTheme, setCurrentTheme] = useState({});
//     const [blockedUsers, setBlockedUsers] = useState(() => {
//         const stored = localStorage.getItem("blockedUsers");
//         return stored ? JSON.parse(stored) : [];
//     });


//     // New state variables for settings
//     const [showSettingsModal, setShowSettingsModal] = useState(false);
//     const [settingsSection, setSettingsSection] = useState('main'); // 'main', 'blocked', 'applock', 'theme'
//     const [appLockType, setAppLockType] = useState(() => localStorage.getItem('appLockType') || 'none');
//     const [appLockValue, setAppLockValue] = useState(() => localStorage.getItem('appLockValue') || '');
//     const [showAppLockSetup, setShowAppLockSetup] = useState(false);
//     const [appLockStep, setAppLockStep] = useState('select'); // 'select', 'setPin', 'setPassword', 'verifyEmail', 'enterCode'
//     const [newPin, setNewPin] = useState('');
//     const [confirmPin, setConfirmPin] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [unlockInput, setUnlockInput] = useState('');
//     const [showUnlockPopup, setShowUnlockPopup] = useState(false);
//     const [verificationEmail, setVerificationEmail] = useState('');
//     const [verificationCode, setVerificationCode] = useState('');
//     const [generatedCode, setGeneratedCode] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [appTheme, setAppTheme] = useState(() => localStorage.getItem('appTheme') || 'system');
//     const [ShowThemePopup, SetShowThemePopup] = useState(false);
//     const [ThemeMode, SetThemeMode] = useState('default');


//     // profile Edit
//     const [showProfileModal, setShowProfileModal] = useState(false);
//       const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//     const [loading, setLoading] = useState(true);
//     const fileInputRef = useRef(null);

//   const [profileData, setProfileData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     age: '',
//     profilePhoto: null,
//     country: ''
//   });


//     // State to track last read message per friend
//     const [lastReadMessages, setLastReadMessages] = useState(() => {
//         try {
//             return JSON.parse(localStorage.getItem('lastReadMessages') || '{}');
//         } catch { return {}; }
//     });

//     // Persist lastReadMessages
//     useEffect(() => {
//         localStorage.setItem('lastReadMessages', JSON.stringify(lastReadMessages));
//     }, [lastReadMessages]);

//     // Update lastReadMessages when new messages arrive for inactive chats
//     useEffect(() => {
//         Object.keys(messages).forEach(friendId => {
//             if (activeChat?._id !== friendId) {
//                 const friendMsgs = messages[friendId] || [];
//                 if (!friendMsgs.length) return;

//                 const lastReadId = lastReadMessages[friendId];
//                 const unreadExists = friendMsgs.some(msg => msg.sender !== user.id && (!lastReadId || msg._id > lastReadId));
//                 if (unreadExists) {
//                     // Trigger render by setting prev value if not set
//                     setLastReadMessages(prev => ({
//                         ...prev,
//                         [friendId]: prev[friendId] || null
//                     }));
//                 }
//             }
//         });
//     }, [messages, activeChat?._id, lastReadMessages, user.id]);




//     // Track last seen time per chat (persisted)
//     const [lastSeenAt, setLastSeenAt] = useState(() => {
//         try { return JSON.parse(localStorage.getItem('lastSeenAt') || '{}'); }
//         catch { return {}; }
//     });

//     useEffect(() => {
//         localStorage.setItem('lastSeenAt', JSON.stringify(lastSeenAt));
//     }, [lastSeenAt]);



//     useEffect(() => {
//         // When messages update, recalculate unread counts
//         Object.keys(messages).forEach(friendId => {
//             const friendMessages = messages[friendId] || [];
//             if (friendMessages.length > 0) {
//                 // If this friend is not the active chat, check for new messages
//                 if (activeChat?._id !== friendId) {
//                     const lastReadMessageId = lastReadMessages[friendId];

//                     if (!lastReadMessageId) {
//                         // If no last read message, mark first message as read initially
//                         const firstMessage = friendMessages[0];
//                         if (firstMessage && firstMessage.sender === user.id) {
//                             setLastReadMessages(prev => ({
//                                 ...prev,
//                                 [friendId]: firstMessage._id
//                             }));
//                         }
//                     }
//                 }
//             }
//         });
//     }, [messages, activeChat?._id, user.id]);


//     const handleNewMessage = (newMessage) => {
//         // Add message to messages state
//         setMessages(prev => ({
//             ...prev,
//             [newMessage.senderId]: [...(prev[newMessage.senderId] || []), newMessage]
//         }));

//         // Don't update last read if it's from another user and not in active chat
//         if (newMessage.sender !== user.id && activeChat?._id !== newMessage.senderId) {
//             // Unread count will be calculated automatically in the render
//             console.log(`New unread message from ${newMessage.senderId}`);
//         } else if (newMessage.sender === user.id || activeChat?._id === newMessage.senderId) {
//             // Mark as read if it's from current user or in active chat
//             setLastReadMessages(prev => ({
//                 ...prev,
//                 [newMessage.senderId]: newMessage._id
//             }));
//         }
//     };


//     const sendMessage = async (messageText) => {
//         if (!messageText.trim() || !activeChat) return;

//         const newMessage = {
//             _id: Date.now().toString(), // temporary ID
//             text: messageText,
//             sender: user.id,
//             receiver: activeChat._id,
//             createdAt: new Date().toISOString()
//         };

//         // Add to messages
//         setMessages(prev => ({
//             ...prev,
//             [activeChat._id]: [...(prev[activeChat._id] || []), newMessage]
//         }));

//         // Mark as read since user sent it
//         setLastReadMessages(prev => ({
//             ...prev,
//             [activeChat._id]: newMessage._id
//         }));

//         // Here you would also send to your backend/socket
//         // await sendMessageToServer(newMessage);
//     };

//     //     useEffect(() => {
//     //     // This should be called when you receive a new message
//     //     const handleNewMessage = (newMessage) => {
//     //         // Only increment if the message is not from current user and chat is not active
//     //         if (newMessage.sender !== user.id && activeChat?._id !== newMessage.chatId) {
//     //             setUnreadCounts(prev => ({
//     //                 ...prev,
//     //                 [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1
//     //             }));
//     //         }
//     //     };

//     //     // You would call handleNewMessage when receiving messages via socket or API
//     //     // Example: socket.on('newMessage', handleNewMessage);

//     // }, [user.id, activeChat?._id]);

//     // New useEffect for app lock check on component mount
//     useEffect(() => {
//         const checkAppLock = () => {
//             const lockType = localStorage.getItem('appLockType');
//             const lockValue = localStorage.getItem('appLockValue');

//             if (lockType && lockType !== 'none' && lockValue) {
//                 setShowUnlockPopup(true);
//             }
//         };

//         checkAppLock();
//     }, []);

//     // New useEffect for applying theme
//     useEffect(() => {
//         const applyTheme = () => {
//             // Remove any existing theme classes first
//             document.documentElement.classList.remove('dark-theme');
//             document.body.classList.remove('dark-theme');

//             if (appTheme === 'dark') {
//                 document.documentElement.classList.add('dark-theme');
//                 document.body.classList.add('dark-theme');
//             } else if (appTheme === 'light') {
//                 // Light theme - classes already removed above
//                 // Body will use default CSS styles (white bg, black text)
//             } else {
//                 // System theme - use prefers-color-scheme
//                 const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//                 if (prefersDark) {
//                     document.documentElement.classList.add('dark-theme');
//                     document.body.classList.add('dark-theme');
//                 }
//                 // If system prefers light, do nothing (use default styles)
//             }
//         };

//         applyTheme();
//         localStorage.setItem('appTheme', appTheme);
//     }, [appTheme]);


//     useEffect(() => {
//         if (activeChat?._id) {
//             const themeData = localStorage.getItem('chatThemes');
//             const themes = themeData ? JSON.parse(themeData) : {};
//             setCurrentTheme(themes[activeChat._id] || {});
//         } else {
//             setCurrentTheme({});
//         }
//     }, [activeChat]);

//     // Handle mobile animations
//     useEffect(() => {
//         if (showNotifications) {
//             setTimeout(() => setIsMobilePanelOpen(true), 10);
//         } else {
//             setIsMobilePanelOpen(false);
//         }
//     }, [showNotifications]);

//     useEffect(() => {
//         if (showNotifications && window.innerWidth <= 768) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'auto';
//         }

//         return () => {
//             document.body.style.overflow = 'auto';
//         };
//     }, [showNotifications]);

//     // Simulate online status
//     useEffect(() => {
//         const onlineUserIds = new Set([1, 3, 8]); // Remove quotes to make them numbers
//         setOnlineUsers(onlineUserIds);
//     }, []);

//     // Fetch friends from the database
//     useEffect(() => {
//         const fetchFriends = async () => {
//             try {
//                 setLoadingFriends(true);
//                 const response = await axios.get('/api/friends', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });

//                 // Filter out blocked users
//                 const filtered = response.data.filter(
//                     friend => !blockedUsers.includes(friend._id)
//                 );

//                 setFriends(filtered);
//             } catch (error) {
//                 toast.error('Failed to load friends');
//                 console.error('Error fetching friends:', error);
//             } finally {
//                 setLoadingFriends(false);
//             }
//         };

//         fetchFriends();
//     }, [user.id, blockedUsers, token]);

//     // Fetch all users for add friend modal
//     useEffect(() => {
//         const fetchAllUsers = async () => {
//             try {
//                 const response = await axios.get('/api/users');
//                 const filteredUsers = response.data.filter(u => u._id !== user.id);

//                 // Add default properties to each user
//                 const usersWithDefaults = filteredUsers.map(user => ({
//                     ...user,
//                     profilePhoto: user.profilePhoto || '',
//                     email: user.email || '',
//                     phone: user.phone || '',
//                     country: user.country || ''
//                 }));

//                 setAllUsers(usersWithDefaults);
//             } catch (error) {
//                 toast.error('Failed to load users');
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchAllUsers();
//     }, [user.id]);

//     // Fetch friend requests
//     useEffect(() => {
//         const fetchFriendRequests = async () => {
//             try {
//                 const response = await axios.get('/api/friend-requests');
//                 setFriendRequests(response.data);
//             } catch (error) {
//                 toast.error('Failed to load friend requests');
//                 console.error('Error fetching friend requests:', error);
//             }
//         };

//         fetchFriendRequests();
//     }, [user.id]);

//     // Fetch messages when a chat is selected
//     useEffect(() => {
//         const fetchMessages = async () => {
//             if (!activeChat) return;

//             try {
//                 setLoadingMessages(true);
//                 const response = await axios.get(`/api/messages/${activeChat._id}`);
//                 setMessages(prev => ({
//                     ...prev,
//                     [activeChat._id]: response.data
//                 }));
//             } catch (error) {
//                 toast.error('Failed to load messages');
//                 console.error('Error fetching messages:', error);
//             } finally {
//                 setLoadingMessages(false);
//             }
//         };

//         fetchMessages();
//     }, [activeChat]);

//     // Scroll to bottom when messages change
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, activeChat]);


//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     const handleLogout = () => {
//         onLogout();
//         navigate("/");
//     };

//     const filteredFriends = friends.filter(friend =>
//         `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const sendFriendRequest = async (userId) => {
//         try {
//             await axios.post('/api/friend-requests', { recipientId: userId });
//             toast.success('Friend request sent');
//             setAllUsers(prev => prev.map(u =>
//                 u._id === userId ? { ...u, requestSent: true } : u
//             ));
//         } catch (error) {
//             const message = error.response?.data?.message || 'Failed to send request';
//             toast.error(message);
//             console.error('Friend request error:', error.response?.data);
//         }
//     };

//     const acceptFriendRequest = async (requestId) => {
//         try {
//             await axios.put(`/api/friend-requests/${requestId}`, { status: 'accepted' });
//             setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//             toast.success('Friend request accepted');
//         } catch (error) {
//             toast.error('Failed to accept request');
//             console.error('Accept error:', error);
//         }
//     };

//     const rejectFriendRequest = async (requestId) => {
//         try {
//             await axios.put(`/api/friend-requests/${requestId}`, { status: 'rejected' });
//             setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//             toast.info('Friend request rejected');
//         } catch (error) {
//             toast.error('Failed to reject request');
//             console.error('Reject error:', error);
//         }
//     };

//     const handleSendMessage = async () => {
//         if (!message.trim() || !activeChat) return;

//         // Check if user is blocked
//         if (blockedUsers.includes(activeChat._id)) {
//             toast.error(`You cannot send messages to ${activeChat.firstName} because you have blocked them.`);
//             return;
//         }

//         const receiverId = activeChat._id;

//         const newMessage = {
//             text: message,
//             sender: user.id,
//             receiver: receiverId,
//             createdAt: new Date()
//         };

//         try {
//             setIsSending(true);
//             const response = await axios.post('/api/messages', newMessage);

//             setMessages(prev => ({
//                 ...prev,
//                 [receiverId]: [...(prev[receiverId] || []), response.data]
//             }));

//             setMessage('');
//         } catch (error) {
//             toast.error('Failed to send message');
//             console.error('Error sending message:', error);
//         } finally {
//             setIsSending(false);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     // Format time for messages
//     const formatMessageTime = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     const isUserOnline = (userId) => {
//         return onlineUsers.has(String(userId));
//     };

//     // Toggle sidebar on mobile
//     const toggleSidebar = () => {
//         setShowSidebar(!showSidebar);
//     };

//     // View user details
//     const viewUserDetails = (user) => {
//         setSelectedUser(user);
//     };

//     const handleClose = () => {
//         setShowNotifications(false);
//         if (window.innerWidth <= 768) {
//             document.body.style.overflow = 'auto';
//         }
//     };

//     const handleThemeSelection = () => {
//         try {
//             if (activeChat && activeChat._id) {
//                 const themeData = localStorage.getItem('chatThemes');
//                 const themes = themeData ? JSON.parse(themeData) : {};

//                 const newTheme = {
//                     color: selectedColor || null,
//                     wallpaper: selectedWallpaper || null
//                 };

//                 // Save to localStorage
//                 themes[activeChat._id] = newTheme;
//                 localStorage.setItem('chatThemes', JSON.stringify(themes));

//                 // Update state to trigger re-render
//                 setCurrentTheme(newTheme);

//                 toast.success("Theme applied successfully");
//             }
//         } catch (error) {
//             console.error("Error saving theme:", error);
//             toast.error("Failed to apply theme");
//         }
//         setShowThemePopup(false);
//     };

//     const blockUser = async (userId) => {
//         try {
//             const token = localStorage.getItem("airchat_token");
//             if (!token) {
//                 throw new Error("Missing authentication token");
//             }

//             const response = await fetch(`${BACKEND_URL}/api/users/block/${userId}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem("airchat_token");
//                 throw new Error("Session expired. Please login again");
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Block request failed");
//             }

//             return await response.json();
//         } catch (error) {
//             console.error("Blocking error:", error);
//             throw error;
//         }
//     };

//     const handleBlockUser = async () => {
//         if (!activeChat?._id) {
//             toast.error("No active chat selected");
//             return;
//         }

//         try {
//             const token = localStorage.getItem("airchat_token");
//             if (!token) {
//                 toast.error("Please login first");
//                 return;
//             }

//             const result = await blockUser(activeChat._id);

//             // Update blocked users
//             const updatedBlocked = [...blockedUsers, activeChat._id];
//             setBlockedUsers(updatedBlocked);
//             localStorage.setItem("blockedUsers", JSON.stringify(updatedBlocked));

//             // Remove from friends list
//             setFriends(prev => prev.filter(friend => friend._id !== activeChat._id));

//             // Close active chat
//             setActiveChat(null);

//             toast.success(result.message);
//             setShowMenu(false);
//         } catch (err) {
//             // Handle session expiration
//             if (err.message === "Session expired. Please login again") {
//                 toast.error("Session expired. Please log in again");
//                 onLogout();  // Trigger logout flow
//             } else {
//                 toast.error(err.message || "User blocking failed");
//             }
//         }
//     };

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (menuRef.current && !menuRef.current.contains(e.target)) {
//                 setShowMenu(false);
//             }
//             if (themeRef.current && !themeRef.current.contains(e.target)) {
//                 setShowThemePopup(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);




//     // New functions for settings
//     // const handleUnlockApp = () => {
//     //     const storedValue = localStorage.getItem('appLockValue');
//     //     const lockType = localStorage.getItem('appLockType');

//     //     if (lockType === 'pin' && unlockInput === storedValue) {
//     //         setShowUnlockPopup(false);
//     //         return true;
//     //     }

//     //     if (lockType === 'password' && unlockInput === storedValue) {
//     //         setShowUnlockPopup(false);
//     //         return true;
//     //     }

//     //     toast.error('Incorrect unlock code');
//     //     return false;
//     // };


//     // Unlock App for current user only
//     const handleUnlockApp = () => {
//         if (!user || !user.id) return false;

//         const storedValue = localStorage.getItem(`appLockValue_${user.id}`);
//         const lockType = localStorage.getItem(`appLockType_${user.id}`);

//         if ((lockType === 'pin' || lockType === 'password') && unlockInput === storedValue) {
//             setShowUnlockPopup(false);
//             toast.success('App unlocked');
//             return true;
//         }

//         toast.error('Incorrect unlock code');
//         return false;
//     };

//     // Set App Lock for current user only
//     const handleSetAppLock = (type) => {
//         if (!user || !user.id) return;

//         if (type === 'none') {
//             localStorage.setItem(`appLockType_${user.id}`, 'none');
//             localStorage.removeItem(`appLockValue_${user.id}`);
//             setAppLockType('none');
//             toast.success('App lock removed');
//             return;
//         }

//         setAppLockType(type);
//         setAppLockStep('select');
//         setShowAppLockSetup(true);
//     };


//     // const handleSetAppLock = (type) => {
//     //     if (type === 'none') {
//     //         localStorage.setItem('appLockType', 'none');
//     //         localStorage.removeItem('appLockValue');
//     //         setAppLockType('none');
//     //         toast.success('App lock removed');
//     //         return;
//     //     }

//     //     setAppLockType(type);
//     //     setAppLockStep('select');
//     //     setShowAppLockSetup(true);
//     // };


//     const handleSetPin = () => {
//         if (!user || !user.id) return;

//         if (newPin.length < 6) {
//             toast.error('PIN must be at least 6 digits');
//             return;
//         }

//         if (newPin !== confirmPin) {
//             toast.error('PINs do not match');
//             return;
//         }

//         localStorage.setItem(`appLockType_${user.id}`, 'pin');
//         localStorage.setItem(`appLockValue_${user.id}`, newPin);
//         setAppLockType('pin');
//         setAppLockValue(newPin);
//         setShowAppLockSetup(false);
//         toast.success('PIN lock set successfully');
//     };

//     // const handleSetPin = () => {
//     //     if (newPin.length < 6) {
//     //         toast.error('PIN must be at least 6 digits');
//     //         return;
//     //     }

//     //     if (newPin !== confirmPin) {
//     //         toast.error('PINs do not match');
//     //         return;
//     //     }

//     //     localStorage.setItem('appLockType', 'pin');
//     //     localStorage.setItem('appLockValue', newPin);
//     //     setAppLockType('pin');
//     //     setAppLockValue(newPin);
//     //     setShowAppLockSetup(false);
//     //     toast.success('PIN lock set successfully');
//     // };


//     const handleSetPassword = () => {
//         if (!user || !user.id) return;

//         if (newPassword.length < 4) {
//             toast.error('Password must be at least 4 characters');
//             return;
//         }

//         if (newPassword !== confirmPassword) {
//             toast.error('Passwords do not match');
//             return;
//         }

//         localStorage.setItem(`appLockType_${user.id}`, 'password');
//         localStorage.setItem(`appLockValue_${user.id}`, newPassword);
//         setAppLockType('password');
//         setAppLockValue(newPassword);
//         setShowAppLockSetup(false);
//         toast.success('Password lock set successfully');
//     };

//     // const handleSetPassword = () => {
//     //     if (newPassword.length < 4) {
//     //         toast.error('Password must be at least 4 characters');
//     //         return;
//     //     }

//     //     if (newPassword !== confirmPassword) {
//     //         toast.error('Passwords do not match');
//     //         return;
//     //     }

//     //     localStorage.setItem('appLockType', 'password');
//     //     localStorage.setItem('appLockValue', newPassword);
//     //     setAppLockType('password');
//     //     setAppLockValue(newPassword);
//     //     setShowAppLockSetup(false);
//     //     toast.success('Password lock set successfully');
//     // };

//     const handleForgotPassword = () => {
//         setAppLockStep('verifyEmail');
//         setVerificationEmail(user.email);
//     };

//     const handleSendVerificationCode = () => {
//         if (verificationEmail !== user.email) {
//             toast.error('Email does not match your account');
//             return;
//         }

//         // Generate a random 4-digit code
//         const code = Math.floor(1000 + Math.random() * 9000);
//         setGeneratedCode(code.toString());

//         // In a real app, you would send this code to the user's email
//         console.log(`Verification code: ${code}`);

//         toast.info(`Verification code sent to ${verificationEmail}`);
//         setAppLockStep('enterCode');
//     };

//     const handleVerifyCode = () => {
//         if (verificationCode === generatedCode) {
//             setAppLockStep('select');
//             toast.success('Verification successful');
//         } else {
//             toast.error('Incorrect verification code');
//         }
//     };

//     const handleThemeChange = (theme) => {
//         setAppTheme(theme);
//         localStorage.setItem('appTheme', theme);
//         toast.success(`Theme set to ${theme}`);
//     };

//     const unblockUser = (userId) => {
//         const updatedBlocked = blockedUsers.filter(id => id !== userId);
//         setBlockedUsers(updatedBlocked);
//         localStorage.setItem('blockedUsers', JSON.stringify(updatedBlocked));

//         // Add user back to friends list
//         const unblockedUser = allUsers.find(u => u._id === userId);
//         if (unblockedUser) {
//             setFriends(prev => [...prev, unblockedUser]);
//         }

//         toast.success('User unblocked successfully');
//     };

//     // On App load, only show unlock if current user has lock set
//     useEffect(() => {
//         if (!user || !user.id) return;

//         const lockType = localStorage.getItem(`appLockType_${user.id}`);
//         if (lockType && lockType !== 'none') {
//             setShowUnlockPopup(true);
//         } else {
//             setShowUnlockPopup(false);
//         }
//     }, [user]);



//       // Fetch user data on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         // Replace with your actual API endpoint
//         const response = await axios.get('/api/user/me');
//         const userData = response.data;

//         setProfileData({
//           firstName: userData.firstName || '',
//           lastName: userData.lastName || '',
//           email: userData.email || '',
//           phoneNumber: userData.phoneNumber || '',
//           age: userData.age || '',
//           profilePhoto: userData.profilePhoto || null,
//           country: userData.country || ''
//         });

//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load profile data');
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Handle input changes
//   const handleInputChange = (field, value) => {
//     setProfileData(prev => ({ ...prev, [field]: value }));
//   };

//   // Handle photo upload
//   const handlePhotoChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setProfileData(prev => ({ ...prev, profilePhoto: reader.result }));
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   // Save profile data
//   const handleSaveProfile = async () => {
//     try {
//       setSaving(true);
//       setError('');
//       setSuccess('');

//       // Prepare data for API
//       const updateData = {
//         firstName: profileData.firstName,
//         lastName: profileData.lastName,
//         phoneNumber: profileData.phoneNumber,
//         age: profileData.age,
//         profilePhoto: profileData.profilePhoto,
//         country: profileData.country
//       };

//       // Replace with your actual API endpoint
//       await axios.put('/api/user/update', updateData);

//       setSuccess('Profile updated successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//       setSaving(false);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
//       setSaving(false);
//     }
//   };

//     // Trigger file input click
//   const triggerFileInput = () => {
//     fileInputRef.current.click();
//   };

//     return (
//         <div className="airchat-container">
//             {/* Sidebar - Only show on large screens or when toggled on mobile */}
//             {(showSidebar || window.innerWidth > 768) && (
//                 <div className="sidebar">
//                     <div className="sidebar-header">
//                         <div className="app-logo">
//                             <span className="logo-text">AirChat</span>
//                         </div>
//                         <div className="header-actions">
//                             <button
//                                 className="icon-btn notification-btn"
//                                 onClick={() => setShowNotifications(!showNotifications)}
//                                 title="Notifications"
//                             >
//                                 <FaBell />
//                                 {friendRequests.length > 0 && (
//                                     <span className="notification-badge">{friendRequests.length}</span>
//                                 )}
//                             </button>
//                             <button
//                                 className="icon-btn logout-btn"
//                                 onClick={handleLogout}
//                                 title="Logout"
//                             >
//                                 <FaSignOutAlt />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="tabs">
//                         <button
//                             className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('chats')}
//                         >
//                             CHATS
//                         </button>
//                         <button
//                             className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('status')}
//                         >
//                             STATUS
//                         </button>
//                     </div>



//                     <div className="chats-list">
//                         {loadingFriends ? (
//                             <div className="text-center py-4">
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                             </div>
//                         ) : filteredFriends.length === 0 ? (
//                             <div className="text-center py-4">
//                                 <p>No friends found</p>
//                             </div>
//                         ) : (
//                             filteredFriends.map(friend => {
//                                 const friendMsgs = messages[friend._id] || [];
//                                 const lastReadId = lastReadMessages[friend._id];

//                                 // Calculate unread messages for inactive chats
//                                 const lastReadIndex = lastReadId
//                                     ? friendMsgs.findIndex(msg => msg._id === lastReadId)
//                                     : -1;

//                                 const unreadCount = friendMsgs
//                                     .slice(lastReadIndex + 1)
//                                     .filter(msg => msg.sender !== user.id).length;

//                                 const isActive = activeChat?._id === friend._id;
//                                 const isOnline = isUserOnline(friend._id);

//                                 return (
//                                     <div
//                                         key={friend._id}
//                                         className={`chat-item ${isActive ? 'active' : ''}`}
//                                         onClick={() => {
//                                             const fullUser = allUsers.find(u => u._id === friend._id) || friend;
//                                             setActiveChat({ ...fullUser });

//                                             // Mark all messages as read
//                                             if (friendMsgs.length) {
//                                                 const lastMsg = friendMsgs[friendMsgs.length - 1];
//                                                 setLastReadMessages(prev => ({
//                                                     ...prev,
//                                                     [friend._id]: lastMsg._id
//                                                 }));
//                                             }
//                                         }}
//                                     >
//                                         <div className="avatar">
//                                             {friend.profilePhoto ? (
//                                                 <img src={friend.profilePhoto} alt={`${friend.firstName} ${friend.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">{friend.firstName.charAt(0)}</div>
//                                             )}
//                                             {isOnline && <span className="online-badge"></span>}
//                                         </div>

//                                         <div className="chat-info">
//                                             <div className="chat-header">
//                                                 <div className="user-name">{friend.firstName} {friend.lastName}</div>
//                                                 {!isActive && unreadCount > 0 && (
//                                                     <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>

//                     {/* Friend Options Toggle */}
//                     <div className="friend-options-toggle">
//                         <button
//                             className="toggle-btn"
//                             onClick={() => setShowFriendOptions(!showFriendOptions)}
//                         >
//                             <IoIosAdd />
//                         </button>

//                         {showFriendOptions && (
//                             <div className="friend-options">
//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => {
//                                         setShowAddFriendModal(true);
//                                         setShowFriendOptions(false);
//                                     }}
//                                 >
//                                     <FaUserPlus /> Add Friend
//                                 </button>

//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => {
//                                         setShowProfileModal(true);
//                                         setShowFriendOptions(false);
//                                     }}
//                                 >
//                                     <FaUser /> Profile
//                                 </button>

//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => {
//                                         setShowSettingsModal(true);
//                                         setShowFriendOptions(false);
//                                     }}
//                                 >
//                                     <FaCog /> Settings
//                                 </button>

//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => setShowFriendOptions(false)}
//                                 >
//                                     <MdArrowBack /> Back
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Main Chat Area */}
//             <div className={`main-chat-area ${!showSidebar && window.innerWidth <= 768 ? 'expanded' : ''}`}>
//                 {activeChat ? (
//                     <>
//                         <div className="chat-header">
//                             {/* Left section - Back button & Profile */}
//                             <div className="header-left">
//                                 {window.innerWidth <= 768 && (
//                                     <button
//                                         className="back-btn"
//                                         onClick={() => {
//                                             setShowSidebar(true);
//                                             setActiveChat(null);
//                                         }}
//                                     >
//                                         <MdArrowBack />
//                                     </button>
//                                 )}

//                                 <div className="chat-partner">
//                                     <div className="avatar">
//                                         {activeChat.profilePhoto ? (
//                                             <img
//                                                 src={activeChat.profilePhoto}
//                                                 alt={`${activeChat.firstName} ${activeChat.lastName}`}
//                                             />
//                                         ) : (
//                                             <div className="avatar-placeholder">
//                                                 {activeChat.firstName?.charAt(0)}
//                                             </div>
//                                         )}
//                                         {isUserOnline(activeChat._id) && <span className="online-badge"></span>}
//                                     </div>
//                                     <div className="partner-info">
//                                         <div className="partner-name">
//                                             {activeChat.firstName} {activeChat.lastName}
//                                         </div>
//                                         <div className="partner-status">
//                                             {isUserOnline(activeChat._id) ? (
//                                                 <span className="online-text">Online</span>
//                                             ) : (
//                                                 <span>Offline</span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Right section - Actions */}
//                             <div className="header-actions">
//                                 <div className="menu-container" ref={menuRef}>
//                                     <button
//                                         className="icon-btn"
//                                         onClick={() => setShowMenu(!showMenu)}
//                                     >
//                                         <FaEllipsisV />
//                                     </button>

//                                     {showMenu && (
//                                         <div className="menu-popup">
//                                             <button onClick={() => {
//                                                 setShowContactPopup(true);
//                                                 setShowMenu(false);
//                                             }}>
//                                                 View Contact
//                                             </button>
//                                             <button onClick={() => {
//                                                 setShowThemePopup(true);
//                                                 setShowMenu(false);
//                                             }}>
//                                                 Chat Theme
//                                             </button>
//                                             <button
//                                             >
//                                                 Lock Contact
//                                             </button>
//                                             <button
//                                             >
//                                                 Hide Contact
//                                             </button>
//                                             <button onClick={handleBlockUser}>
//                                                 Block User
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Contact Popup */}
//                             {showContactPopup && activeChat && (
//                                 <div className="contact-popup">
//                                     <div className="popup-content">
//                                         <button
//                                             className="close-popup"
//                                             onClick={() => setShowContactPopup(false)}
//                                         >
//                                             <MdClose />
//                                         </button>

//                                         <div className="contact-header">
//                                             <div className="contact-avatar">
//                                                 {activeChat.profilePhoto ? (
//                                                     <img
//                                                         src={activeChat.profilePhoto}
//                                                         alt={`${activeChat.firstName} ${activeChat.lastName}`}
//                                                     />
//                                                 ) : (
//                                                     <div className="avatar-placeholder large">
//                                                         {activeChat.firstName?.charAt(0)}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <h3>{activeChat.firstName} {activeChat.lastName}</h3>
//                                         </div>

//                                         <div className="contact-details">
//                                             <div className="detail-item">
//                                                 <label>Email:</label>
//                                                 <span>{activeChat.email || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Phone:</label>
//                                                 <span>{activeChat.phoneNumber || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Country:</label>
//                                                 <span>{activeChat.country || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Status:</label>
//                                                 <span>
//                                                     {isUserOnline(activeChat._id)
//                                                         ? 'Online'
//                                                         : 'Offline'}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Theme Popup */}
//                             {showThemePopup && (
//                                 <div className="theme-popup" ref={themeRef}>
//                                     <div className="popup-content">
//                                         <button
//                                             className="close-popup"
//                                             onClick={() => setShowThemePopup(false)}
//                                         >
//                                             <MdClose />
//                                         </button>

//                                         <h3>Chat Theme</h3>

//                                         <div className="theme-tabs">
//                                             <button
//                                                 className={themeMode === 'color' ? 'active' : ''}
//                                                 onClick={() => setThemeMode('color')}
//                                             >
//                                                 Color Theme
//                                             </button>
//                                             <button
//                                                 className={themeMode === 'wallpaper' ? 'active' : ''}
//                                                 onClick={() => setThemeMode('wallpaper')}
//                                             >
//                                                 Wallpaper
//                                             </button>
//                                         </div>

//                                         <div className="theme-content">
//                                             {themeMode === 'color' ? (
//                                                 <div className="color-themes">
//                                                     <h4>Select a color theme:</h4>
//                                                     <div className="color-grid">
//                                                         {['#f0f8ff', '#fff0f5', '#f5f5dc', '#e6e6fa', '#f0fff0', '#fffacd'].map(color => (
//                                                             <div
//                                                                 key={color}
//                                                                 className={`color-option ${selectedColor === color ? 'selected' : ''}`}
//                                                                 style={{ backgroundColor: color }}
//                                                                 onClick={() => setSelectedColor(color)}
//                                                             />
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="wallpaper-themes">
//                                                     <h4>Select a wallpaper:</h4>
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         onChange={(e) => {
//                                                             if (e.target.files[0]) {
//                                                                 const reader = new FileReader();
//                                                                 reader.onload = (event) => {
//                                                                     setSelectedWallpaper(event.target.result);
//                                                                 };
//                                                                 reader.readAsDataURL(e.target.files[0]);
//                                                             }
//                                                         }}
//                                                     />
//                                                     {selectedWallpaper && (
//                                                         <div className="wallpaper-preview">
//                                                             <img src={selectedWallpaper} alt="Wallpaper preview" />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className="theme-actions">
//                                             <button
//                                                 className="cancel-btn"
//                                                 onClick={() => setShowThemePopup(false)}
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 className="confirm-btn"
//                                                 onClick={handleThemeSelection}
//                                                 disabled={!selectedColor && !selectedWallpaper}
//                                             >
//                                                 Apply Theme
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="chat-messages"
//                             style={{
//                                 backgroundColor: currentTheme.color || '#d9fdd3',
//                                 backgroundImage: currentTheme.wallpaper
//                                     ? `url(${currentTheme.wallpaper})`
//                                     : 'none',
//                                 backgroundSize: 'cover',
//                                 backgroundPosition: 'center'
//                             }}>
//                             {loadingMessages ? (
//                                 <div className="text-center py-4">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading messages...</span>
//                                     </div>
//                                 </div>
//                             ) : messages[activeChat._id]?.length === 0 ? (
//                                 <div className="no-messages">
//                                     <p>No messages yet. Start the conversation!</p>
//                                 </div>
//                             ) : (
//                                 messages[activeChat._id]?.map((msg) => (
//                                     <div
//                                         key={msg._id}
//                                         className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
//                                     >
//                                         <div className="message-content">
//                                             {msg.text}
//                                         </div>
//                                         <div className="message-meta">
//                                             <div className="message-time">
//                                                 {formatMessageTime(msg.createdAt)}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         <div className="message-input-area">
//                             <button className="icon-btn">
//                                 <FaSmile />
//                             </button>
//                             <button className="icon-btn">
//                                 <FaPaperclip />
//                             </button>
//                             <div className="message-input-container">
//                                 <textarea
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     onKeyDown={handleKeyPress}
//                                     placeholder="Type a message"
//                                     rows={1}
//                                 />
//                             </div>
//                             {message ? (
//                                 <button
//                                     className="send-btn"
//                                     onClick={handleSendMessage}
//                                     disabled={isSending}
//                                 >
//                                     {isSending ? (
//                                         <div className="sending-spinner"></div>
//                                     ) : (
//                                         <IoIosSend />
//                                     )}
//                                 </button>
//                             ) : (
//                                 <button className="icon-btn">
//                                     <FaMicrophone />
//                                 </button>
//                             )}
//                         </div>
//                     </>
//                 ) : (
//                     <div className="no-chat-selected">
//                         <div className="welcome-container">
//                             <div className="logo-large">
//                                 <span className="logo-text">AirChat</span>
//                             </div>
//                             <h2>Welcome, {user.name}</h2>
//                             <p>Select a chat to start messaging</p>
//                             <p>Or start a new conversation</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Add Friend Modal */}
//             {showAddFriendModal && (
//                 <div className="modal-overlay">
//                     <div className="add-friend-modal">
//                         <div className="modal-header">
//                             <h3>Add Friends</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setShowAddFriendModal(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             {allUsers
//                                 .filter(u =>
//                                     !friends.some(f => f._id === u._id) &&
//                                     !friendRequests.some(r => r.senderId === u._id)
//                                 )
//                                 .map(user => (
//                                     <div key={user._id} className="user-item">
//                                         <div className="user-avatar">
//                                             {user.profilePhoto ? (
//                                                 <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">
//                                                     {user.firstName.charAt(0)}
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="user-info">
//                                             <div className="user-name">{user.firstName} {user.lastName}</div>
//                                         </div>
//                                         <div className="user-actions">
//                                             <button
//                                                 className="view-btn"
//                                                 onClick={() => viewUserDetails(user)}
//                                             >
//                                                 View
//                                             </button>
//                                             <button
//                                                 className={`add-btn ${user.requestSent ? 'sent' : ''}`}
//                                                 onClick={() => sendFriendRequest(user._id)}
//                                                 disabled={user.requestSent}
//                                             >
//                                                 {user.requestSent ? 'Request Sent' : 'Add'}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* User Detail Modal */}
//             {selectedUser && (
//                 <div className="modal-overlay">
//                     <div className="user-detail-modal">
//                         <div className="modal-header">
//                             <h3>User Details</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setSelectedUser(null)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             <div className="user-avatar-large">
//                                 {selectedUser.profilePhoto ? (
//                                     <img src={selectedUser.profilePhoto} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
//                                 ) : (
//                                     <div className="avatar-placeholder large">
//                                         {selectedUser.firstName.charAt(0)}
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="user-details">
//                                 <div className="detail-item">
//                                     <span className="detail-label">First Name:</span>
//                                     <span className="detail-value">{selectedUser.firstName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Last Name:</span>
//                                     <span className="detail-value">{selectedUser.lastName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Country:</span>
//                                     <span className="detail-value">{selectedUser.country || 'Unknown'}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Email:</span>
//                                     <span className="detail-value">{selectedUser.email}</span>
//                                 </div>
//                             </div>

//                             <div className="modal-actions">
//                                 <button
//                                     className="close-detail-btn"
//                                     onClick={() => setSelectedUser(null)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Notifications Panel */}
//             <div
//                 className={`notifications-backdrop ${showNotifications ? 'active' : ''}`}
//                 onClick={() => setShowNotifications(false)}
//             />

//             <div className={`notifications-panel ${showNotifications ? 'active' : ''}`}>
//                 <div className="panel-header">
//                     <h3>Friend Requests</h3>
//                     <button
//                         className="close-btn"
//                         onClick={handleClose}
//                     >
//                         <FaTimes />
//                     </button>
//                 </div>

//                 <div className="panel-content">
//                     {friendRequests.length === 0 ? (
//                         <div className="no-requests">
//                             <p>No pending friend requests</p>
//                         </div>
//                     ) : (
//                         friendRequests.map(request => (
//                             <div key={request._id} className="request-item">
//                                 <div className="request-main">
//                                     <div className="request-avatar">
//                                         {request.requester?.profilePhoto ? (
//                                             <img
//                                                 src={request.requester.profilePhoto}
//                                                 alt={`${request.requester.firstName} ${request.requester.lastName}`}
//                                             />
//                                         ) : (
//                                             <div className="avatar-placeholder">
//                                                 {request.requester?.firstName?.charAt(0)}
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="request-details">
//                                         <div className="request-name">
//                                             {request.requester?.firstName} {request.requester?.lastName}
//                                         </div>
//                                         <div className="request-message">
//                                             Wants to be your friend
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="request-actions">
//                                     <button
//                                         className="accept-btn"
//                                         onClick={() => acceptFriendRequest(request._id)}
//                                     >
//                                         Accept
//                                     </button>
//                                     <button
//                                         className="reject-btn"
//                                         onClick={() => rejectFriendRequest(request._id)}
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>




//             {/* Settings Modal */}
//             {showSettingsModal && (
//                 <div className="modal-overlay">
//                     <div className="settings-modal">
//                         <div className="modal-header">
//                             <h3>Settings</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => {
//                                     setShowSettingsModal(false);
//                                     setSettingsSection('main');
//                                 }}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         {settingsSection === 'main' && (
//                             <div className="settings-content">
//                                 <div className="settings-option" onClick={() => setSettingsSection('blocked')}>
//                                     <div className="option-icon">
//                                         <FaBan />
//                                     </div>
//                                     <div className="option-details">
//                                         <h4>Blocked Users</h4>
//                                         <p>Manage blocked contacts</p>
//                                     </div>
//                                     <div className="option-arrow">
//                                         <MdArrowBack style={{ transform: 'rotate(180deg)' }} />
//                                     </div>
//                                 </div>

//                                 <div className="settings-option" onClick={() => setSettingsSection('applock')}>
//                                     <div className="option-icon">
//                                         <FaLock />
//                                     </div>
//                                     <div className="option-details">
//                                         <h4>App Lock</h4>
//                                         <p>{appLockType === 'none' ? 'Not set' : `${appLockType} lock enabled`}</p>
//                                     </div>
//                                     <div className="option-arrow">
//                                         <MdArrowBack style={{ transform: 'rotate(180deg)' }} />
//                                     </div>
//                                 </div>

//                                 {/* <div className="settings-option" onClick={() => setSettingsSection('theme')}>
//                                     <div className="option-icon">
//                                         <FaPalette />
//                                     </div>
//                                     <div className="option-details">
//                                         <h4>Theme</h4>
//                                         <p>Change app appearance</p>
//                                     </div>
//                                     <div className="option-arrow">
//                                         <MdArrowBack style={{ transform: 'rotate(180deg)' }} />
//                                     </div>
//                                 </div> */}
//                             </div>
//                         )}

//                         {settingsSection === 'blocked' && (
//                             <div className="settings-content">
//                                 <div className="settings-back" onClick={() => setSettingsSection('main')}>
//                                     <MdArrowBack /> Back to Settings
//                                 </div>

//                                 <h3 className="section-title">Blocked Users</h3>

//                                 {blockedUsers.length === 0 ? (
//                                     <div className="no-blocked-users">
//                                         <p>No blocked users</p>
//                                     </div>
//                                 ) : (
//                                     <div className="blocked-users-list">
//                                         {allUsers
//                                             .filter(u => blockedUsers.includes(u._id))
//                                             .map(user => (
//                                                 <div key={user._id} className="blocked-user-item">
//                                                     <div className="user-info">
//                                                         <div className="avatar">
//                                                             {user.profilePhoto ? (
//                                                                 <img src={user.profilePhoto} alt={user.firstName} />
//                                                             ) : (
//                                                                 <div className="avatar-placeholder">
//                                                                     {user.firstName.charAt(0)}
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                         <div className="user-details">
//                                                             <h4>{user.firstName} {user.lastName}</h4>
//                                                             <p>{user.email}</p>
//                                                         </div>
//                                                     </div>
//                                                     <button
//                                                         className="unblock-btn"
//                                                         onClick={() => unblockUser(user._id)}
//                                                     >
//                                                         <FaUnlock /> Unblock
//                                                     </button>
//                                                 </div>
//                                             ))
//                                         }
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {settingsSection === 'applock' && (
//                             <div className="settings-content">
//                                 <div className="settings-back" onClick={() => setSettingsSection('main')}>
//                                     <MdArrowBack /> Back to Settings
//                                 </div>

//                                 <h3 className="section-title">App Lock</h3>

//                                 <div className="app-lock-status">
//                                     <div className="status-icon">
//                                         {appLockType === 'none' ? <FaLockOpen /> : <FaLock />}
//                                     </div>
//                                     <div className="status-details">
//                                         <h4>Current Lock: {appLockType === 'none' ? 'None' : appLockType.toUpperCase()}</h4>
//                                         <p>{appLockType === 'none' ? 'Your app is not secured' : 'Your app is secured'}</p>
//                                     </div>
//                                 </div>

//                                 <div className="lock-options">
//                                     <button
//                                         className={`lock-option ${appLockType === 'none' ? 'active' : ''}`}
//                                         onClick={() => handleSetAppLock('none')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLockOpen />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>None</h4>
//                                             <p>No app lock</p>
//                                         </div>
//                                     </button>

//                                     <button
//                                         className={`lock-option ${appLockType === 'pin' ? 'active' : ''}`}
//                                         onClick={() => handleSetAppLock('pin')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLock />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>PIN</h4>
//                                             <p>6-digit numeric code</p>
//                                         </div>
//                                     </button>

//                                     <button
//                                         className={`lock-option ${appLockType === 'password' ? 'active' : ''}`}
//                                         onClick={() => handleSetAppLock('password')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLock />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>Password</h4>
//                                             <p>At least 4 characters</p>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {/* {settingsSection === 'theme' && (
//                             <div className="settings-content">
//                                 <div className="settings-back" onClick={() => setSettingsSection('main')}>
//                                     <MdArrowBack /> Back to Settings
//                                 </div>

//                                 <h3 className="section-title">App Theme</h3>

//                                 <div className="theme-options">
//                                     <div
//                                         className={`theme-option ${appTheme === 'light' ? 'active' : ''}`}
//                                         onClick={() => handleThemeChange('light')}
//                                     >
//                                         <div className="theme-preview light">
//                                             <div className="theme-header"></div>
//                                             <div className="theme-content"></div>
//                                         </div>
//                                         <h4>Light</h4>
//                                     </div>

//                                     <div
//                                         className={`theme-option ${appTheme === 'dark' ? 'active' : ''}`}
//                                         onClick={() => handleThemeChange('dark')}
//                                     >
//                                         <div className="theme-preview dark">
//                                             <div className="theme-header"></div>
//                                             <div className="theme-content"></div>
//                                         </div>
//                                         <h4>Dark</h4>
//                                     </div>

//                                     <div
//                                         className={`theme-option ${appTheme === 'system' ? 'active' : ''}`}
//                                         onClick={() => handleThemeChange('system')}
//                                     >
//                                         <div className="theme-preview system">
//                                             <div className="theme-header"></div>
//                                             <div className="theme-content"></div>
//                                         </div>
//                                         <h4>System</h4>
//                                     </div>
//                                 </div>
//                             </div>
//                         )} */}
//                     </div>
//                 </div>
//             )}

//             {/* App Lock Setup Modal */}
//             {showAppLockSetup && (
//                 <div className="modal-overlay">
//                     <div className="app-lock-modal">
//                         <div className="modal-header">
//                             <h3>Set Airchat App Lock</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setShowAppLockSetup(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         {appLockStep === 'select' && (
//                             <div className="lock-selection">
//                                 <h4>Select lock type:</h4>
//                                 <div className="lock-options">
//                                     <button
//                                         className="lock-option"
//                                         onClick={() => setAppLockStep('setPin')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLock />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>PIN</h4>
//                                             <p>6-digit numeric code</p>
//                                         </div>
//                                     </button>

//                                     <button
//                                         className="lock-option"
//                                         onClick={() => setAppLockStep('setPassword')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLock />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>Password</h4>
//                                             <p>At least 4 characters</p>
//                                         </div>
//                                     </button>

//                                     <button
//                                         className="lock-option"
//                                         onClick={() => handleSetAppLock('none')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLockOpen />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>None</h4>
//                                             <p>Remove app lock</p>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {appLockStep === 'setPin' && (
//                             <div className="pin-setup">
//                                 <h4>Set your PIN</h4>
//                                 <p>Enter a 6-digit PIN</p>

//                                 <div className="input-group">
//                                     <input
//                                         type="password"
//                                         value={newPin}
//                                         onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                         placeholder="New PIN"
//                                     />
//                                 </div>

//                                 <div className="input-group">
//                                     <input
//                                         type="password"
//                                         value={confirmPin}
//                                         onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                         placeholder="Confirm PIN"
//                                     />
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => setAppLockStep('select')}
//                                     >
//                                         Back
//                                     </button>
//                                     <button
//                                         className="confirm-btn"
//                                         onClick={handleSetPin}
//                                         disabled={newPin.length < 6 || confirmPin.length < 6}
//                                     >
//                                         Set PIN
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {appLockStep === 'setPassword' && (
//                             <div className="password-setup">
//                                 <h4>Set your Password</h4>
//                                 <p>At least 4 characters</p>

//                                 <div className="input-group">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         value={newPassword}
//                                         onChange={(e) => setNewPassword(e.target.value)}
//                                         placeholder="New Password"
//                                     />
//                                     <button
//                                         className="toggle-visibility"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                     >
//                                         {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//                                     </button>
//                                 </div>

//                                 <div className="input-group">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         value={confirmPassword}
//                                         onChange={(e) => setConfirmPassword(e.target.value)}
//                                         placeholder="Confirm Password"
//                                     />
//                                     <button
//                                         className="toggle-visibility"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                     >
//                                         {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//                                     </button>
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => setAppLockStep('select')}
//                                     >
//                                         Back
//                                     </button>
//                                     <button
//                                         className="confirm-btn"
//                                         onClick={handleSetPassword}
//                                         disabled={newPassword.length < 4 || confirmPassword.length < 4}
//                                     >
//                                         Set Password
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {appLockStep === 'verifyEmail' && (
//                             <div className="verify-email">
//                                 <h4>Verify Your Identity</h4>
//                                 <p>Enter your email to receive a verification code</p>

//                                 <div className="input-group">
//                                     <input
//                                         type="email"
//                                         value={verificationEmail}
//                                         onChange={(e) => setVerificationEmail(e.target.value)}
//                                         placeholder="Enter your email"
//                                     />
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => setAppLockStep('select')}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         className="confirm-btn"
//                                         onClick={handleSendVerificationCode}
//                                         disabled={!verificationEmail}
//                                     >
//                                         Send Code
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {appLockStep === 'enterCode' && (
//                             <div className="enter-code">
//                                 <h4>Enter Verification Code</h4>
//                                 <p>We sent a code to {verificationEmail}</p>

//                                 <div className="input-group">
//                                     <input
//                                         type="text"
//                                         value={verificationCode}
//                                         onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
//                                         placeholder="4-digit code"
//                                     />
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => setAppLockStep('verifyEmail')}
//                                     >
//                                         Back
//                                     </button>
//                                     <button
//                                         className="confirm-btn"
//                                         onClick={handleVerifyCode}
//                                         disabled={verificationCode.length < 4}
//                                     >
//                                         Verify
//                                     </button>
//                                 </div>

//                                 <div className="resend-link">
//                                     <button onClick={handleSendVerificationCode}>
//                                         Resend code
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* App Unlock Popup */}
//             {showUnlockPopup && (
//                 <div className="unlock-popup">
//                     <div className="popup-content">
//                         <div className="lock-icon">
//                             <FaLock />
//                         </div>

//                         <h3>Unlock AirChat</h3>
//                         <p>Enter your {appLockType === 'pin' ? 'PIN' : 'password'} to continue</p>

//                         <div className="input-group">
//                             <input
//                                 type={appLockType === 'pin' ? "password" : "password"}
//                                 value={unlockInput}
//                                 onChange={(e) => setUnlockInput(e.target.value)}
//                                 placeholder={`Enter your ${appLockType === 'pin' ? 'PIN' : 'password'}`}
//                                 autoFocus
//                             />
//                         </div>

//                         <button
//                             className="unlock-btn"
//                             onClick={handleUnlockApp}
//                         >
//                             Unlock
//                         </button>

//                         <div className="forgot-link">
//                             <button onClick={handleForgotPassword}>
//                                 Forgot {appLockType === 'pin' ? 'PIN' : 'password'}?
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}


//             {/* Profile Settings Modal */}
//             {showProfileModal && (
//                 <div className="modal-overlay">
//                     <div className="profile-modal">
//                         <div className="modal-header">
//                             <h2>Edit Profile</h2>
//                             <button className="close-btn" onClick={() => setShowProfileModal(false)}>
//                                 &times;
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             {/* Profile Photo Section */}
//                             <div className="profile-photo-section">
//                                 <div className="photo-preview">
//                                     {profileData.photo ? (
//                                         <img src={profileData.photo} alt="Profile" />
//                                     ) : (
//                                         <div className="photo-placeholder">
//                                             <FaUser size={40} />
//                                         </div>
//                                     )}
//                                 </div>
//                                 <label className="upload-btn">
//                                     Change Photo
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handlePhotoChange}
//                                         style={{ display: 'none' }}
//                                     />
//                                 </label>
//                             </div>

//                             {/* Form Fields */}
//                             <div className="form-group">
//                                 <label>First Name</label>
//                                 <input
//                                     type="text"
//                                     value={profileData.firstName}
//                                     onChange={(e) => handleInputChange('firstName', e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Last Name</label>
//                                 <input
//                                     type="text"
//                                     value={profileData.lastName}
//                                     onChange={(e) => handleInputChange('lastName', e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Phone Number</label>
//                                 <input
//                                     type="tel"
//                                     value={profileData.phone}
//                                     onChange={(e) => handleInputChange('phone', e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Age</label>
//                                 <input
//                                     type="number"
//                                     value={profileData.age}
//                                     onChange={(e) => handleInputChange('age', e.target.value)}
//                                     min="13"
//                                     max="120"
//                                 />
//                             </div>
//                         </div>

//                         <div className="modal-footer">
//                             <button className="cancel-btn" onClick={() => setShowProfileModal(false)}>
//                                 Cancel
//                             </button>
//                             <button className="save-btn" onClick={handleSaveProfile}>
//                                 Save Changes
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// ChatPage.defaultProps = {
//     setChatTheme: () => { },
//     blockUser: () => console.warn("blockUser function not provided"),
//     clearChatHistory: () => console.warn("clearChatHistory function not provided")
// };

// export default ChatPage;




// final Correct Code.................................

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
//     FaSignOutAlt, FaCheck, FaClock, FaTimes, FaArrowUp, FaArrowDown,
//     FaPalette, FaImage, FaBan, FaTrash, FaUserPlus, FaBell, FaUserFriends, FaUser, FaCog,
//     FaLock, FaUnlock, FaLockOpen, FaRegEye, FaRegEyeSlash, FaCamera
// } from 'react-icons/fa';
// import { IoIosSend, IoIosAdd } from 'react-icons/io';
// import { MdArrowBack, MdSearch, MdClose } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import './ChatPage.css';

// const ChatPage = ({ user, token, onLogout }) => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('chats');
//     const [friends, setFriends] = useState([]);
//     const [allUsers, setAllUsers] = useState([]);
//     const [activeChat, setActiveChat] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState({});
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loadingFriends, setLoadingFriends] = useState(true);
//     const [loadingMessages, setLoadingMessages] = useState(false);
//     const [isSending, setIsSending] = useState(false);
//     const [onlineUsers, setOnlineUsers] = useState(new Set());
//     const messagesEndRef = useRef(null);
//     const [showAddFriendModal, setShowAddFriendModal] = useState(false);
//     const [friendRequests, setFriendRequests] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showSidebar, setShowSidebar] = useState(true);
//     const [showFriendOptions, setShowFriendOptions] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
//     const [showSearch, setShowSearch] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showMenu, setShowMenu] = useState(false);
//     const [showContactPopup, setShowContactPopup] = useState(false);
//     const [showThemePopup, setShowThemePopup] = useState(false);
//     const [themeMode, setThemeMode] = useState('default');
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [selectedWallpaper, setSelectedWallpaper] = useState(null);
//     const menuRef = useRef(null);
//     const themeRef = useRef(null);

//     const BACKEND_URL = "http://localhost:5000";

//     const [currentTheme, setCurrentTheme] = useState({});
//     const [blockedUsers, setBlockedUsers] = useState(() => {
//         const stored = localStorage.getItem("blockedUsers");
//         return stored ? JSON.parse(stored) : [];
//     });

//     const [showSettingsModal, setShowSettingsModal] = useState(false);
//     const [settingsSection, setSettingsSection] = useState('main');
//     const [appLockType, setAppLockType] = useState(() => localStorage.getItem('appLockType') || 'none');
//     const [appLockValue, setAppLockValue] = useState(() => localStorage.getItem('appLockValue') || '');
//     const [showAppLockSetup, setShowAppLockSetup] = useState(false);
//     const [appLockStep, setAppLockStep] = useState('select');
//     const [newPin, setNewPin] = useState('');
//     const [confirmPin, setConfirmPin] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [unlockInput, setUnlockInput] = useState('');
//     const [showUnlockPopup, setShowUnlockPopup] = useState(false);
//     const [verificationEmail, setVerificationEmail] = useState('');
//     const [verificationCode, setVerificationCode] = useState('');
//     const [generatedCode, setGeneratedCode] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [appTheme, setAppTheme] = useState(() => localStorage.getItem('appTheme') || 'system');

//     // Profile Edit State
//     const [showProfileModal, setShowProfileModal] = useState(false);
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [loading, setLoading] = useState(true);
//     const fileInputRef = useRef(null);

//     const [profileData, setProfileData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phoneNumber: '',
//         age: '',
//         profilePhoto: '',
//         country: ''
//     });

//     // State to track last read message per friend
//     const [lastReadMessages, setLastReadMessages] = useState(() => {
//         try {
//             return JSON.parse(localStorage.getItem('lastReadMessages') || '{}');
//         } catch { return {}; }
//     });

//     // Persist lastReadMessages
//     useEffect(() => {
//         localStorage.setItem('lastReadMessages', JSON.stringify(lastReadMessages));
//     }, [lastReadMessages]);

//     // Update lastReadMessages when new messages arrive
//     useEffect(() => {
//         Object.keys(messages).forEach(friendId => {
//             if (activeChat?._id !== friendId) {
//                 const friendMsgs = messages[friendId] || [];
//                 if (!friendMsgs.length) return;

//                 const lastReadId = lastReadMessages[friendId];
//                 const unreadExists = friendMsgs.some(msg => msg.sender !== user.id && (!lastReadId || msg._id > lastReadId));
//                 if (unreadExists) {
//                     setLastReadMessages(prev => ({
//                         ...prev,
//                         [friendId]: prev[friendId] || null
//                     }));
//                 }
//             }
//         });
//     }, [messages, activeChat?._id, lastReadMessages, user.id]);

//     // Track last seen time per chat
//     const [lastSeenAt, setLastSeenAt] = useState(() => {
//         try { return JSON.parse(localStorage.getItem('lastSeenAt') || '{}'); }
//         catch { return {}; }
//     });

//     useEffect(() => {
//         localStorage.setItem('lastSeenAt', JSON.stringify(lastSeenAt));
//     }, [lastSeenAt]);

//     const handleNewMessage = (newMessage) => {
//         setMessages(prev => ({
//             ...prev,
//             [newMessage.senderId]: [...(prev[newMessage.senderId] || []), newMessage]
//         }));

//         if (newMessage.sender !== user.id && activeChat?._id !== newMessage.senderId) {
//             console.log(`New unread message from ${newMessage.senderId}`);
//         } else if (newMessage.sender === user.id || activeChat?._id === newMessage.senderId) {
//             setLastReadMessages(prev => ({
//                 ...prev,
//                 [newMessage.senderId]: newMessage._id
//             }));
//         }
//     };

//     const sendMessage = async (messageText) => {
//         if (!messageText.trim() || !activeChat) return;

//         const newMessage = {
//             _id: Date.now().toString(),
//             text: messageText,
//             sender: user.id,
//             receiver: activeChat._id,
//             createdAt: new Date().toISOString()
//         };

//         setMessages(prev => ({
//             ...prev,
//             [activeChat._id]: [...(prev[activeChat._id] || []), newMessage]
//         }));

//         setLastReadMessages(prev => ({
//             ...prev,
//             [activeChat._id]: newMessage._id
//         }));
//     };

//     // App lock check on component mount
//     useEffect(() => {
//         const checkAppLock = () => {
//             const lockType = localStorage.getItem('appLockType');
//             const lockValue = localStorage.getItem('appLockValue');

//             if (lockType && lockType !== 'none' && lockValue) {
//                 setShowUnlockPopup(true);
//             }
//         };

//         checkAppLock();
//     }, []);

//     // Apply theme
//     useEffect(() => {
//         const applyTheme = () => {
//             document.documentElement.classList.remove('dark-theme');
//             document.body.classList.remove('dark-theme');

//             if (appTheme === 'dark') {
//                 document.documentElement.classList.add('dark-theme');
//                 document.body.classList.add('dark-theme');
//             } else if (appTheme === 'system') {
//                 const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//                 if (prefersDark) {
//                     document.documentElement.classList.add('dark-theme');
//                     document.body.classList.add('dark-theme');
//                 }
//             }
//         };

//         applyTheme();
//         localStorage.setItem('appTheme', appTheme);
//     }, [appTheme]);

//     useEffect(() => {
//         if (activeChat?._id) {
//             const themeData = localStorage.getItem('chatThemes');
//             const themes = themeData ? JSON.parse(themeData) : {};
//             setCurrentTheme(themes[activeChat._id] || {});
//         } else {
//             setCurrentTheme({});
//         }
//     }, [activeChat]);

//     // Handle mobile animations
//     useEffect(() => {
//         if (showNotifications) {
//             setTimeout(() => setIsMobilePanelOpen(true), 10);
//         } else {
//             setIsMobilePanelOpen(false);
//         }
//     }, [showNotifications]);

//     useEffect(() => {
//         if (showNotifications && window.innerWidth <= 768) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'auto';
//         }

//         return () => {
//             document.body.style.overflow = 'auto';
//         };
//     }, [showNotifications]);

//     // Simulate online status
//     useEffect(() => {
//         const onlineUserIds = new Set([1, 3, 8]);
//         setOnlineUsers(onlineUserIds);
//     }, []);

//     // Fetch friends
//     useEffect(() => {
//         const fetchFriends = async () => {
//             try {
//                 setLoadingFriends(true);
//                 const response = await axios.get('/api/friends', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 const filtered = response.data.filter(
//                     friend => !blockedUsers.includes(friend._id)
//                 );

//                 setFriends(filtered);
//             } catch (error) {
//                 toast.error('Failed to load friends');
//                 console.error('Error fetching friends:', error);
//             } finally {
//                 setLoadingFriends(false);
//             }
//         };

//         fetchFriends();
//     }, [user.id, blockedUsers, token]);

//     // Fetch all users
//     useEffect(() => {
//         const fetchAllUsers = async () => {
//             try {
//                 const response = await axios.get('/api/users');
//                 const filteredUsers = response.data.filter(u => u._id !== user.id);

//                 const usersWithDefaults = filteredUsers.map(user => ({
//                     ...user,
//                     profilePhoto: user.profilePhoto || '',
//                     email: user.email || '',
//                     phone: user.phone || '',
//                     country: user.country || ''
//                 }));

//                 setAllUsers(usersWithDefaults);
//             } catch (error) {
//                 toast.error('Failed to load users');
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchAllUsers();
//     }, [user.id]);

//     // Fetch friend requests
//     useEffect(() => {
//         const fetchFriendRequests = async () => {
//             try {
//                 const response = await axios.get('/api/friend-requests');
//                 setFriendRequests(response.data);
//             } catch (error) {
//                 toast.error('Failed to load friend requests');
//                 console.error('Error fetching friend requests:', error);
//             }
//         };

//         fetchFriendRequests();
//     }, [user.id]);

//     // Fetch messages when chat selected
//     useEffect(() => {
//         const fetchMessages = async () => {
//             if (!activeChat) return;

//             try {
//                 setLoadingMessages(true);
//                 const response = await axios.get(`/api/messages/${activeChat._id}`);
//                 setMessages(prev => ({
//                     ...prev,
//                     [activeChat._id]: response.data
//                 }));
//             } catch (error) {
//                 toast.error('Failed to load messages');
//                 console.error('Error fetching messages:', error);
//             } finally {
//                 setLoadingMessages(false);
//             }
//         };

//         fetchMessages();
//     }, [activeChat]);

//     // Scroll to bottom
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, activeChat]);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     const handleLogout = () => {
//         onLogout();
//         navigate("/");
//     };

//     const filteredFriends = friends.filter(friend =>
//         `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const sendFriendRequest = async (userId) => {
//         try {
//             await axios.post('/api/friend-requests', { recipientId: userId });
//             toast.success('Friend request sent');
//             setAllUsers(prev => prev.map(u =>
//                 u._id === userId ? { ...u, requestSent: true } : u
//             ));
//         } catch (error) {
//             const message = error.response?.data?.message || 'Failed to send request';
//             toast.error(message);
//             console.error('Friend request error:', error.response?.data);
//         }
//     };

//     const acceptFriendRequest = async (requestId) => {
//         try {
//             await axios.put(`/api/friend-requests/${requestId}`, { status: 'accepted' });
//             setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//             toast.success('Friend request accepted');
//         } catch (error) {
//             toast.error('Failed to accept request');
//             console.error('Accept error:', error);
//         }
//     };

//     const rejectFriendRequest = async (requestId) => {
//         try {
//             await axios.put(`/api/friend-requests/${requestId}`, { status: 'rejected' });
//             setFriendRequests(prev => prev.filter(req => req._id !== requestId));
//             toast.info('Friend request rejected');
//         } catch (error) {
//             toast.error('Failed to reject request');
//             console.error('Reject error:', error);
//         }
//     };

//     const handleSendMessage = async () => {
//         if (!message.trim() || !activeChat) return;

//         if (blockedUsers.includes(activeChat._id)) {
//             toast.error(`You cannot send messages to ${activeChat.firstName} because you have blocked them.`);
//             return;
//         }

//         const receiverId = activeChat._id;

//         const newMessage = {
//             text: message,
//             sender: user.id,
//             receiver: receiverId,
//             createdAt: new Date()
//         };

//         try {
//             setIsSending(true);
//             const response = await axios.post('/api/messages', newMessage);

//             setMessages(prev => ({
//                 ...prev,
//                 [receiverId]: [...(prev[receiverId] || []), response.data]
//             }));

//             setMessage('');
//         } catch (error) {
//             toast.error('Failed to send message');
//             console.error('Error sending message:', error);
//         } finally {
//             setIsSending(false);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     // Format message time
//     const formatMessageTime = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     const isUserOnline = (userId) => {
//         return onlineUsers.has(String(userId));
//     };

//     // Toggle sidebar
//     const toggleSidebar = () => {
//         setShowSidebar(!showSidebar);
//     };

//     // View user details
//     const viewUserDetails = (user) => {
//         setSelectedUser(user);
//     };

//     const handleClose = () => {
//         setShowNotifications(false);
//         if (window.innerWidth <= 768) {
//             document.body.style.overflow = 'auto';
//         }
//     };

//     const handleThemeSelection = () => {
//         try {
//             if (activeChat && activeChat._id) {
//                 const themeData = localStorage.getItem('chatThemes');
//                 const themes = themeData ? JSON.parse(themeData) : {};

//                 const newTheme = {
//                     color: selectedColor || null,
//                     wallpaper: selectedWallpaper || null
//                 };

//                 themes[activeChat._id] = newTheme;
//                 localStorage.setItem('chatThemes', JSON.stringify(themes));

//                 setCurrentTheme(newTheme);
//                 toast.success("Theme applied successfully");
//             }
//         } catch (error) {
//             console.error("Error saving theme:", error);
//             toast.error("Failed to apply theme");
//         }
//         setShowThemePopup(false);
//     };

//     const blockUser = async (userId) => {
//         try {
//             const token = localStorage.getItem("airchat_token");
//             if (!token) {
//                 throw new Error("Missing authentication token");
//             }

//             const response = await fetch(`${BACKEND_URL}/api/users/block/${userId}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem("airchat_token");
//                 throw new Error("Session expired. Please login again");
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Block request failed");
//             }

//             return await response.json();
//         } catch (error) {
//             console.error("Blocking error:", error);
//             throw error;
//         }
//     };

//     const handleBlockUser = async () => {
//         if (!activeChat?._id) {
//             toast.error("No active chat selected");
//             return;
//         }

//         try {
//             const token = localStorage.getItem("airchat_token");
//             if (!token) {
//                 toast.error("Please login first");
//                 return;
//             }

//             const result = await blockUser(activeChat._id);

//             const updatedBlocked = [...blockedUsers, activeChat._id];
//             setBlockedUsers(updatedBlocked);
//             localStorage.setItem("blockedUsers", JSON.stringify(updatedBlocked));

//             setFriends(prev => prev.filter(friend => friend._id !== activeChat._id));
//             setActiveChat(null);

//             toast.success(result.message);
//             setShowMenu(false);
//         } catch (err) {
//             if (err.message === "Session expired. Please login again") {
//                 toast.error("Session expired. Please log in again");
//                 onLogout();
//             } else {
//                 toast.error(err.message || "User blocking failed");
//             }
//         }
//     };

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (menuRef.current && !menuRef.current.contains(e.target)) {
//                 setShowMenu(false);
//             }
//             if (themeRef.current && !themeRef.current.contains(e.target)) {
//                 setShowThemePopup(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     // Unlock App
//     const handleUnlockApp = () => {
//         if (!user || !user.id) return false;

//         const storedValue = localStorage.getItem(`appLockValue_${user.id}`);
//         const lockType = localStorage.getItem(`appLockType_${user.id}`);

//         if ((lockType === 'pin' || lockType === 'password') && unlockInput === storedValue) {
//             setShowUnlockPopup(false);
//             toast.success('App unlocked');
//             return true;
//         }

//         toast.error('Incorrect unlock code');
//         return false;
//     };

//     // Set App Lock
//     const handleSetAppLock = (type) => {
//         if (!user || !user.id) return;

//         if (type === 'none') {
//             localStorage.setItem(`appLockType_${user.id}`, 'none');
//             localStorage.removeItem(`appLockValue_${user.id}`);
//             setAppLockType('none');
//             toast.success('App lock removed');
//             return;
//         }

//         setAppLockType(type);
//         setAppLockStep('select');
//         setShowAppLockSetup(true);
//     };

//     const handleSetPin = () => {
//         if (!user || !user.id) return;

//         if (newPin.length < 6) {
//             toast.error('PIN must be at least 6 digits');
//             return;
//         }

//         if (newPin !== confirmPin) {
//             toast.error('PINs do not match');
//             return;
//         }

//         localStorage.setItem(`appLockType_${user.id}`, 'pin');
//         localStorage.setItem(`appLockValue_${user.id}`, newPin);
//         setAppLockType('pin');
//         setAppLockValue(newPin);
//         setShowAppLockSetup(false);
//         toast.success('PIN lock set successfully');
//     };

//     const handleSetPassword = () => {
//         if (!user || !user.id) return;

//         if (newPassword.length < 4) {
//             toast.error('Password must be at least 4 characters');
//             return;
//         }

//         if (newPassword !== confirmPassword) {
//             toast.error('Passwords do not match');
//             return;
//         }

//         localStorage.setItem(`appLockType_${user.id}`, 'password');
//         localStorage.setItem(`appLockValue_${user.id}`, newPassword);
//         setAppLockType('password');
//         setAppLockValue(newPassword);
//         setShowAppLockSetup(false);
//         toast.success('Password lock set successfully');
//     };

//     const handleForgotPassword = () => {
//         setAppLockStep('verifyEmail');
//         setVerificationEmail(user.email);
//     };

//     const handleSendVerificationCode = () => {
//         if (verificationEmail !== user.email) {
//             toast.error('Email does not match your account');
//             return;
//         }

//         const code = Math.floor(1000 + Math.random() * 9000);
//         setGeneratedCode(code.toString());
//         toast.info(`Verification code sent to ${verificationEmail}`);
//         setAppLockStep('enterCode');
//     };

//     const handleVerifyCode = () => {
//         if (verificationCode === generatedCode) {
//             setAppLockStep('select');
//             toast.success('Verification successful');
//         } else {
//             toast.error('Incorrect verification code');
//         }
//     };

//     const handleThemeChange = (theme) => {
//         setAppTheme(theme);
//         localStorage.setItem('appTheme', theme);
//         toast.success(`Theme set to ${theme}`);
//     };

//     const unblockUser = (userId) => {
//         const updatedBlocked = blockedUsers.filter(id => id !== userId);
//         setBlockedUsers(updatedBlocked);
//         localStorage.setItem('blockedUsers', JSON.stringify(updatedBlocked));

//         const unblockedUser = allUsers.find(u => u._id === userId);
//         if (unblockedUser) {
//             setFriends(prev => [...prev, unblockedUser]);
//         }

//         toast.success('User unblocked successfully');
//     };

//     // On App load, check lock status
//     useEffect(() => {
//         if (!user || !user.id) return;

//         const lockType = localStorage.getItem(`appLockType_${user.id}`);
//         if (lockType && lockType !== 'none') {
//             setShowUnlockPopup(true);
//         } else {
//             setShowUnlockPopup(false);
//         }
//     }, [user]);

//     // Fetch user data for profile
//     const fetchUserData = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('airchat_token');
//             if (!token) throw new Error('No token found. Please login.');

//             const response = await axios.get('http://localhost:5000/api/users/me', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             const userData = response.data;

//             setProfileData({
//                 firstName: userData.firstName || '',
//                 lastName: userData.lastName || '',
//                 email: userData.email || '',
//                 phoneNumber: userData.phoneNumber || '',
//                 age: userData.age || '',
//                 profilePhoto: userData.profilePhoto
//                     ? `http://localhost:5000${userData.profilePhoto}`
//                     : '',
//                 country: userData.country || ''
//             });

//             setLoading(false);
//         } catch (err) {
//             console.error('Fetch profile error:', err.response?.data || err.message);
//             setError('Failed to load profile data');
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUserData();
//     }, []);




//     // Handle input changes
//     const handleInputChange = (field, value) => {
//         setProfileData(prev => ({ ...prev, [field]: value }));
//     };

//     // Handle photo upload
//     const handlePhotoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfileData(prev => ({
//                 ...prev,
//                 profilePhoto: URL.createObjectURL(file)
//             }));
//         }
//     };

//     // Save profile data
//     // const handleSaveProfile = async () => {
//     //     try {
//     //         setSaving(true);
//     //         const token = localStorage.getItem('airchat_token');
//     //         // Example: send PUT request to update profile
//     //         await axios.put('http://localhost:5000/api/users/update-profile', profileData, {
//     //             headers: { Authorization: `Bearer ${token}` }
//     //         });

//     //         setSuccess('Profile updated successfully!');

//     //         setTimeout(() => {
//     //             setShowProfileModal(false);
//     //             setSuccess(''); // Clear success message
//     //         }, 1000);

//     //         setSaving(false);
//     //     } catch (err) {
//     //         console.error('Save profile error:', err.response?.data || err.message);
//     //         setError('Failed to save profile');
//     //         setSaving(false);
//     //     }
//     // };

// //     const handleSaveProfile = async () => {
// //   try {
// //     setSaving(true);
// //     const token = localStorage.getItem('airchat_token');

// //     const formData = new FormData();
// //     formData.append('firstName', profileData.firstName);
// //     formData.append('lastName', profileData.lastName);
// //     formData.append('phoneNumber', profileData.phoneNumber);
// //     formData.append('age', profileData.age);
// //     formData.append('country', profileData.country);

// //     if (fileInputRef.current?.files[0]) {
// //       formData.append('profilePhoto', fileInputRef.current.files[0]);
// //     }

// //     await axios.put('http://localhost:5000/api/users/update-profile', formData, {
// //       headers: { 
// //         Authorization: `Bearer ${token}`,
// //         'Content-Type': 'multipart/form-data'
// //       }
// //     });

// //     setSuccess('Profile updated successfully!');
// //     setTimeout(() => {
// //       setShowProfileModal(false);
// //       setSuccess('');
// //     }, 1000);
// //     setSaving(false);
// //   } catch (err) {
// //     console.error('Save profile error:', err.response?.data || err.message);
// //     setError('Failed to save profile');
// //     setSaving(false);
// //   }
// // };


// const [user, setUser] = useState(
//   JSON.parse(localStorage.getItem('airchat_user')) || null
// );

// const handleSaveProfile = async () => {
//   try {
//     setSaving(true);
//     const token = localStorage.getItem('airchat_token');

//     const formData = new FormData();
//     formData.append('firstName', profileData.firstName);
//     formData.append('lastName', profileData.lastName);
//     formData.append('phoneNumber', profileData.phoneNumber);
//     formData.append('age', profileData.age);
//     formData.append('country', profileData.country);

//     if (fileInputRef.current?.files[0]) {
//       formData.append('profilePhoto', fileInputRef.current.files[0]);
//     }

//     const res = await axios.put(
//       'http://localhost:5000/api/users/update-profile',
//       formData,
//       {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     );

//     const updatedUser = res.data.user;

//     // update profileData state
//     setProfileData(updatedUser);

//     // update sidebar/global user context
//     localStorage.setItem('airchat_user', JSON.stringify(updatedUser));
//     setUser(updatedUser); // if using Context or Redux

//     setSuccess('Profile updated successfully!');
//     setTimeout(() => {
//       setShowProfileModal(false);
//       setSuccess('');
//     }, 1000);
//     setSaving(false);
//   } catch (err) {
//     console.error('Save profile error:', err.response?.data || err.message);
//     setError('Failed to save profile');
//     setSaving(false);
//   }
// };



//     // Trigger file input click
//     const triggerFileInput = () => {
//         fileInputRef.current.click();
//     };

//     return (
//         <div className="airchat-container">
//             {/* Sidebar */}
//             {(showSidebar || window.innerWidth > 768) && (
//                 <div className="sidebar">
//                     <div className="sidebar-header">
//                         <div className="app-logo">
//                             <span className="logo-text">AirChat</span>
//                         </div>
//                         <div className="header-actions">
//                             <button
//                                 className="icon-btn notification-btn"
//                                 onClick={() => setShowNotifications(!showNotifications)}
//                                 title="Notifications"
//                             >
//                                 <FaBell />
//                                 {friendRequests.length > 0 && (
//                                     <span className="notification-badge">{friendRequests.length}</span>
//                                 )}
//                             </button>
//                             <button
//                                 className="icon-btn logout-btn"
//                                 onClick={handleLogout}
//                                 title="Logout"
//                             >
//                                 <FaSignOutAlt />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="tabs">
//                         <button
//                             className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('chats')}
//                         >
//                             CHATS
//                         </button>
//                         <button
//                             className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('status')}
//                         >
//                             STATUS
//                         </button>
//                     </div>

//                     <div className="chats-list">
//                         {loadingFriends ? (
//                             <div className="text-center py-4">
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                             </div>
//                         ) : filteredFriends.length === 0 ? (
//                             <div className="text-center py-4">
//                                 <p>No friends found</p>
//                             </div>
//                         ) : (
//                             filteredFriends.map(friend => {
//                                 const friendMsgs = messages[friend._id] || [];
//                                 const lastReadId = lastReadMessages[friend._id];
//                                 const lastReadIndex = lastReadId
//                                     ? friendMsgs.findIndex(msg => msg._id === lastReadId)
//                                     : -1;

//                                 const unreadCount = friendMsgs
//                                     .slice(lastReadIndex + 1)
//                                     .filter(msg => msg.sender !== user.id).length;

//                                 const isActive = activeChat?._id === friend._id;
//                                 const isOnline = isUserOnline(friend._id);

//                                 return (
//                                     <div
//                                         key={friend._id}
//                                         className={`chat-item ${isActive ? 'active' : ''}`}
//                                         onClick={() => {
//                                               const fullUser = allUsers.find(u => u._id === friend._id) || friend;
//   setActiveChat({ ...fullUser });

//     if (window.innerWidth <= 768) {
//     setShowSidebar(false);
//   }

//                                             if (friendMsgs.length) {
//                                                 const lastMsg = friendMsgs[friendMsgs.length - 1];
//                                                 setLastReadMessages(prev => ({
//                                                     ...prev,
//                                                     [friend._id]: lastMsg._id
//                                                 }));
//                                             }
//                                         }}
//                                     >
//                                         <div className="avatar">
//                                             {friend.profilePhoto ? (
//                                                 <img src={friend.profilePhoto} alt={`${friend.firstName} ${friend.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">{friend.firstName.charAt(0)}</div>
//                                             )}
//                                             {isOnline && <span className="online-badge"></span>}
//                                         </div>

//                                         <div className="chat-info">
//                                             <div className="chat-header">
//                                                 <div className="user-name">{friend.firstName} {friend.lastName}</div>
//                                                 {!isActive && unreadCount > 0 && (
//                                                     <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>

//                     {/* Friend Options Toggle */}
//                     <div className="friend-options-toggle">
//                         <button
//                             className="toggle-btn"
//                             onClick={() => setShowFriendOptions(!showFriendOptions)}
//                         >
//                             <IoIosAdd />
//                         </button>

//                         {showFriendOptions && (
//                             <div className="friend-options">
//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => {
//                                         setShowAddFriendModal(true);
//                                         setShowFriendOptions(false);
//                                     }}
//                                 >
//                                     <FaUserPlus /> Add Friend
//                                 </button>

//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => {
//                                         setShowProfileModal(true);
//                                         setShowFriendOptions(false);
//                                     }}
//                                 >
//                                     <FaUser /> Profile
//                                 </button>

//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => {
//                                         setShowSettingsModal(true);
//                                         setShowFriendOptions(false);
//                                     }}
//                                 >
//                                     <FaCog /> Settings
//                                 </button>

//                                 <button
//                                     className="friend-option-btn"
//                                     onClick={() => setShowFriendOptions(false)}
//                                 >
//                                     <MdArrowBack /> Back
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Main Chat Area */}
//             <div className={`main-chat-area ${!showSidebar && window.innerWidth <= 768 ? 'expanded' : ''}`}>
//                 {activeChat ? (
//                     <>
//                         <div className="chat-header">
//                             <div className="header-left">
//                                 {window.innerWidth <= 768 && (
//                                     <button
//                                         className="back-btn"
//                                         onClick={() => {
//                                             setShowSidebar(true);
//                                             setActiveChat(null);
//                                         }}
//                                     >
//                                         <MdArrowBack />
//                                     </button>
//                                 )}

//                                 <div className="chat-partner">
//                                     <div className="avatar">
//                                         {activeChat.profilePhoto ? (
//                                             <img
//                                                 src={activeChat.profilePhoto}
//                                                 alt={`${activeChat.firstName} ${activeChat.lastName}`}
//                                             />
//                                         ) : (
//                                             <div className="avatar-placeholder">
//                                                 {activeChat.firstName?.charAt(0)}
//                                             </div>
//                                         )}
//                                         {isUserOnline(activeChat._id) && <span className="online-badge"></span>}
//                                     </div>
//                                     <div className="partner-info">
//                                         <div className="partner-name">
//                                             {activeChat.firstName} {activeChat.lastName}
//                                         </div>
//                                         <div className="partner-status">
//                                             {isUserOnline(activeChat._id) ? (
//                                                 <span className="online-text">Online</span>
//                                             ) : (
//                                                 <span>Offline</span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="header-actions">
//                                 <div className="menu-container" ref={menuRef}>
//                                     <button
//                                         className="icon-btn"
//                                         onClick={() => setShowMenu(!showMenu)}
//                                     >
//                                         <FaEllipsisV />
//                                     </button>

//                                     {showMenu && (
//                                         <div className="menu-popup">
//                                             <button onClick={() => {
//                                                 setShowContactPopup(true);
//                                                 setShowMenu(false);
//                                             }}>
//                                                 View Contact
//                                             </button>
//                                             <button onClick={() => {
//                                                 setShowThemePopup(true);
//                                                 setShowMenu(false);
//                                             }}>
//                                                 Chat Theme
//                                             </button>
//                                             <button
//                                             >
//                                                 Lock Contact
//                                             </button>
//                                             <button
//                                             >
//                                                 Hide Contact
//                                             </button>
//                                             <button onClick={handleBlockUser}>
//                                                 Block User
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Contact Popup */}
//                             {showContactPopup && activeChat && (
//                                 <div className="contact-popup">
//                                     <div className="popup-content">
//                                         <button
//                                             className="close-popup"
//                                             onClick={() => setShowContactPopup(false)}
//                                         >
//                                             <MdClose />
//                                         </button>

//                                         <div className="contact-header">
//                                             <div className="contact-avatar">
//                                                 {activeChat.profilePhoto ? (
//                                                     <img
//                                                         src={activeChat.profilePhoto}
//                                                         alt={`${activeChat.firstName} ${activeChat.lastName}`}
//                                                     />
//                                                 ) : (
//                                                     <div className="avatar-placeholder large">
//                                                         {activeChat.firstName?.charAt(0)}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <h3>{activeChat.firstName} {activeChat.lastName}</h3>
//                                         </div>

//                                         <div className="contact-details">
//                                             <div className="detail-item">
//                                                 <label>Email:</label>
//                                                 <span>{activeChat.email || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Phone:</label>
//                                                 <span>{activeChat.phoneNumber || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Country:</label>
//                                                 <span>{activeChat.country || 'Not provided'}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label>Status:</label>
//                                                 <span>
//                                                     {isUserOnline(activeChat._id)
//                                                         ? 'Online'
//                                                         : 'Offline'}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Theme Popup */}
//                             {showThemePopup && (
//                                 <div className="theme-popup" ref={themeRef}>
//                                     <div className="popup-content">
//                                         <button
//                                             className="close-popup"
//                                             onClick={() => setShowThemePopup(false)}
//                                         >
//                                             <MdClose />
//                                         </button>

//                                         <h3>Chat Theme</h3>

//                                         <div className="theme-tabs">
//                                             <button
//                                                 className={themeMode === 'color' ? 'active' : ''}
//                                                 onClick={() => setThemeMode('color')}
//                                             >
//                                                 Color Theme
//                                             </button>
//                                             <button
//                                                 className={themeMode === 'wallpaper' ? 'active' : ''}
//                                                 onClick={() => setThemeMode('wallpaper')}
//                                             >
//                                                 Wallpaper
//                                             </button>
//                                         </div>

//                                         <div className="theme-content">
//                                             {themeMode === 'color' ? (
//                                                 <div className="color-themes">
//                                                     <h4>Select a color theme:</h4>
//                                                     <div className="color-grid">
//                                                         {['#f0f8ff', '#fff0f5', '#f5f5dc', '#e6e6fa', '#f0fff0', '#fffacd'].map(color => (
//                                                             <div
//                                                                 key={color}
//                                                                 className={`color-option ${selectedColor === color ? 'selected' : ''}`}
//                                                                 style={{ backgroundColor: color }}
//                                                                 onClick={() => setSelectedColor(color)}
//                                                             />
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="wallpaper-themes">
//                                                     <h4>Select a wallpaper:</h4>
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         onChange={(e) => {
//                                                             if (e.target.files[0]) {
//                                                                 const reader = new FileReader();
//                                                                 reader.onload = (event) => {
//                                                                     setSelectedWallpaper(event.target.result);
//                                                                 };
//                                                                 reader.readAsDataURL(e.target.files[0]);
//                                                             }
//                                                         }}
//                                                     />
//                                                     {selectedWallpaper && (
//                                                         <div className="wallpaper-preview">
//                                                             <img src={selectedWallpaper} alt="Wallpaper preview" />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className="theme-actions">
//                                             <button
//                                                 className="cancel-btn"
//                                                 onClick={() => setShowThemePopup(false)}
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 className="confirm-btn"
//                                                 onClick={handleThemeSelection}
//                                                 disabled={!selectedColor && !selectedWallpaper}
//                                             >
//                                                 Apply Theme
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="chat-messages"
//                             style={{
//                                 backgroundColor: currentTheme.color || '#d9fdd3',
//                                 backgroundImage: currentTheme.wallpaper
//                                     ? `url(${currentTheme.wallpaper})`
//                                     : 'none',
//                                 backgroundSize: 'cover',
//                                 backgroundPosition: 'center'
//                             }}>
//                             {loadingMessages ? (
//                                 <div className="text-center py-4">
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading messages...</span>
//                                     </div>
//                                 </div>
//                             ) : messages[activeChat._id]?.length === 0 ? (
//                                 <div className="no-messages">
//                                     <p>No messages yet. Start the conversation!</p>
//                                 </div>
//                             ) : (
//                                 messages[activeChat._id]?.map((msg) => (
//                                     <div
//                                         key={msg._id}
//                                         className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
//                                     >
//                                         <div className="message-content">
//                                             {msg.text}
//                                         </div>
//                                         <div className="message-meta">
//                                             <div className="message-time">
//                                                 {formatMessageTime(msg.createdAt)}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         <div className="message-input-area">
//                             <button className="icon-btn">
//                                 <FaSmile />
//                             </button>
//                             <button className="icon-btn">
//                                 <FaPaperclip />
//                             </button>
//                             <div className="message-input-container">
//                                 <textarea
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     onKeyDown={handleKeyPress}
//                                     placeholder="Type a message"
//                                     rows={1}
//                                 />
//                             </div>
//                             {message ? (
//                                 <button
//                                     className="send-btn"
//                                     onClick={handleSendMessage}
//                                     disabled={isSending}
//                                 >
//                                     {isSending ? (
//                                         <div className="sending-spinner"></div>
//                                     ) : (
//                                         <IoIosSend />
//                                     )}
//                                 </button>
//                             ) : (
//                                 <button className="icon-btn">
//                                     <FaMicrophone />
//                                 </button>
//                             )}
//                         </div>
//                     </>
//                 ) : (
//                     <div className="no-chat-selected">
//                         <div className="welcome-container">
//                             <div className="logo-large">
//                                 <span className="logo-text">AirChat</span>
//                             </div>
//                             <h2>Welcome, {user.name}</h2>
//                             <p>Select a chat to start messaging</p>
//                             <p>Or start a new conversation</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Add Friend Modal */}
//             {showAddFriendModal && (
//                 <div className="modal-overlay">
//                     <div className="add-friend-modal">
//                         <div className="modal-header">
//                             <h3>Add Friends</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setShowAddFriendModal(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             {allUsers
//                                 .filter(u =>
//                                     !friends.some(f => f._id === u._id) &&
//                                     !friendRequests.some(r => r.senderId === u._id)
//                                 )
//                                 .map(user => (
//                                     <div key={user._id} className="user-item">
//                                         <div className="user-avatar">
//                                             {user.profilePhoto ? (
//                                                 <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
//                                             ) : (
//                                                 <div className="avatar-placeholder">
//                                                     {user.firstName.charAt(0)}
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="user-info">
//                                             <div className="user-name">{user.firstName} {user.lastName}</div>
//                                         </div>
//                                         <div className="user-actions">
//                                             <button
//                                                 className="view-btn"
//                                                 onClick={() => viewUserDetails(user)}
//                                             >
//                                                 View
//                                             </button>
//                                             <button
//                                                 className={`add-btn ${user.requestSent ? 'sent' : ''}`}
//                                                 onClick={() => sendFriendRequest(user._id)}
//                                                 disabled={user.requestSent}
//                                             >
//                                                 {user.requestSent ? 'Request Sent' : 'Add'}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* User Detail Modal */}
//             {selectedUser && (
//                 <div className="modal-overlay">
//                     <div className="user-detail-modal">
//                         <div className="modal-header">
//                             <h3>User Details</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setSelectedUser(null)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             <div className="user-avatar-large">
//                                 {selectedUser.profilePhoto ? (
//                                     <img src={selectedUser.profilePhoto} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
//                                 ) : (
//                                     <div className="avatar-placeholder large">
//                                         {selectedUser.firstName.charAt(0)}
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="user-details">
//                                 <div className="detail-item">
//                                     <span className="detail-label">First Name:</span>
//                                     <span className="detail-value">{selectedUser.firstName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Last Name:</span>
//                                     <span className="detail-value">{selectedUser.lastName}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Country:</span>
//                                     <span className="detail-value">{selectedUser.country || 'Unknown'}</span>
//                                 </div>
//                                 <div className="detail-item">
//                                     <span className="detail-label">Email:</span>
//                                     <span className="detail-value">{selectedUser.email}</span>
//                                 </div>
//                             </div>

//                             <div className="modal-actions">
//                                 <button
//                                     className="close-detail-btn"
//                                     onClick={() => setSelectedUser(null)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Notifications Panel */}
//             <div
//                 className={`notifications-backdrop ${showNotifications ? 'active' : ''}`}
//                 onClick={() => setShowNotifications(false)}
//             />

//             <div className={`notifications-panel ${showNotifications ? 'active' : ''}`}>
//                 <div className="panel-header">
//                     <h3>Friend Requests</h3>
//                     <button
//                         className="close-btn"
//                         onClick={handleClose}
//                     >
//                         <FaTimes />
//                     </button>
//                 </div>

//                 <div className="panel-content">
//                     {friendRequests.length === 0 ? (
//                         <div className="no-requests">
//                             <p>No pending friend requests</p>
//                         </div>
//                     ) : (
//                         friendRequests.map(request => (
//                             <div key={request._id} className="request-item">
//                                 <div className="request-main">
//                                     <div className="request-avatar">
//                                         {request.requester?.profilePhoto ? (
//                                             <img
//                                                 src={request.requester.profilePhoto}
//                                                 alt={`${request.requester.firstName} ${request.requester.lastName}`}
//                                             />
//                                         ) : (
//                                             <div className="avatar-placeholder">
//                                                 {request.requester?.firstName?.charAt(0)}
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="request-details">
//                                         <div className="request-name">
//                                             {request.requester?.firstName} {request.requester?.lastName}
//                                         </div>
//                                         <div className="request-message">
//                                             Wants to be your friend
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="request-actions">
//                                     <button
//                                         className="accept-btn"
//                                         onClick={() => acceptFriendRequest(request._id)}
//                                     >
//                                         Accept
//                                     </button>
//                                     <button
//                                         className="reject-btn"
//                                         onClick={() => rejectFriendRequest(request._id)}
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* Settings Modal */}
//             {showSettingsModal && (
//                 <div className="modal-overlay">
//                     <div className="settings-modal">
//                         <div className="modal-header">
//                             <h3>Settings</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => {
//                                     setShowSettingsModal(false);
//                                     setSettingsSection('main');
//                                 }}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         {settingsSection === 'main' && (
//                             <div className="settings-content">
//                                 <div className="settings-option" onClick={() => setSettingsSection('blocked')}>
//                                     <div className="option-icon">
//                                         <FaBan />
//                                     </div>
//                                     <div className="option-details">
//                                         <h4>Blocked Users</h4>
//                                         <p>Manage blocked contacts</p>
//                                     </div>
//                                     <div className="option-arrow">
//                                         <MdArrowBack style={{ transform: 'rotate(180deg)' }} />
//                                     </div>
//                                 </div>

//                                 <div className="settings-option" onClick={() => setSettingsSection('applock')}>
//                                     <div className="option-icon">
//                                         <FaLock />
//                                     </div>
//                                     <div className="option-details">
//                                         <h4>App Lock</h4>
//                                         <p>{appLockType === 'none' ? 'Not set' : `${appLockType} lock enabled`}</p>
//                                     </div>
//                                     <div className="option-arrow">
//                                         <MdArrowBack style={{ transform: 'rotate(180deg)' }} />
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {settingsSection === 'blocked' && (
//                             <div className="settings-content">
//                                 <div className="settings-back" onClick={() => setSettingsSection('main')}>
//                                     <MdArrowBack /> Back to Settings
//                                 </div>

//                                 <h3 className="section-title">Blocked Users</h3>

//                                 {blockedUsers.length === 0 ? (
//                                     <div className="no-blocked-users">
//                                         <p>No blocked users</p>
//                                     </div>
//                                 ) : (
//                                     <div className="blocked-users-list">
//                                         {allUsers
//                                             .filter(u => blockedUsers.includes(u._id))
//                                             .map(user => (
//                                                 <div key={user._id} className="blocked-user-item">
//                                                     <div className="user-info">
//                                                         <div className="avatar">
//                                                             {user.profilePhoto ? (
//                                                                 <img src={user.profilePhoto} alt={user.firstName} />
//                                                             ) : (
//                                                                 <div className="avatar-placeholder">
//                                                                     {user.firstName.charAt(0)}
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                         <div className="user-details">
//                                                             <h4>{user.firstName} {user.lastName}</h4>
//                                                             <p>{user.email}</p>
//                                                         </div>
//                                                     </div>
//                                                     <button
//                                                         className="unblock-btn"
//                                                         onClick={() => unblockUser(user._id)}
//                                                     >
//                                                         <FaUnlock /> Unblock
//                                                     </button>
//                                                 </div>
//                                             ))
//                                         }
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {settingsSection === 'applock' && (
//                             <div className="settings-content">
//                                 <div className="settings-back" onClick={() => setSettingsSection('main')}>
//                                     <MdArrowBack /> Back to Settings
//                                 </div>

//                                 <h3 className="section-title">App Lock</h3>

//                                 <div className="app-lock-status">
//                                     <div className="status-icon">
//                                         {appLockType === 'none' ? <FaLockOpen /> : <FaLock />}
//                                     </div>
//                                     <div className="status-details">
//                                         <h4>Current Lock: {appLockType === 'none' ? 'None' : appLockType.toUpperCase()}</h4>
//                                         <p>{appLockType === 'none' ? 'Your app is not secured' : 'Your app is secured'}</p>
//                                     </div>
//                                 </div>

//                                 <div className="lock-options">
//                                     <button
//                                         className={`lock-option ${appLockType === 'none' ? 'active' : ''}`}
//                                         onClick={() => handleSetAppLock('none')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLockOpen />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>None</h4>
//                                             <p>No app lock</p>
//                                         </div>
//                                     </button>

//                                     <button
//                                         className={`lock-option ${appLockType === 'pin' ? 'active' : ''}`}
//                                         onClick={() => handleSetAppLock('pin')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLock />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>PIN</h4>
//                                             <p>6-digit numeric code</p>
//                                         </div>
//                                     </button>

//                                     <button
//                                         className={`lock-option ${appLockType === 'password' ? 'active' : ''}`}
//                                         onClick={() => handleSetAppLock('password')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLock />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>Password</h4>
//                                             <p>At least 4 characters</p>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* App Lock Setup Modal */}
//             {showAppLockSetup && (
//                 <div className="modal-overlay">
//                     <div className="app-lock-modal">
//                         <div className="modal-header">
//                             <h3>Set Airchat App Lock</h3>
//                             <button
//                                 className="close-btn"
//                                 onClick={() => setShowAppLockSetup(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         {appLockStep === 'select' && (
//                             <div className="lock-selection">
//                                 <h4>Select lock type:</h4>
//                                 <div className="lock-options">
//                                     <button
//                                         className="lock-option"
//                                         onClick={() => setAppLockStep('setPin')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLock />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>PIN</h4>
//                                             <p>6-digit numeric code</p>
//                                         </div>
//                                     </button>

//                                     <button
//                                         className="lock-option"
//                                         onClick={() => setAppLockStep('setPassword')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLock />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>Password</h4>
//                                             <p>At least 4 characters</p>
//                                         </div>
//                                     </button>

//                                     <button
//                                         className="lock-option"
//                                         onClick={() => handleSetAppLock('none')}
//                                     >
//                                         <div className="option-icon">
//                                             <FaLockOpen />
//                                         </div>
//                                         <div className="option-details">
//                                             <h4>None</h4>
//                                             <p>Remove app lock</p>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {appLockStep === 'setPin' && (
//                             <div className="pin-setup">
//                                 <h4>Set your PIN</h4>
//                                 <p>Enter a 6-digit PIN</p>

//                                 <div className="input-group">
//                                     <input
//                                         type="password"
//                                         value={newPin}
//                                         onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                         placeholder="New PIN"
//                                     />
//                                 </div>

//                                 <div className="input-group">
//                                     <input
//                                         type="password"
//                                         value={confirmPin}
//                                         onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                         placeholder="Confirm PIN"
//                                     />
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => setAppLockStep('select')}
//                                     >
//                                         Back
//                                     </button>
//                                     <button
//                                         className="confirm-btn"
//                                         onClick={handleSetPin}
//                                         disabled={newPin.length < 6 || confirmPin.length < 6}
//                                     >
//                                         Set PIN
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {appLockStep === 'setPassword' && (
//                             <div className="password-setup">
//                                 <h4>Set your Password</h4>
//                                 <p>At least 4 characters</p>

//                                 <div className="input-group">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         value={newPassword}
//                                         onChange={(e) => setNewPassword(e.target.value)}
//                                         placeholder="New Password"
//                                     />
//                                     <button
//                                         className="toggle-visibility"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                     >
//                                         {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//                                     </button>
//                                 </div>

//                                 <div className="input-group">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         value={confirmPassword}
//                                         onChange={(e) => setConfirmPassword(e.target.value)}
//                                         placeholder="Confirm Password"
//                                     />
//                                     <button
//                                         className="toggle-visibility"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                     >
//                                         {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//                                     </button>
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => setAppLockStep('select')}
//                                     >
//                                         Back
//                                     </button>
//                                     <button
//                                         className="confirm-btn"
//                                         onClick={handleSetPassword}
//                                         disabled={newPassword.length < 4 || confirmPassword.length < 4}
//                                     >
//                                         Set Password
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {appLockStep === 'verifyEmail' && (
//                             <div className="verify-email">
//                                 <h4>Verify Your Identity</h4>
//                                 <p>Enter your email to receive a verification code</p>

//                                 <div className="input-group">
//                                     <input
//                                         type="email"
//                                         value={verificationEmail}
//                                         onChange={(e) => setVerificationEmail(e.target.value)}
//                                         placeholder="Enter your email"
//                                     />
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => setAppLockStep('select')}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         className="confirm-btn"
//                                         onClick={handleSendVerificationCode}
//                                         disabled={!verificationEmail}
//                                     >
//                                         Send Code
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {appLockStep === 'enterCode' && (
//                             <div className="enter-code">
//                                 <h4>Enter Verification Code</h4>
//                                 <p>We sent a code to {verificationEmail}</p>

//                                 <div className="input-group">
//                                     <input
//                                         type="text"
//                                         value={verificationCode}
//                                         onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
//                                         placeholder="4-digit code"
//                                     />
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => setAppLockStep('verifyEmail')}
//                                     >
//                                         Back
//                                     </button>
//                                     <button
//                                         className="confirm-btn"
//                                         onClick={handleVerifyCode}
//                                         disabled={verificationCode.length < 4}
//                                     >
//                                         Verify
//                                     </button>
//                                 </div>

//                                 <div className="resend-link">
//                                     <button onClick={handleSendVerificationCode}>
//                                         Resend code
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* App Unlock Popup */}
//             {showUnlockPopup && (
//                 <div className="unlock-popup">
//                     <div className="popup-content">
//                         <div className="lock-icon">
//                             <FaLock />
//                         </div>

//                         <h3>Unlock AirChat</h3>
//                         <p>Enter your {appLockType === 'pin' ? 'PIN' : 'password'} to continue</p>

//                         <div className="input-group">
//                             <input
//                                 type={appLockType === 'pin' ? "password" : "password"}
//                                 value={unlockInput}
//                                 onChange={(e) => setUnlockInput(e.target.value)}
//                                 placeholder={`Enter your ${appLockType === 'pin' ? 'PIN' : 'password'}`}
//                                 autoFocus
//                             />
//                         </div>

//                         <button
//                             className="unlock-btn"
//                             onClick={handleUnlockApp}
//                         >
//                             Unlock
//                         </button>

//                         <div className="forgot-link">
//                             <button onClick={handleForgotPassword}>
//                                 Forgot {appLockType === 'pin' ? 'PIN' : 'password'}?
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Profile Settings Modal */}
//             {showProfileModal && (
//                 <div className="modal-overlay">
//                     <div className="profile-modal">
//                         <div className="modal-header">
//                             <h2>Edit Profile</h2>
//                             <button className="close-btn" onClick={() => setShowProfileModal(false)}>
//                                 &times;
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             {/* Profile Photo Section */}
//                             <div className="profile-photo-section">
//                                 <div className="photo-preview">
//                                     {profileData.profilePhoto ? (
//                                         <img src={profileData.profilePhoto} alt="Profile" />
//                                     ) : (
//                                         <div className="photo-placeholder">
//                                             <FaUser size={40} />
//                                         </div>
//                                     )}
//                                 </div>
//                                 <button className="upload-btn" onClick={triggerFileInput}>
//                                     <FaCamera /> Change Photo
//                                 </button>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     ref={fileInputRef}
//                                     onChange={handlePhotoChange}
//                                     style={{ display: 'none' }}
//                                 />
//                             </div>

//                             {/* Form Fields */}
//                             <div className="form-group">
//                                 <label>First Name</label>
//                                 <input
//                                     type="text"
//                                     value={profileData.firstName}
//                                     onChange={(e) => handleInputChange('firstName', e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Last Name</label>
//                                 <input
//                                     type="text"
//                                     value={profileData.lastName}
//                                     onChange={(e) => handleInputChange('lastName', e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Email</label>
//                                 <input
//                                     type="email"
//                                     value={profileData.email}
//                                     onChange={(e) => handleInputChange('email', e.target.value)}
//                                     disabled
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Phone Number</label>
//                                 <input
//                                     type="tel"
//                                     value={profileData.phoneNumber}
//                                     onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Age</label>
//                                 <input
//                                     type="number"
//                                     value={profileData.age}
//                                     onChange={(e) => handleInputChange('age', e.target.value)}
//                                     min="13"
//                                     max="120"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Country</label>
//                                 <select
//                                     className="custom-select"
//                                     value={profileData.country}
//                                     onChange={(e) => handleInputChange('country', e.target.value)}
//                                 >
//                                     <option value="">Select Country</option>
//                                     <option value="Australia">Australia</option>
//                                     <option value="Austria">Austria</option>
//                                     <option value="Belgium">Belgium</option>
//                                     <option value="Brazil">Brazil</option>
//                                     <option value="Canada">Canada</option>
//                                     <option value="China">China</option>
//                                     <option value="Denmark">Denmark</option>
//                                     <option value="Egypt">Egypt</option>
//                                     <option value="Finland">Finland</option>
//                                     <option value="France">France</option>
//                                     <option value="Germany">Germany</option>
//                                     <option value="Greece">Greece</option>
//                                     <option value="Hungary">Hungary</option>
//                                     <option value="Iceland">Iceland</option>
//                                     <option value="India">India</option>
//                                     <option value="Indonesia">Indonesia</option>
//                                     <option value="Ireland">Ireland</option>
//                                     <option value="Israel">Israel</option>
//                                     <option value="Italy">Italy</option>
//                                     <option value="Japan">Japan</option>
//                                     <option value="Kenya">Kenya</option>
//                                     <option value="Malaysia">Malaysia</option>
//                                     <option value="Mexico">Mexico</option>
//                                     <option value="Netherlands">Netherlands</option>
//                                     <option value="New Zealand">New Zealand</option>
//                                     <option value="Nigeria">Nigeria</option>
//                                     <option value="Norway">Norway</option>
//                                     <option value="Pakistan">Pakistan</option>
//                                     <option value="Philippines">Philippines</option>
//                                     <option value="Poland">Poland</option>
//                                     <option value="Portugal">Portugal</option>
//                                     <option value="Qatar">Qatar</option>
//                                     <option value="Russia">Russia</option>
//                                     <option value="Saudi Arabia">Saudi Arabia</option>
//                                     <option value="Singapore">Singapore</option>
//                                     <option value="South Africa">South Africa</option>
//                                     <option value="South Korea">South Korea</option>
//                                     <option value="Spain">Spain</option>
//                                     <option value="Sri Lanka">Sri Lanka</option>
//                                     <option value="Sweden">Sweden</option>
//                                     <option value="Switzerland">Switzerland</option>
//                                     <option value="Thailand">Thailand</option>
//                                     <option value="Turkey">Turkey</option>
//                                     <option value="United Arab Emirates">United Arab Emirates</option>
//                                     <option value="United Kingdom">United Kingdom</option>
//                                     <option value="United States">United States</option>
//                                     <option value="Vietnam">Vietnam</option>
//                                     {/* Add more countries as needed */}
//                                 </select>
//                             </div>

//                             {error && <div className="error-message">{error}</div>}
//                             {success && <div className="success-message">{success}</div>}
//                         </div>

//                         <div className="modal-footer">
//                             <button className="cancel-btn" onClick={() => setShowProfileModal(false)}>
//                                 Cancel
//                             </button>
//                             <button
//                                 className="save-btn"
//                                 onClick={handleSaveProfile}
//                                 disabled={saving}
//                             >
//                                 {saving ? 'Saving...' : 'Save Changes'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// ChatPage.defaultProps = {
//     setChatTheme: () => { },
//     blockUser: () => console.warn("blockUser function not provided"),
//     clearChatHistory: () => console.warn("clearChatHistory function not provided")
// };

// export default ChatPage;





import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
    FaSignOutAlt, FaCheck, FaClock, FaTimes, FaArrowUp, FaArrowDown,
    FaPalette, FaImage, FaBan, FaTrash, FaUserPlus, FaBell, FaUserFriends, FaUser, FaCog,
    FaLock, FaUnlock, FaLockOpen, FaRegEye, FaRegEyeSlash, FaCamera, FaSpinner
} from 'react-icons/fa';
import { IoIosSend, IoIosAdd } from 'react-icons/io';
import { MdArrowBack, MdSearch, MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ChatPage.css';



const ChatPage = ({ user: propUser, token, onLogout }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chats');
    const [friends, setFriends] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showFriendOptions, setShowFriendOptions] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [showContactPopup, setShowContactPopup] = useState(false);
    const [showThemePopup, setShowThemePopup] = useState(false);
    const [themeMode, setThemeMode] = useState('default');
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const menuRef = useRef(null);
    const themeRef = useRef(null);

    const BACKEND_URL = "http://localhost:5000";

    const [currentTheme, setCurrentTheme] = useState({});
    const [blockedUsers, setBlockedUsers] = useState(() => {
        const stored = localStorage.getItem("blockedUsers");
        return stored ? JSON.parse(stored) : [];
    });

    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settingsSection, setSettingsSection] = useState('main');
    const [appLockType, setAppLockType] = useState(() => localStorage.getItem('appLockType') || 'none');
    const [appLockValue, setAppLockValue] = useState(() => localStorage.getItem('appLockValue') || '');
    const [showAppLockSetup, setShowAppLockSetup] = useState(false);
    const [appLockStep, setAppLockStep] = useState('select');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [unlockInput, setUnlockInput] = useState('');
    const [showUnlockPopup, setShowUnlockPopup] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [appTheme, setAppTheme] = useState(() => localStorage.getItem('appTheme') || 'system');

    // Profile Edit State
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        age: '',
        profilePhoto: '',
        country: ''
    });


    const [refetchFriends, setRefetchFriends] = useState(false);


    // State to track last read message per friend
    const [lastReadMessages, setLastReadMessages] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('lastReadMessages') || '{}');
        } catch { return {}; }
    });

    // Persist lastReadMessages
    useEffect(() => {
        localStorage.setItem('lastReadMessages', JSON.stringify(lastReadMessages));
    }, [lastReadMessages]);

    // Update lastReadMessages when new messages arrive
    useEffect(() => {
        Object.keys(messages).forEach(friendId => {
            if (activeChat?._id !== friendId) {
                const friendMsgs = messages[friendId] || [];
                if (!friendMsgs.length) return;

                const lastReadId = lastReadMessages[friendId];
                const unreadExists = friendMsgs.some(msg => msg.sender !== propUser.id && (!lastReadId || msg._id > lastReadId));
                if (unreadExists) {
                    setLastReadMessages(prev => ({
                        ...prev,
                        [friendId]: prev[friendId] || null
                    }));
                }
            }
        });
    }, [messages, activeChat?._id, lastReadMessages, propUser.id]);

    // Track last seen time per chat
    const [lastSeenAt, setLastSeenAt] = useState(() => {
        try { return JSON.parse(localStorage.getItem('lastSeenAt') || '{}'); }
        catch { return {}; }
    });

    useEffect(() => {
        localStorage.setItem('lastSeenAt', JSON.stringify(lastSeenAt));
    }, [lastSeenAt]);

    const handleNewMessage = (newMessage) => {
        setMessages(prev => ({
            ...prev,
            [newMessage.senderId]: [...(prev[newMessage.senderId] || []), newMessage]
        }));

        if (newMessage.sender !== propUser.id && activeChat?._id !== newMessage.senderId) {
            console.log(`New unread message from ${newMessage.senderId}`);
        } else if (newMessage.sender === propUser.id || activeChat?._id === newMessage.senderId) {
            setLastReadMessages(prev => ({
                ...prev,
                [newMessage.senderId]: newMessage._id
            }));
        }
    };

    const sendMessage = async (messageText) => {
        if (!messageText.trim() || !activeChat) return;

        const newMessage = {
            _id: Date.now().toString(),
            text: messageText,
            sender: propUser.id,
            receiver: activeChat._id,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => ({
            ...prev,
            [activeChat._id]: [...(prev[activeChat._id] || []), newMessage]
        }));

        setLastReadMessages(prev => ({
            ...prev,
            [activeChat._id]: newMessage._id
        }));
    };

    // App lock check on component mount
    useEffect(() => {
        const checkAppLock = () => {
            const lockType = localStorage.getItem('appLockType');
            const lockValue = localStorage.getItem('appLockValue');

            if (lockType && lockType !== 'none' && lockValue) {
                setShowUnlockPopup(true);
            }
        };

        checkAppLock();
    }, []);

    // Apply theme
    useEffect(() => {
        const applyTheme = () => {
            document.documentElement.classList.remove('dark-theme');
            document.body.classList.remove('dark-theme');

            if (appTheme === 'dark') {
                document.documentElement.classList.add('dark-theme');
                document.body.classList.add('dark-theme');
            } else if (appTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark-theme');
                    document.body.classList.add('dark-theme');
                }
            }
        };

        applyTheme();
        localStorage.setItem('appTheme', appTheme);
    }, [appTheme]);

    useEffect(() => {
        if (activeChat?._id) {
            const themeData = localStorage.getItem('chatThemes');
            const themes = themeData ? JSON.parse(themeData) : {};
            setCurrentTheme(themes[activeChat._id] || {});
        } else {
            setCurrentTheme({});
        }
    }, [activeChat]);

    // Handle mobile animations
    useEffect(() => {
        if (showNotifications) {
            setTimeout(() => setIsMobilePanelOpen(true), 10);
        } else {
            setIsMobilePanelOpen(false);
        }
    }, [showNotifications]);

    useEffect(() => {
        if (showNotifications && window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showNotifications]);

    // Simulate online status
    useEffect(() => {
        const onlineUserIds = new Set([1, 3, 8]);
        setOnlineUsers(onlineUserIds);
    }, []);

    // // Fetch friends
    // useEffect(() => {
    //     const fetchFriends = async () => {
    //         try {
    //             setLoadingFriends(true);
    //             const response = await axios.get('/api/friends', {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });

    //             const filtered = response.data.filter(
    //                 friend => !blockedUsers.includes(friend._id)
    //             );

    //             setFriends(filtered);
    //         } catch (error) {
    //             toast.error('Failed to load friends');
    //             console.error('Error fetching friends:', error);
    //         } finally {
    //             setLoadingFriends(false);
    //         }
    //     };

    //     fetchFriends();
    // }, [propUser.id, blockedUsers, token]);


    // Fetch friends whenever success, blockedUsers, or token changes
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoadingFriends(true);
                const response = await axios.get("/api/friends", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const filtered = response.data.filter(
                    (friend) => !blockedUsers.includes(friend._id)
                );

                const withPhotos = filtered.map((f) => ({
                    ...f,
                    profilePhoto: f.profilePhoto
                        ? `${f.profilePhoto}${f.profilePhoto.includes("?") ? "&" : "?"
                        }t=${Date.now()}`
                        : null,
                }));

                setFriends(withPhotos);
            } catch (error) {
                toast.error("Failed to load friends");
                console.error("Error fetching friends:", error);
            } finally {
                setLoadingFriends(false);
                setRefetchFriends(false);
            }
        };

        fetchFriends();
    }, [propUser.id, blockedUsers, token, refetchFriends]);


    // Add WebSocket listener
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:5000');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'profileUpdated') {
                setFriends((prev) =>
                    prev.map((friend) =>
                        friend._id === data.userId
                            ? { ...friend, profilePhoto: data.profilePhoto }
                            : friend
                    )
                );
            }
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    // Fetch all users
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                const filteredUsers = response.data.filter(u => u._id !== propUser.id);

                const usersWithDefaults = filteredUsers.map(user => ({
                    ...user,
                    profilePhoto: user.profilePhoto || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    country: user.country || ''
                }));

                setAllUsers(usersWithDefaults);
            } catch (error) {
                toast.error('Failed to load users');
                console.error('Error fetching users:', error);
            }
        };

        fetchAllUsers();
    }, [propUser.id]);

    // Fetch friend requests
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get('/api/friend-requests');
                setFriendRequests(response.data);
            } catch (error) {
                toast.error('Failed to load friend requests');
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();
    }, [propUser.id]);

    // Fetch messages when chat selected
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

    // Scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChat]);





    // un lock

    useEffect(() => {
  if (!showUnlockPopup) {
    setAppLockStep(null);
    setVerificationCode('');
    setUnlockInput('');
  }
}, [showUnlockPopup]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleLogout = () => {
        onLogout();
        navigate("/");
    };

    const filteredFriends = friends.filter(friend =>
        `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sendFriendRequest = async (userId) => {
        try {
            await axios.post('/api/friend-requests', { recipientId: userId });
            toast.success('Friend request sent');
            setAllUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, requestSent: true } : u
            ));
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send request';
            toast.error(message);
            console.error('Friend request error:', error.response?.data);
        }
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            await axios.put(`/api/friend-requests/${requestId}`, { status: 'accepted' });
            setFriendRequests(prev => prev.filter(req => req._id !== requestId));
            toast.success('Friend request accepted');
        } catch (error) {
            toast.error('Failed to accept request');
            console.error('Accept error:', error);
        }
    };

    const rejectFriendRequest = async (requestId) => {
        try {
            await axios.put(`/api/friend-requests/${requestId}`, { status: 'rejected' });
            setFriendRequests(prev => prev.filter(req => req._id !== requestId));
            toast.info('Friend request rejected');
        } catch (error) {
            toast.error('Failed to reject request');
            console.error('Reject error:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !activeChat) return;

        if (blockedUsers.includes(activeChat._id)) {
            toast.error(`You cannot send messages to ${activeChat.firstName} because you have blocked them.`);
            return;
        }

        const receiverId = activeChat._id;

        const newMessage = {
            text: message,
            sender: propUser.id,
            receiver: receiverId,
            createdAt: new Date()
        };

        try {
            setIsSending(true);
            const response = await axios.post('/api/messages', newMessage);

            setMessages(prev => ({
                ...prev,
                [receiverId]: [...(prev[receiverId] || []), response.data]
            }));

            setMessage('');
        } catch (error) {
            toast.error('Failed to send message');
            console.error('Error sending message:', error);
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

    // Format message time
    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isUserOnline = (userId) => {
        return onlineUsers.has(String(userId));
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    // View user details
    const viewUserDetails = (user) => {
        setSelectedUser(user);
    };

    const handleClose = () => {
        setShowNotifications(false);
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'auto';
        }
    };

    const handleThemeSelection = () => {
        try {
            if (activeChat && activeChat._id) {
                const themeData = localStorage.getItem('chatThemes');
                const themes = themeData ? JSON.parse(themeData) : {};

                const newTheme = {
                    color: selectedColor || null,
                    wallpaper: selectedWallpaper || null
                };

                themes[activeChat._id] = newTheme;
                localStorage.setItem('chatThemes', JSON.stringify(themes));

                setCurrentTheme(newTheme);
                toast.success("Theme applied successfully");
            }
        } catch (error) {
            console.error("Error saving theme:", error);
            toast.error("Failed to apply theme");
        }
        setShowThemePopup(false);
    };

    const blockUser = async (userId) => {
        try {
            const token = localStorage.getItem("airchat_token");
            if (!token) {
                throw new Error("Missing authentication token");
            }

            const response = await fetch(`${BACKEND_URL}/api/users/block/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                localStorage.removeItem("airchat_token");
                throw new Error("Session expired. Please login again");
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Block request failed");
            }

            return await response.json();
        } catch (error) {
            console.error("Blocking error:", error);
            throw error;
        }
    };

    const handleBlockUser = async () => {
        if (!activeChat?._id) {
            toast.error("No active chat selected");
            return;
        }

        try {
            const token = localStorage.getItem("airchat_token");
            if (!token) {
                toast.error("Please login first");
                return;
            }

            const result = await blockUser(activeChat._id);

            const updatedBlocked = [...blockedUsers, activeChat._id];
            setBlockedUsers(updatedBlocked);
            localStorage.setItem("blockedUsers", JSON.stringify(updatedBlocked));

            setFriends(prev => prev.filter(friend => friend._id !== activeChat._id));
            setActiveChat(null);

            toast.success(result.message);
            setShowMenu(false);
        } catch (err) {
            if (err.message === "Session expired. Please login again") {
                toast.error("Session expired. Please log in again");
                onLogout();
            } else {
                toast.error(err.message || "User blocking failed");
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
            if (themeRef.current && !themeRef.current.contains(e.target)) {
                setShowThemePopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Unlock App
    const handleUnlockApp = () => {
        if (!propUser || !propUser.id) return false;

        const storedValue = localStorage.getItem(`appLockValue_${propUser.id}`);
        const lockType = localStorage.getItem(`appLockType_${propUser.id}`);

        if ((lockType === 'pin' || lockType === 'password') && unlockInput === storedValue) {
            setShowUnlockPopup(false);
            toast.success('App unlocked');
            return true;
        }

        toast.error('Incorrect unlock code');
        return false;
    };

    // Set App Lock
    const handleSetAppLock = (type) => {
        if (!propUser || !propUser.id) return;

        if (type === 'none') {
            localStorage.setItem(`appLockType_${propUser.id}`, 'none');
            localStorage.removeItem(`appLockValue_${propUser.id}`);
            setAppLockType('none');
            toast.success('App lock removed');
            return;
        }

        setAppLockType(type);
        setAppLockStep('select');
        setShowAppLockSetup(true);
    };

    const handleSetPin = () => {
        if (!propUser || !propUser.id) return;

        if (newPin.length < 6) {
            toast.error('PIN must be at least 6 digits');
            return;
        }

        if (newPin !== confirmPin) {
            toast.error('PINs do not match');
            return;
        }

        localStorage.setItem(`appLockType_${propUser.id}`, 'pin');
        localStorage.setItem(`appLockValue_${propUser.id}`, newPin);
        setAppLockType('pin');
        setAppLockValue(newPin);
        setShowAppLockSetup(false);
        toast.success('PIN lock set successfully');
    };

    const handleSetPassword = () => {
        if (!propUser || !propUser.id) return;

        if (newPassword.length < 4) {
            toast.error('Password must be at least 4 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        localStorage.setItem(`appLockType_${propUser.id}`, 'password');
        localStorage.setItem(`appLockValue_${propUser.id}`, newPassword);
        setAppLockType('password');
        setAppLockValue(newPassword);
        setShowAppLockSetup(false);
        toast.success('Password lock set successfully');
    };

const handleForgotPassword = () => {
  setAppLockStep('verifyEmail');
  setVerificationEmail(propUser.email);
};

const handleSendVerificationCode = async () => {
  setIsSendingCode(true);
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    // In real app: Send code to user's email via backend API
    console.log("Verification code:", code); // For development
    toast.info(`Verification code sent to ${propUser.email}`);
    
    // Show code in development mode
    if (process.env.NODE_ENV === 'development') {
      toast.info(`DEV MODE: Your code is ${code}`);
    }
    
    setAppLockStep('enterCode');
    startResendCooldown();
  } catch (error) {
    toast.error('Failed to send verification code');
  } finally {
    setIsSendingCode(false);
  }
};


    // const handleVerifyCode = () => {
    //     if (verificationCode === generatedCode) {
    //         setAppLockStep('select');
    //         toast.success('Verification successful');
    //     } else {
    //         toast.error('Incorrect verification code');
    //     }
    // };

const handleVerifyCode = () => {
  if (verificationCode === generatedCode) {
    toast.success('Verification successful');
    
    // Reset app lock
    localStorage.removeItem(`appLockType_${propUser.id}`);
    localStorage.removeItem(`appLockValue_${propUser.id}`);
    
    // Close popups and reset state
    setShowUnlockPopup(false);
    setAppLockType('none');
    setAppLockStep(null);
    setVerificationCode('');
    setUnlockInput('');
  } else {
    toast.error('Incorrect verification code');
  }
};


const startResendCooldown = () => {
  setResendCooldown(30);
  const timer = setInterval(() => {
    setResendCooldown(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};


const handleResendCode = () => {
  setVerificationCode('');
  handleSendVerificationCode();
};






    const handleThemeChange = (theme) => {
        setAppTheme(theme);
        localStorage.setItem('appTheme', theme);
        toast.success(`Theme set to ${theme}`);
    };

    const unblockUser = (userId) => {
        const updatedBlocked = blockedUsers.filter(id => id !== userId);
        setBlockedUsers(updatedBlocked);
        localStorage.setItem('blockedUsers', JSON.stringify(updatedBlocked));

        const unblockedUser = allUsers.find(u => u._id === userId);
        if (unblockedUser) {
            setFriends(prev => [...prev, unblockedUser]);
        }

        toast.success('User unblocked successfully');
    };

    // On App load, check lock status
    useEffect(() => {
        if (!propUser || !propUser.id) return;

        const lockType = localStorage.getItem(`appLockType_${propUser.id}`);
        if (lockType && lockType !== 'none') {
            setShowUnlockPopup(true);
        } else {
            setShowUnlockPopup(false);
        }
    }, [propUser]);

    // Fetch user data for profile
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('airchat_token');
            if (!token) throw new Error('No token found. Please login.');

            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userData = response.data;

            setProfileData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phoneNumber: userData.phoneNumber || '',
                age: userData.age || '',
                profilePhoto: userData.profilePhoto
                    ? `http://localhost:5000${userData.profilePhoto}`
                    : '',
                country: userData.country || ''
            });

            setLoading(false);
        } catch (err) {
            console.error('Fetch profile error:', err.response?.data || err.message);
            setError('Failed to load profile data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const [selectedFile, setSelectedFile] = useState(null);
const [isSendingCode, setIsSendingCode] = useState(false);
const [resendCooldown, setResendCooldown] = useState(0);

    // Handle photo upload
    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setProfileData({
                ...profileData,
                profilePhoto: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleSaveProfile = async (profileData, file) => {
        try {
            setSaving(true);
            const token = localStorage.getItem("airchat_token");
            const formData = new FormData();

            formData.append("firstName", profileData.firstName);
            formData.append("lastName", profileData.lastName);
            formData.append("phoneNumber", profileData.phoneNumber);
            formData.append("age", profileData.age);
            formData.append("country", profileData.country);

            if (file) formData.append("profilePhoto", file);

            const response = await axios.put(
                "http://localhost:5000/api/users/update-profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data?.user) {
                const updatedUser = response.data.user;
                localStorage.setItem("airchat_user", JSON.stringify(updatedUser));
                setProfileData(updatedUser);
                toast.success("Profile updated successfully!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };








    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="airchat-container">
            {/* Sidebar */}
            {(showSidebar || window.innerWidth > 768) && (
                <div className="sidebar">
                    <div className="sidebar-header">
                        <div className="app-logo">
                            <span className="logo-text">AirChat</span>
                        </div>
                        <div className="header-actions">
                            <button
                                className="icon-btn notification-btn"
                                onClick={() => setShowNotifications(!showNotifications)}
                                title="Notifications"
                            >
                                <FaBell />
                                {friendRequests.length > 0 && (
                                    <span className="notification-badge">{friendRequests.length}</span>
                                )}
                            </button>
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
                        <button
                            className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
                            onClick={() => setActiveTab('status')}
                        >
                            STATUS
                        </button>
                    </div>

                    <div className="chats-list">
                        {loadingFriends ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : filteredFriends.length === 0 ? (
                            <div className="text-center py-4">
                                <p>No friends found</p>
                            </div>
                        ) : (
                            filteredFriends.map(friend => {
                                const friendMsgs = messages[friend._id] || [];
                                const lastReadId = lastReadMessages[friend._id];
                                const lastReadIndex = lastReadId
                                    ? friendMsgs.findIndex(msg => msg._id === lastReadId)
                                    : -1;

                                const unreadCount = friendMsgs
                                    .slice(lastReadIndex + 1)
                                    .filter(msg => msg.sender !== propUser.id).length;

                                const isActive = activeChat?._id === friend._id;
                                const isOnline = isUserOnline(friend._id);

                                return (
                                    <div
                                        key={friend._id}
                                        className={`chat-item ${isActive ? 'active' : ''}`}
                                        onClick={() => {
                                            const fullUser = allUsers.find(u => u._id === friend._id) || friend;
                                            setActiveChat({ ...fullUser });

                                            if (window.innerWidth <= 768) {
                                                setShowSidebar(false);
                                            }

                                            if (friendMsgs.length) {
                                                const lastMsg = friendMsgs[friendMsgs.length - 1];
                                                setLastReadMessages(prev => ({
                                                    ...prev,
                                                    [friend._id]: lastMsg._id
                                                }));
                                            }
                                        }}
                                    >
                                        <div className="avatar">
                                            {friend.profilePhoto ? (
                                                <img
                                                    src={friend.profilePhoto}
                                                    alt={`${friend.firstName} ${friend.lastName}`}
                                                />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {friend.firstName.charAt(0)}
                                                </div>
                                            )}
                                            {isOnline && <span className="online-badge"></span>}
                                        </div>


                                        <div className="chat-info">
                                            <div className="chat-header">
                                                <div className="user-name">{friend.firstName} {friend.lastName}</div>
                                                {!isActive && unreadCount > 0 && (
                                                    <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Friend Options Toggle */}
                    <div className="friend-options-toggle">
                        <button
                            className="toggle-btn"
                            onClick={() => setShowFriendOptions(!showFriendOptions)}
                        >
                            <IoIosAdd />
                        </button>

                        {showFriendOptions && (
                            <div className="friend-options">
                                <button
                                    className="friend-option-btn"
                                    onClick={() => {
                                        setShowAddFriendModal(true);
                                        setShowFriendOptions(false);
                                    }}
                                >
                                    <FaUserPlus /> Add Friend
                                </button>

                                <button
                                    className="friend-option-btn"
                                    onClick={() => {
                                        setShowProfileModal(true);
                                        setShowFriendOptions(false);
                                    }}
                                >
                                    <FaUser /> Profile
                                </button>

                                <button
                                    className="friend-option-btn"
                                    onClick={() => {
                                        setShowSettingsModal(true);
                                        setShowFriendOptions(false);
                                    }}
                                >
                                    <FaCog /> Settings
                                </button>

                                <button
                                    className="friend-option-btn"
                                    onClick={() => setShowFriendOptions(false)}
                                >
                                    <MdArrowBack /> Back
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Chat Area */}
            <div className={`main-chat-area ${!showSidebar && window.innerWidth <= 768 ? 'expanded' : ''}`}>
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <div className="header-left">
                                {window.innerWidth <= 768 && (
                                    <button
                                        className="back-btn"
                                        onClick={() => {
                                            setShowSidebar(true);
                                            setActiveChat(null);
                                        }}
                                    >
                                        <MdArrowBack />
                                    </button>
                                )}

                                <div className="chat-partner">
                                    <div className="avatar">
                                        {activeChat.profilePhoto ? (
                                            <img
                                                src={activeChat.profilePhoto}
                                                alt={`${activeChat.firstName} ${activeChat.lastName}`}
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {activeChat.firstName?.charAt(0)}
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
                                                <span>Offline</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="header-actions">
                                <div className="menu-container" ref={menuRef}>
                                    <button
                                        className="icon-btn"
                                        onClick={() => setShowMenu(!showMenu)}
                                    >
                                        <FaEllipsisV />
                                    </button>

                                    {showMenu && (
                                        <div className="menu-popup">
                                            <button onClick={() => {
                                                setShowContactPopup(true);
                                                setShowMenu(false);
                                            }}>
                                                View Contact
                                            </button>
                                            <button onClick={() => {
                                                setShowThemePopup(true);
                                                setShowMenu(false);
                                            }}>
                                                Chat Theme
                                            </button>
                                            <button
                                            >
                                                Lock Contact
                                            </button>
                                            <button
                                            >
                                                Hide Contact
                                            </button>
                                            <button onClick={handleBlockUser}>
                                                Block User
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Popup */}
                            {showContactPopup && activeChat && (
                                <div className="contact-popup">
                                    <div className="popup-content">
                                        <button
                                            className="close-popup"
                                            onClick={() => setShowContactPopup(false)}
                                        >
                                            <MdClose />
                                        </button>

                                        <div className="contact-header">
                                            <div className="contact-avatar">
                                                {activeChat.profilePhoto ? (
                                                    <img
                                                        src={activeChat.profilePhoto}
                                                        alt={`${activeChat.firstName} ${activeChat.lastName}`}
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder large">
                                                        {activeChat.firstName?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <h3>{activeChat.firstName} {activeChat.lastName}</h3>
                                        </div>

                                        <div className="contact-details">
                                            <div className="detail-item">
                                                <label>Email:</label>
                                                <span>{activeChat.email || 'Not provided'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Phone:</label>
                                                <span>{activeChat.phoneNumber || 'Not provided'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Country:</label>
                                                <span>{activeChat.country || 'Not provided'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Status:</label>
                                                <span>
                                                    {isUserOnline(activeChat._id)
                                                        ? 'Online'
                                                        : 'Offline'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Theme Popup */}
                            {showThemePopup && (
                                <div className="theme-popup" ref={themeRef}>
                                    <div className="popup-content">
                                        <button
                                            className="close-popup"
                                            onClick={() => setShowThemePopup(false)}
                                        >
                                            <MdClose />
                                        </button>

                                        <h3>Chat Theme</h3>

                                        <div className="theme-tabs">
                                            <button
                                                className={themeMode === 'color' ? 'active' : ''}
                                                onClick={() => setThemeMode('color')}
                                            >
                                                Color Theme
                                            </button>
                                            <button
                                                className={themeMode === 'wallpaper' ? 'active' : ''}
                                                onClick={() => setThemeMode('wallpaper')}
                                            >
                                                Wallpaper
                                            </button>
                                        </div>

                                        <div className="theme-content">
                                            {themeMode === 'color' ? (
                                                <div className="color-themes">
                                                    <h4>Select a color theme:</h4>
                                                    <div className="color-grid">
                                                        {['#f0f8ff', '#fff0f5', '#f5f5dc', '#e6e6fa', '#f0fff0', '#fffacd'].map(color => (
                                                            <div
                                                                key={color}
                                                                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                                                                style={{ backgroundColor: color }}
                                                                onClick={() => setSelectedColor(color)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="wallpaper-themes">
                                                    <h4>Select a wallpaper:</h4>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) {
                                                                const reader = new FileReader();
                                                                reader.onload = (event) => {
                                                                    setSelectedWallpaper(event.target.result);
                                                                };
                                                                reader.readAsDataURL(e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    {selectedWallpaper && (
                                                        <div className="wallpaper-preview">
                                                            <img src={selectedWallpaper} alt="Wallpaper preview" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="theme-actions">
                                            <button
                                                className="cancel-btn"
                                                onClick={() => setShowThemePopup(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="confirm-btn"
                                                onClick={handleThemeSelection}
                                                disabled={!selectedColor && !selectedWallpaper}
                                            >
                                                Apply Theme
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="chat-messages"
                            style={{
                                backgroundColor: currentTheme.color || '#d9fdd3',
                                backgroundImage: currentTheme.wallpaper
                                    ? `url(${currentTheme.wallpaper})`
                                    : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
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
                                messages[activeChat._id]?.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`message ${msg.sender === propUser.id ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            {msg.text}
                                        </div>
                                        <div className="message-meta">
                                            <div className="message-time">
                                                {formatMessageTime(msg.createdAt)}
                                            </div>
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
                            <h2>Welcome, {propUser.name}</h2>
                            <p>Select a chat to start messaging</p>
                            <p>Or start a new conversation</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Friend Modal */}
            {showAddFriendModal && (
                <div className="modal-overlay">
                    <div className="add-friend-modal">
                        <div className="modal-header">
                            <h3>Add Friends</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowAddFriendModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-content">
                            {allUsers
                                .filter(u =>
                                    !friends.some(f => f._id === u._id) &&
                                    !friendRequests.some(r => r.senderId === u._id)
                                )
                                .map(user => (
                                    <div key={user._id} className="user-item">
                                        <div className="user-avatar">
                                            {user.profilePhoto ? (
                                                <img src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {user.firstName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="user-info">
                                            <div className="user-name">{user.firstName} {user.lastName}</div>
                                        </div>
                                        <div className="user-actions">
                                            <button
                                                className="view-btn"
                                                onClick={() => viewUserDetails(user)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className={`add-btn ${user.requestSent ? 'sent' : ''}`}
                                                onClick={() => sendFriendRequest(user._id)}
                                                disabled={user.requestSent}
                                            >
                                                {user.requestSent ? 'Request Sent' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="modal-overlay">
                    <div className="user-detail-modal">
                        <div className="modal-header">
                            <h3>User Details</h3>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedUser(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="user-avatar-large">
                                {selectedUser.profilePhoto ? (
                                    // <img src={selectedUser.profilePhoto} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
                                    <img
                                        src={
                                            selectedUser.profilePhoto?.startsWith('http')
                                                ? selectedUser.profilePhoto
                                                : `http://localhost:5000${selectedUser.profilePhoto}`
                                        }
                                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                    />
                                ) : (
                                    <div className="avatar-placeholder large">
                                        {selectedUser.firstName.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="user-details">
                                <div className="detail-item">
                                    <span className="detail-label">First Name:</span>
                                    <span className="detail-value">{selectedUser.firstName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Last Name:</span>
                                    <span className="detail-value">{selectedUser.lastName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Country:</span>
                                    <span className="detail-value">{selectedUser.country || 'Unknown'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Email:</span>
                                    <span className="detail-value">{selectedUser.email}</span>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="close-detail-btn"
                                    onClick={() => setSelectedUser(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Panel */}
            <div
                className={`notifications-backdrop ${showNotifications ? 'active' : ''}`}
                onClick={() => setShowNotifications(false)}
            />

            <div className={`notifications-panel ${showNotifications ? 'active' : ''}`}>
                <div className="panel-header">
                    <h3>Friend Requests</h3>
                    <button
                        className="close-btn"
                        onClick={handleClose}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="panel-content">
                    {friendRequests.length === 0 ? (
                        <div className="no-requests">
                            <p>No pending friend requests</p>
                        </div>
                    ) : (
                        friendRequests.map(request => (
                            <div key={request._id} className="request-item">
                                <div className="request-main">
                                    <div className="request-avatar">
                                        {request.requester?.profilePhoto ? (
                                            <img
                                                src={request.requester.profilePhoto}
                                                alt={`${request.requester.firstName} ${request.requester.lastName}`}
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {request.requester?.firstName?.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="request-details">
                                        <div className="request-name">
                                            {request.requester?.firstName} {request.requester?.lastName}
                                        </div>
                                        <div className="request-message">
                                            Wants to be your friend
                                        </div>
                                    </div>
                                </div>

                                <div className="request-actions">
                                    <button
                                        className="accept-btn"
                                        onClick={() => acceptFriendRequest(request._id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() => rejectFriendRequest(request._id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="modal-overlay">
                    <div className="settings-modal">
                        <div className="modal-header">
                            <h3>Settings</h3>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowSettingsModal(false);
                                    setSettingsSection('main');
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {settingsSection === 'main' && (
                            <div className="settings-content">
                                <div className="settings-option" onClick={() => setSettingsSection('blocked')}>
                                    <div className="option-icon">
                                        <FaBan />
                                    </div>
                                    <div className="option-details">
                                        <h4>Blocked Users</h4>
                                        <p>Manage blocked contacts</p>
                                    </div>
                                    <div className="option-arrow">
                                        <MdArrowBack style={{ transform: 'rotate(180deg)' }} />
                                    </div>
                                </div>

                                <div className="settings-option" onClick={() => setSettingsSection('applock')}>
                                    <div className="option-icon">
                                        <FaLock />
                                    </div>
                                    <div className="option-details">
                                        <h4>App Lock</h4>
                                        <p>{appLockType === 'none' ? 'Not set' : `${appLockType} lock enabled`}</p>
                                    </div>
                                    <div className="option-arrow">
                                        <MdArrowBack style={{ transform: 'rotate(180deg)' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {settingsSection === 'blocked' && (
                            <div className="settings-content">
                                <div className="settings-back" onClick={() => setSettingsSection('main')}>
                                    <MdArrowBack /> Back to Settings
                                </div>

                                <h3 className="section-title">Blocked Users</h3>

                                {blockedUsers.length === 0 ? (
                                    <div className="no-blocked-users">
                                        <p>No blocked users</p>
                                    </div>
                                ) : (
                                    <div className="blocked-users-list">
                                        {allUsers
                                            .filter(u => blockedUsers.includes(u._id))
                                            .map(user => (
                                                <div key={user._id} className="blocked-user-item">
                                                    <div className="user-info">
                                                        <div className="avatar">
                                                            {user.profilePhoto ? (
                                                                <img src={user.profilePhoto} alt={user.firstName} />
                                                            ) : (
                                                                <div className="avatar-placeholder">
                                                                    {user.firstName.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="user-details">
                                                            <h4>{user.firstName} {user.lastName}</h4>
                                                            <p>{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="unblock-btn"
                                                        onClick={() => unblockUser(user._id)}
                                                    >
                                                        <FaUnlock /> Unblock
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        )}

                        {settingsSection === 'applock' && (
                            <div className="settings-content">
                                <div className="settings-back" onClick={() => setSettingsSection('main')}>
                                    <MdArrowBack /> Back to Settings
                                </div>

                                <h3 className="section-title">App Lock</h3>

                                <div className="app-lock-status">
                                    <div className="status-icon">
                                        {appLockType === 'none' ? <FaLockOpen /> : <FaLock />}
                                    </div>
                                    <div className="status-details">
                                        <h4>Current Lock: {appLockType === 'none' ? 'None' : appLockType.toUpperCase()}</h4>
                                        <p>{appLockType === 'none' ? 'Your app is not secured' : 'Your app is secured'}</p>
                                    </div>
                                </div>

                                <div className="lock-options">
                                    <button
                                        className={`lock-option ${appLockType === 'none' ? 'active' : ''}`}
                                        onClick={() => handleSetAppLock('none')}
                                    >
                                        <div className="option-icon">
                                            <FaLockOpen />
                                        </div>
                                        <div className="option-details">
                                            <h4>None</h4>
                                            <p>No app lock</p>
                                        </div>
                                    </button>

                                    <button
                                        className={`lock-option ${appLockType === 'pin' ? 'active' : ''}`}
                                        onClick={() => handleSetAppLock('pin')}
                                    >
                                        <div className="option-icon">
                                            <FaLock />
                                        </div>
                                        <div className="option-details">
                                            <h4>PIN</h4>
                                            <p>6-digit numeric code</p>
                                        </div>
                                    </button>

                                    <button
                                        className={`lock-option ${appLockType === 'password' ? 'active' : ''}`}
                                        onClick={() => handleSetAppLock('password')}
                                    >
                                        <div className="option-icon">
                                            <FaLock />
                                        </div>
                                        <div className="option-details">
                                            <h4>Password</h4>
                                            <p>At least 4 characters</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* App Lock Setup Modal */}
            {showAppLockSetup && (
                <div className="modal-overlay">
                    <div className="app-lock-modal">
                        <div className="modal-header">
                            <h3>Set Airchat App Lock</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowAppLockSetup(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {appLockStep === 'select' && (
                            <div className="lock-selection">
                                <h4>Select lock type:</h4>
                                <div className="lock-options">
                                    <button
                                        className="lock-option"
                                        onClick={() => setAppLockStep('setPin')}
                                    >
                                        <div className="option-icon">
                                            <FaLock />
                                        </div>
                                        <div className="option-details">
                                            <h4>PIN</h4>
                                            <p>6-digit numeric code</p>
                                        </div>
                                    </button>

                                    <button
                                        className="lock-option"
                                        onClick={() => setAppLockStep('setPassword')}
                                    >
                                        <div className="option-icon">
                                            <FaLock />
                                        </div>
                                        <div className="option-details">
                                            <h4>Password</h4>
                                            <p>At least 4 characters</p>
                                        </div>
                                    </button>

                                    <button
                                        className="lock-option"
                                        onClick={() => handleSetAppLock('none')}
                                    >
                                        <div className="option-icon">
                                            <FaLockOpen />
                                        </div>
                                        <div className="option-details">
                                            <h4>None</h4>
                                            <p>Remove app lock</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {appLockStep === 'setPin' && (
                            <div className="pin-setup">
                                <h4>Set your PIN</h4>
                                <p>Enter a 6-digit PIN</p>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        value={newPin}
                                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="New PIN"
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="Confirm PIN"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setAppLockStep('select')}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="confirm-btn"
                                        onClick={handleSetPin}
                                        disabled={newPin.length < 6 || confirmPin.length < 6}
                                    >
                                        Set PIN
                                    </button>
                                </div>
                            </div>
                        )}

                        {appLockStep === 'setPassword' && (
                            <div className="password-setup">
                                <h4>Set your Password</h4>
                                <p>At least 4 characters</p>

                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New Password"
                                    />
                                    <button
                                        className="toggle-visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>

                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                    />
                                    <button
                                        className="toggle-visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setAppLockStep('select')}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="confirm-btn"
                                        onClick={handleSetPassword}
                                        disabled={newPassword.length < 4 || confirmPassword.length < 4}
                                    >
                                        Set Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {appLockStep === 'verifyEmail' && (
                            <div className="verify-email">
                                <h4>Verify Your Identity</h4>
                                <p>Enter your email to receive a verification code</p>

                                <div className="input-group">
                                    <input
                                        type="email"
                                        value={verificationEmail}
                                        onChange={(e) => setVerificationEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setAppLockStep('select')}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="confirm-btn"
                                        onClick={handleSendVerificationCode}
                                        disabled={!verificationEmail}
                                    >
                                        Send Code
                                    </button>
                                </div>
                            </div>
                        )}

                        {appLockStep === 'enterCode' && (
                            <div className="enter-code">
                                <h4>Enter Verification Code</h4>
                                <p>We sent a code to {verificationEmail}</p>

                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        placeholder="4-digit code"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setAppLockStep('verifyEmail')}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="confirm-btn"
                                        onClick={handleVerifyCode}
                                        disabled={verificationCode.length < 4}
                                    >
                                        Verify
                                    </button>
                                </div>

                                <div className="resend-link">
                                    <button onClick={handleSendVerificationCode}>
                                        Resend code
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* App Unlock Popup */}
            {/* {showUnlockPopup && (
                <div className="unlock-popup">
                    <div className="popup-content">
                        <div className="lock-icon">
                            <FaLock />
                        </div>

                        <h3>Unlock AirChat</h3>
                        <p>Enter your {appLockType === 'pin' ? 'PIN' : 'password'} to continue</p>

                        <div className="input-group">
                            <input
                                type={appLockType === 'pin' ? "password" : "password"}
                                value={unlockInput}
                                onChange={(e) => setUnlockInput(e.target.value)}
                                placeholder={`Enter your ${appLockType === 'pin' ? 'PIN' : 'password'}`}
                                autoFocus
                            />
                        </div>

                        <button
                            className="unlock-btn"
                            onClick={handleUnlockApp}
                        >
                            Unlock
                        </button>

                        <div className="forgot-link">
                            <button onClick={handleForgotPassword}>
                                Forgot {appLockType === 'pin' ? 'PIN' : 'password'}?
                            </button>
                        </div>
                    </div>
                </div>
            )} */}



{/* App Unlock Popup */}
{showUnlockPopup && (
  <div className="unlock-popup">
    <div className="popup-content">
      {/* Forgot Password Flow: Email Verification */}
      {appLockStep === 'verifyEmail' && (
        <div>
          <h3>Verify Your Email</h3>
          <p>A verification code will be sent to:</p>
          <div className="email-display">
            <strong>{propUser.email}</strong>
          </div>
          
          <button 
            className="unlock-btn" 
            onClick={handleSendVerificationCode}
            disabled={isSendingCode}
          >
            {isSendingCode ? (
              <>
                <FaSpinner className="spinner" /> Sending...
              </>
            ) : 'Send Verification Code'}
          </button>
          
          <div className="forgot-link">
            <button onClick={() => setAppLockStep(null)}>
              Back to Unlock
            </button>
          </div>
        </div>
      )}


      {/* Forgot Password Flow: Code Verification */}
      {appLockStep === 'enterCode' && (
        <div>
          <h3>Enter Verification Code</h3>
          <p>Check your email at <strong>{propUser.email}</strong></p>
          
          <div className="input-group">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              autoFocus
              maxLength={6}
            />
          </div>
          
          <button 
            className="unlock-btn" 
            onClick={handleVerifyCode}
            disabled={!verificationCode || verificationCode.length < 6}
          >
            Verify Code
          </button>
          
          <div className="resend-link">
            <button onClick={handleResendCode} disabled={resendCooldown > 0}>
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : 'Resend Code'}
            </button>
          </div>
          
          <div className="forgot-link">
            <button onClick={() => setAppLockStep('verifyEmail')}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* Default Unlock Screen */}
      {!appLockStep && (
        <div>
          <div className="lock-icon">
            <FaLock />
          </div>
          <h3>Unlock AirChat</h3>
          <p>Enter your {appLockType === 'pin' ? 'PIN' : 'password'} to continue</p>
          
          <div className="input-group">
            <input
              type={appLockType === 'pin' ? "password" : "password"}
              value={unlockInput}
              onChange={(e) => setUnlockInput(e.target.value)}
              placeholder={`Enter your ${appLockType === 'pin' ? 'PIN' : 'password'}`}
              autoFocus
            />
          </div>

          <button
            className="unlock-btn"
            onClick={handleUnlockApp}
            disabled={!unlockInput}
          >
            Unlock
          </button>

          <div className="forgot-link">
            <button onClick={handleForgotPassword}>
              Forgot {appLockType === 'pin' ? 'PIN' : 'password'}?
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}


            {/* Profile Settings Modal */}
            {showProfileModal && (
                <div className="modal-overlay">
                    <div className="profile-modal">
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button className="close-btn" onClick={() => setShowProfileModal(false)}>
                                &times;
                            </button>
                        </div>

                        <div className="modal-content">
                            {/* Profile Photo Section */}
                            <div className="profile-photo-section">
                                <div className="photo-preview">
                                    {profileData.profilePhoto ? (
                                        <img src={profileData.profilePhoto} alt="Profile" />
                                    ) : (
                                        <div className="photo-placeholder">
                                            <FaUser size={40} />
                                        </div>
                                    )}
                                </div>
                                <button className="upload-btn" onClick={triggerFileInput}>
                                    <FaCamera /> Change Photo
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handlePhotoChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Form Fields */}
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={profileData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={profileData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={profileData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Age</label>
                                <input
                                    type="number"
                                    value={profileData.age}
                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                    min="13"
                                    max="120"
                                />
                            </div>

                            <div className="form-group">
                                <label>Country</label>
                                <select
                                    className="custom-select"
                                    value={profileData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                >
                                    <option value="">Select Country</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Austria">Austria</option>
                                    <option value="Belgium">Belgium</option>
                                    <option value="Brazil">Brazil</option>
                                    <option value="Canada">Canada</option>
                                    <option value="China">China</option>
                                    <option value="Denmark">Denmark</option>
                                    <option value="Egypt">Egypt</option>
                                    <option value="Finland">Finland</option>
                                    <option value="France">France</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Greece">Greece</option>
                                    <option value="Hungary">Hungary</option>
                                    <option value="Iceland">Iceland</option>
                                    <option value="India">India</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Ireland">Ireland</option>
                                    <option value="Israel">Israel</option>
                                    <option value="Italy">Italy</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Kenya">Kenya</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Mexico">Mexico</option>
                                    <option value="Netherlands">Netherlands</option>
                                    <option value="New Zealand">New Zealand</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="Norway">Norway</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="Philippines">Philippines</option>
                                    <option value="Poland">Poland</option>
                                    <option value="Portugal">Portugal</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Russia">Russia</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="South Africa">South Africa</option>
                                    <option value="South Korea">South Korea</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Sri Lanka">Sri Lanka</option>
                                    <option value="Sweden">Sweden</option>
                                    <option value="Switzerland">Switzerland</option>
                                    <option value="Thailand">Thailand</option>
                                    <option value="Turkey">Turkey</option>
                                    <option value="United Arab Emirates">United Arab Emirates</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="United States">United States</option>
                                    <option value="Vietnam">Vietnam</option>
                                </select>
                            </div>

                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowProfileModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="save-btn"
                                onClick={() => handleSaveProfile(profileData, selectedFile)}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ChatPage.defaultProps = {
    setChatTheme: () => { },
    blockUser: () => console.warn("blockUser function not provided"),
    clearChatHistory: () => console.warn("clearChatHistory function not provided")
};

export default ChatPage;
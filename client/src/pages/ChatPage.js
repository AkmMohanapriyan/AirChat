

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



import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile,
  FaSignOutAlt, FaCheck, FaClock, FaTimes, FaArrowUp, FaArrowDown,
  FaPalette, FaImage, FaBan, FaTrash, FaUserPlus, FaBell, FaUserFriends
} from 'react-icons/fa';
import { IoIosSend, IoIosAdd } from 'react-icons/io';
import { MdArrowBack } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ChatPage.css';

const ChatPage = ({ user, onLogout }) => {
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

  // Simulate online status
  useEffect(() => {
    const onlineUserIds = new Set(['1', '3', '8']);
    setOnlineUsers(onlineUserIds);
  }, []);

  // Fetch friends from the database
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoadingFriends(true);
        // This would be replaced with actual API call to get friends
        const response = await axios.get('/api/friends');
        setFriends(response.data);
      } catch (error) {
        toast.error('Failed to load friends');
        console.error('Error fetching friends:', error);
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [user.id]);

  // Fetch all users for add friend modal
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setAllUsers(response.data.filter(u => u._id !== user.id));
      } catch (error) {
        toast.error('Failed to load users');
        console.error('Error fetching users:', error);
      }
    };

    fetchAllUsers();
  }, [user.id]);

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

  const filteredFriends = friends.filter(friend =>
    `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post('/api/friend-requests', { receiverId: userId });
      toast.success('Friend request sent');
      // Update UI to show request sent
      setAllUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, requestSent: true } : u
      ));
    } catch (error) {
      toast.error('Failed to send friend request');
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (requestId, senderId) => {
    try {
      await axios.put(`/api/friend-requests/${requestId}/accept`);
      // Add to friends list
      const newFriend = allUsers.find(u => u._id === senderId);
      setFriends(prev => [...prev, newFriend]);
      // Remove from requests
      setFriendRequests(prev => prev.filter(req => req._id !== requestId));
      toast.success('Friend request accepted');
    } catch (error) {
      toast.error('Failed to accept friend request');
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await axios.delete(`/api/friend-requests/${requestId}`);
      setFriendRequests(prev => prev.filter(req => req._id !== requestId));
      toast.info('Friend request rejected');
    } catch (error) {
      toast.error('Failed to reject friend request');
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    const receiverId = activeChat._id;

    const newMessage = {
      text: message,
      sender: user.id,
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

  // Format time for messages
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // View user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="airchat-container">
      {/* Sidebar - Only show on large screens or when toggled on mobile */}
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

          <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search friends"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                const lastMessage = messages[friend._id]?.[messages[friend._id]?.length - 1];
                const isOnline = isUserOnline(friend._id);

                return (
                  <div
                    key={friend._id}
                    className={`chat-item ${activeChat?._id === friend._id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveChat(friend);
                      if (window.innerWidth <= 768) setShowSidebar(false);
                    }}
                  >
                    <div className="avatar">
                      {friend.profilePhoto ? (
                        <img src={friend.profilePhoto} alt={`${friend.firstName} ${friend.lastName}`} />
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
                        <div className="last-seen">
                          {isOnline ? (
                            <span className="online-text">Online</span>
                          ) : (
                            <span>Offline</span>
                          )}
                        </div>
                      </div>
                      <div className="last-message-container">
                        {lastMessage ? (
                          <>
                            <div className="last-message-text">
                              {lastMessage.text}
                            </div>
                            <div className="last-message-time">
                              {formatMessageTime(lastMessage.createdAt)}
                            </div>
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
                      <span>Offline</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="header-actions">
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
                messages[activeChat._id]?.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
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
              <h2>Welcome, {user.name}</h2>
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
                      <div className="user-country">{user.country || 'Unknown'}</div>
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
                  <img src={selectedUser.profilePhoto} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
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
      {showNotifications && (
        <div className="notifications-panel">
          <div className="panel-header">
            <h3>Friend Requests</h3>
            <button 
              className="close-btn" 
              onClick={() => setShowNotifications(false)}
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
                  <div className="request-avatar">
                    {request.sender.profilePhoto ? (
                      <img src={request.sender.profilePhoto} alt={`${request.sender.firstName} ${request.sender.lastName}`} />
                    ) : (
                      <div className="avatar-placeholder">
                        {request.sender.firstName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="request-info">
                    <div className="request-name">
                      {request.sender.firstName} {request.sender.lastName}
                    </div>
                    <div className="request-message">
                      Wants to be your friend
                    </div>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="accept-btn"
                      onClick={() => acceptFriendRequest(request._id, request.sender._id)}
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
      )}
    </div>
  );
};

export default ChatPage;
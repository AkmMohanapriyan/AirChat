// import { Routes, Route } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import SplashScreen from './components/SplashScreen';
// import HomePage from './pages/HomePage';
// import './App.css';
// import AuthModal from './components/AuthModal';


// function App() {
//   const [loading, setLoading] = useState(true);

//     const [showAuthModal, setShowAuthModal] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return <SplashScreen />;
//   }

//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//       </Routes>

//             <AuthModal 
//         show={showAuthModal} 
//         onHide={() => setShowAuthModal(false)} 
//       />
//     </div>
//   );
// }

// export default App;


// src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { toast } from 'react-toastify';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    // Check if user is authenticated (in a real app, you would verify the token)
    const token = localStorage.getItem('airchat_token');
    const userData = localStorage.getItem('airchat_user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (userData) => {
    // In a real app, you would set tokens here
    localStorage.setItem('airchat_token', 'dummy_token');
    localStorage.setItem('airchat_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    toast.success("Logged in successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem('airchat_token');
    localStorage.removeItem('airchat_user');
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Logged out successfully!");
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          isAuthenticated ? 
            <Navigate to="/chat" /> : 
            <HomePage onLoginSuccess={handleLoginSuccess} />
        } />
        <Route path="/chat" element={
          isAuthenticated ? 
            <ChatPage user={user} onLogout={handleLogout} /> : 
            <Navigate to="/" />
        } />
      </Routes>
    </div>
  );
}

export default App;
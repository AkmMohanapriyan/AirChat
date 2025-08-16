


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
    
    // Check if user is authenticated
    const token = localStorage.getItem('airchat_token');
    const userData = localStorage.getItem('airchat_user');
    
    // Handle case where userData might be undefined or invalid
    if (token) {
      try {
        // Only parse if userData exists
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('airchat_token');
        localStorage.removeItem('airchat_user');
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (userData) => {
    if (userData) {
      localStorage.setItem('airchat_token', 'dummy_token');
      localStorage.setItem('airchat_user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      toast.success("Logged in successfully!");
    }
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



// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import SplashScreen from './components/SplashScreen';
// import HomePage from './pages/HomePage';
// import ChatPage from './pages/ChatPage';
// import { toast } from 'react-toastify';
// import './App.css';

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 3000);
    
//     // Check if user is authenticated
//     const token = localStorage.getItem('airchat_token');
//     const userData = localStorage.getItem('airchat_user');
    
//     // Handle case where userData might be undefined or invalid
//     if (token) {
//       try {
//         // Only parse if userData exists
//         if (userData) {
//           const parsedUserData = JSON.parse(userData);
//           setUser(parsedUserData);
//         }
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         // Clear invalid data
//         localStorage.removeItem('airchat_token');
//         localStorage.removeItem('airchat_user');
//       }
//     }

//     return () => clearTimeout(timer);
//   }, []);

//   const handleLoginSuccess = (userData) => {
//     if (userData) {
//       localStorage.setItem('airchat_token', token);
//       localStorage.setItem('airchat_user', JSON.stringify(userData));
//       setIsAuthenticated(true);
//       setUser(userData);
//       toast.success("Logged in successfully!");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('airchat_token');
//     localStorage.removeItem('airchat_user');
//     setIsAuthenticated(false);
//     setUser(null);
//     toast.success("Logged out successfully!");
//   };

//   if (loading) {
//     return <SplashScreen />;
//   }

//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={
//           isAuthenticated ? 
//             <Navigate to="/chat" /> : 
//             <HomePage onLoginSuccess={handleLoginSuccess} />
//         } />
//         <Route path="/chat" element={
//           isAuthenticated ? 
//             <ChatPage user={user} onLogout={handleLogout} /> : 
//             <Navigate to="/" />
//         } />
//       </Routes>
//     </div>
//   );
// }

// export default App;


// src/App.js
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import SplashScreen from './components/SplashScreen';
// import HomePage from './pages/HomePage';
// import ChatPage from './pages/ChatPage';
// import { toast } from 'react-toastify';
// import './App.css';

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null); // Add token state

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 3000);
    
//     // Check if user is authenticated
//     const storedToken = localStorage.getItem('airchat_token');
//     const userData = localStorage.getItem('airchat_user');
    
//     if (storedToken) {
//       try {
//         if (userData) {
//           const parsedUserData = JSON.parse(userData);
//           setUser(parsedUserData);
//           setToken(storedToken); // Set token state
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         // Clear invalid data
//         localStorage.removeItem('airchat_token');
//         localStorage.removeItem('airchat_user');
//       }
//     }

//     return () => clearTimeout(timer);
//   }, []);

//   const handleLoginSuccess = (authData) => {
//     if (authData && authData.user && authData.token) {
//       localStorage.setItem('airchat_token', authData.token);
//       localStorage.setItem('airchat_user', JSON.stringify(authData.user));
//       setIsAuthenticated(true);
//       setUser(authData.user);
//       setToken(authData.token); // Set token state
//       toast.success("Logged in successfully!");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('airchat_token');
//     localStorage.removeItem('airchat_user');
//     setIsAuthenticated(false);
//     setUser(null);
//     setToken(null); // Clear token state
//     toast.success("Logged out successfully!");
//   };

//   if (loading) {
//     return <SplashScreen />;
//   }

//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={
//           isAuthenticated ? 
//             <Navigate to="/chat" /> : 
//             <HomePage onLoginSuccess={handleLoginSuccess} />
//         } />
//         <Route path="/chat" element={
//           isAuthenticated && user ? 
//             <ChatPage user={user} token={token} onLogout={handleLogout} /> : 
//             <Navigate to="/" />
//         } />
//       </Routes>
//     </div>
//   );
// }

// export default App;


// // src/App.js
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import SplashScreen from './components/SplashScreen';
// import HomePage from './pages/HomePage';
// import ChatPage from './pages/ChatPage';
// import { toast } from 'react-toastify';
// import './App.css';

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [authData, setAuthData] = useState(null); // Combined auth state

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 3000);
    
//     // Check if user is authenticated
//     const token = localStorage.getItem('airchat_token');
//     const userData = localStorage.getItem('airchat_user');
    
//     if (token && userData) {
//       try {
//         const parsedUserData = JSON.parse(userData);
//         setAuthData({ user: parsedUserData, token });
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         localStorage.removeItem('airchat_token');
//         localStorage.removeItem('airchat_user');
//       }
//     }

//     return () => clearTimeout(timer);
//   }, []);

//   const handleLoginSuccess = (authData) => {
//     if (authData && authData.user && authData.token) {
//       localStorage.setItem('airchat_token', authData.token);
//       localStorage.setItem('airchat_user', JSON.stringify(authData.user));
//       setAuthData(authData);
//       toast.success("Logged in successfully!");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('airchat_token');
//     localStorage.removeItem('airchat_user');
//     setAuthData(null);
//     toast.success("Logged out successfully!");
//   };

//   if (loading) {
//     return <SplashScreen />;
//   }

//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={
//           authData ? 
//             <Navigate to="/chat" replace /> : 
//             <HomePage onLoginSuccess={handleLoginSuccess} />
//         } />
//         <Route path="/chat" element={
//           authData ? 
//             <ChatPage user={authData.user} token={authData.token} onLogout={handleLogout} /> : 
//             <Navigate to="/" replace />
//         } />
//       </Routes>
//     </div>
//   );
// }

// export default App;


// src/App.js
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { toast } from 'react-toastify';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    // Check authentication
    const token = localStorage.getItem('airchat_token');
    const userData = localStorage.getItem('airchat_user');
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setAuthData({ user: parsedUserData, token });
        // Redirect immediately if authenticated
        navigate('/chat');
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('airchat_token');
        localStorage.removeItem('airchat_user');
      }
    }

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLoginSuccess = (newAuthData) => {
    if (newAuthData?.user && newAuthData?.token) {
      localStorage.setItem('airchat_token', newAuthData.token);
      localStorage.setItem('airchat_user', JSON.stringify(newAuthData.user));
      setAuthData(newAuthData);
      toast.success("Logged in successfully!");
      // Redirect immediately after login
      navigate('/chat');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('airchat_token');
    localStorage.removeItem('airchat_user');
    setAuthData(null);
    toast.success("Logged out successfully!");
    navigate('/');
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          authData ? 
            <Navigate to="/chat" replace /> : 
            <HomePage onLoginSuccess={handleLoginSuccess} />
        } />
        <Route path="/chat" element={
          authData ? 
            <ChatPage user={authData.user} token={authData.token} onLogout={handleLogout} /> : 
            <Navigate to="/" replace />
        } />
      </Routes>
    </div>
  );
}

export default App;
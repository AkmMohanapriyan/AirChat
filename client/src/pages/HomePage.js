


// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import LoginForm from '../components/auth/LoginForm';
// import SignupForm from '../components/auth/SignupForm';
// import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
// import ResetPasswordForm from '../components/auth/ResetPasswordForm';
// import VerifyAccountForm from '../components/auth/VerifyAccountForm';
// import './HomePage.css';

// const HomePage = ({ onLoginSuccess }) => {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [showVerifyAccount, setShowVerifyAccount] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [resetToken, setResetToken] = useState('');

//   // Modal handlers
//   const handleLoginShow = () => setShowLogin(true);
//   const handleLoginClose = () => setShowLogin(false);
//   const handleSignupShow = () => setShowSignup(true);
//   const handleSignupClose = () => setShowSignup(false);
//   const handleForgotPasswordShow = () => {
//     setShowLogin(false);
//     setShowForgotPassword(true);
//   };
//   const handleForgotPasswordClose = () => setShowForgotPassword(false);
//   const handleResetPasswordShow = (token) => {
//     setResetToken(token);
//     setShowForgotPassword(false);
//     setShowResetPassword(true);
//   };
//   const handleResetPasswordClose = () => setShowResetPassword(false);
//   const handleVerifyAccountShow = (id) => {
//     setUserId(id);
//     setShowSignup(false);
//     setShowVerifyAccount(true);
//   };
//   const handleVerifyAccountClose = () => setShowVerifyAccount(false);
//   const switchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };
//   const switchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   // Success handlers
//   const handleLoginSuccess = (userData) => {
//     handleLoginClose();
//     onLoginSuccess(userData);
//   };
//   const handleSignupSuccess = (userId) => {
//     handleSignupClose();
//     handleVerifyAccountShow(userId);
//     toast.info('Please verify your account with the code sent to your email');
//   };
//   const handleForgotPasswordSuccess = () => {
//     handleForgotPasswordClose();
//     toast.info('Password reset instructions sent to your email');
//   };
//   const handleResetPasswordSuccess = () => {
//     handleResetPasswordClose();
//     toast.success('Password reset successfully!');
//   };
//   const handleVerifyAccountSuccess = (userData) => {
//     handleVerifyAccountClose();
//     onLoginSuccess(userData);
//     toast.success('Account verified successfully!');
//   };

//   return (
//     <Container fluid className="home-page">
//       {/* Background overlay */}
//       <div className="background-overlay"></div>

//       <Row className="justify-content-center align-items-center min-vh-100">
//         <Col md={8} lg={6} className="text-center content-container">
//           <div className="logo-container mb-4">
//             <div className="app-logo">
//               <span className="logo-text">AirChat</span>
//             </div>
//           </div>

//           <h1 className="display-4 mb-4">Connect with People</h1>
//           <p className="lead mb-5">
//             Real-time messaging with end-to-end encryption. Stay connected with friends and family.
//           </p>

//           <div className="cta-buttons">
//             <Button variant="primary" size="lg" onClick={handleLoginShow} className="me-3 login-btn">
//               Login
//             </Button>
//             <Button variant="outline-light" size="lg" onClick={handleSignupShow} className="signup-btn">
//               Sign Up
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {/* Auth Modals */}
//       <Modal show={showLogin} onHide={handleLoginClose} centered className="auth-modal">
//         <LoginForm 
//           onClose={handleLoginClose} 
//           onSuccess={handleLoginSuccess} 
//           onSwitchToSignup={switchToSignup} 
//           onForgotPassword={handleForgotPasswordShow}
//         />
//       </Modal>

//       <Modal show={showSignup} onHide={handleSignupClose} centered className="auth-modal">
//         <SignupForm 
//           onClose={handleSignupClose} 
//           onSuccess={handleSignupSuccess} 
//           onSwitchToLogin={switchToLogin}
//         />
//       </Modal>

//       <Modal show={showForgotPassword} onHide={handleForgotPasswordClose} centered className="auth-modal">
//         <ForgotPasswordForm 
//           onClose={handleForgotPasswordClose} 
//           onSuccess={handleForgotPasswordSuccess} 
//           onResetPassword={handleResetPasswordShow}
//         />
//       </Modal>

//       <Modal show={showResetPassword} onHide={handleResetPasswordClose} centered className="auth-modal">
//         <ResetPasswordForm 
//           resetToken={resetToken}
//           onClose={handleResetPasswordClose} 
//           onSuccess={handleResetPasswordSuccess}
//         />
//       </Modal>

//       <Modal show={showVerifyAccount} onHide={handleVerifyAccountClose} centered className="auth-modal">
//         <VerifyAccountForm 
//           userId={userId}
//           onClose={handleVerifyAccountClose} 
//           onSuccess={handleVerifyAccountSuccess}
//         />
//       </Modal>
//     </Container>
//   );
// };

// export default HomePage;


// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import LoginForm from '../components/auth/LoginForm';
// import SignupForm from '../components/auth/SignupForm';
// import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
// import ResetPasswordForm from '../components/auth/ResetPasswordForm';
// import VerifyAccountForm from '../components/auth/VerifyAccountForm';
// import './HomePage.css';

// const HomePage = ({ onLoginSuccess }) => {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [showVerifyAccount, setShowVerifyAccount] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [resetToken, setResetToken] = useState('');

//   // Modal handlers
//   const handleLoginShow = () => setShowLogin(true);
//   const handleLoginClose = () => setShowLogin(false);
//   const handleSignupShow = () => setShowSignup(true);
//   const handleSignupClose = () => setShowSignup(false);
//   const handleForgotPasswordShow = () => {
//     setShowLogin(false);
//     setShowForgotPassword(true);
//   };
//   const handleForgotPasswordClose = () => setShowForgotPassword(false);
//   const handleResetPasswordShow = (token) => {
//     setResetToken(token);
//     setShowForgotPassword(false);
//     setShowResetPassword(true);
//   };
//   const handleResetPasswordClose = () => setShowResetPassword(false);
//   const handleVerifyAccountShow = (id) => {
//     setUserId(id);
//     setShowSignup(false);
//     setShowVerifyAccount(true);
//   };
//   const handleVerifyAccountClose = () => setShowVerifyAccount(false);
//   const switchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };
//   const switchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   // Updated success handlers to include token
//   const handleLoginSuccess = (userData, token) => {
//     handleLoginClose();
//     onLoginSuccess(userData, token); // Pass token to parent
//     toast.success("Logged in successfully!");
//   };

//   const handleSignupSuccess = (userId) => {
//     handleSignupClose();
//     handleVerifyAccountShow(userId);
//     toast.info('Please verify your account with the code sent to your email');
//   };

//   const handleForgotPasswordSuccess = () => {
//     handleForgotPasswordClose();
//     toast.info('Password reset instructions sent to your email');
//   };

//   const handleResetPasswordSuccess = () => {
//     handleResetPasswordClose();
//     toast.success('Password reset successfully!');
//   };

//   const handleVerifyAccountSuccess = (userData, token) => {
//     handleVerifyAccountClose();
//     onLoginSuccess(userData, token); // Pass token to parent
//     toast.success('Account verified successfully!');
//   };

//   return (
//     <Container fluid className="home-page">
//       {/* Background overlay */}
//       <div className="background-overlay"></div>

//       <Row className="justify-content-center align-items-center min-vh-100">
//         <Col md={8} lg={6} className="text-center content-container">
//           <div className="logo-container mb-4">
//             <div className="app-logo">
//               <span className="logo-text">AirChat</span>
//             </div>
//           </div>

//           <h1 className="display-4 mb-4">Connect with People</h1>
//           <p className="lead mb-5">
//             Real-time messaging with end-to-end encryption. Stay connected with friends and family.
//           </p>

//           <div className="cta-buttons">
//             <Button variant="primary" size="lg" onClick={handleLoginShow} className="me-3 login-btn">
//               Login
//             </Button>
//             <Button variant="outline-light" size="lg" onClick={handleSignupShow} className="signup-btn">
//               Sign Up
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {/* Auth Modals */}
//       <Modal show={showLogin} onHide={handleLoginClose} centered className="auth-modal">
//         <LoginForm 
//           onClose={handleLoginClose} 
//           onSuccess={handleLoginSuccess} 
//           onSwitchToSignup={switchToSignup} 
//           onForgotPassword={handleForgotPasswordShow}
//         />
//       </Modal>

//       <Modal show={showSignup} onHide={handleSignupClose} centered className="auth-modal">
//         <SignupForm 
//           onClose={handleSignupClose} 
//           onSuccess={handleSignupSuccess} 
//           onSwitchToLogin={switchToLogin}
//         />
//       </Modal>

//       <Modal show={showForgotPassword} onHide={handleForgotPasswordClose} centered className="auth-modal">
//         <ForgotPasswordForm 
//           onClose={handleForgotPasswordClose} 
//           onSuccess={handleForgotPasswordSuccess} 
//           onResetPassword={handleResetPasswordShow}
//         />
//       </Modal>

//       <Modal show={showResetPassword} onHide={handleResetPasswordClose} centered className="auth-modal">
//         <ResetPasswordForm 
//           resetToken={resetToken}
//           onClose={handleResetPasswordClose} 
//           onSuccess={handleResetPasswordSuccess}
//         />
//       </Modal>

//       <Modal show={showVerifyAccount} onHide={handleVerifyAccountClose} centered className="auth-modal">
//         <VerifyAccountForm 
//           userId={userId}
//           onClose={handleVerifyAccountClose} 
//           onSuccess={handleVerifyAccountSuccess}
//         />
//       </Modal>
//     </Container>
//   );
// };

// export default HomePage;




// // src/pages/HomePage.js
// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import LoginForm from '../components/auth/LoginForm';
// import SignupForm from '../components/auth/SignupForm';
// import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
// import ResetPasswordForm from '../components/auth/ResetPasswordForm';
// import VerifyAccountForm from '../components/auth/VerifyAccountForm';
// import './HomePage.css';

// const HomePage = ({ onLoginSuccess }) => {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [showVerifyAccount, setShowVerifyAccount] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [resetToken, setResetToken] = useState('');

//   // Modal handlers
//   const handleLoginShow = () => setShowLogin(true);
//   const handleLoginClose = () => setShowLogin(false);
//   const handleSignupShow = () => setShowSignup(true);
//   const handleSignupClose = () => setShowSignup(false);
//   const handleForgotPasswordShow = () => {
//     setShowLogin(false);
//     setShowForgotPassword(true);
//   };
//   const handleForgotPasswordClose = () => setShowForgotPassword(false);
//   const handleResetPasswordShow = (token) => {
//     setResetToken(token);
//     setShowForgotPassword(false);
//     setShowResetPassword(true);
//   };
//   const handleResetPasswordClose = () => setShowResetPassword(false);
//   const handleVerifyAccountShow = (id) => {
//     setUserId(id);
//     setShowSignup(false);
//     setShowVerifyAccount(true);
//   };
//   const handleVerifyAccountClose = () => setShowVerifyAccount(false);
//   const switchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };
//   const switchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   // Updated success handlers
//   const handleLoginSuccess = (userData, token) => {
//     handleLoginClose();
//     // Pass both user and token to parent
//     onLoginSuccess({ user: userData, token });
//     toast.success("Logged in successfully!");
//   };

//   const handleSignupSuccess = (userId) => {
//     handleSignupClose();
//     handleVerifyAccountShow(userId);
//     toast.info('Please verify your account with the code sent to your email');
//   };

//   const handleForgotPasswordSuccess = () => {
//     handleForgotPasswordClose();
//     toast.info('Password reset instructions sent to your email');
//   };

//   const handleResetPasswordSuccess = () => {
//     handleResetPasswordClose();
//     toast.success('Password reset successfully!');
//   };

//   const handleVerifyAccountSuccess = (userData, token) => {
//     handleVerifyAccountClose();
//     onLoginSuccess({ user: userData, token }); // Pass as object
//     toast.success('Account verified successfully!');
//   };

//   return (
//     <Container fluid className="home-page">
//       {/* Background overlay */}
//       <div className="background-overlay"></div>

//       <Row className="justify-content-center align-items-center min-vh-100">
//         <Col md={8} lg={6} className="text-center content-container">
//           <div className="logo-container mb-4">
//             <div className="app-logo">
//               <span className="logo-text">AirChat</span>
//             </div>
//           </div>

//           <h1 className="display-4 mb-4">Connect with People</h1>
//           <p className="lead mb-5">
//             Real-time messaging with end-to-end encryption. Stay connected with friends and family.
//           </p>

//           <div className="cta-buttons">
//             <Button variant="primary" size="lg" onClick={handleLoginShow} className="me-3 login-btn">
//               Login
//             </Button>
//             <Button variant="outline-light" size="lg" onClick={handleSignupShow} className="signup-btn">
//               Sign Up
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {/* Auth Modals */}
//       <Modal show={showLogin} onHide={handleLoginClose} centered className="auth-modal">
//         <LoginForm 
//           onClose={handleLoginClose} 
//           onSuccess={handleLoginSuccess} 
//           onSwitchToSignup={switchToSignup} 
//           onForgotPassword={handleForgotPasswordShow}
//         />
//       </Modal>

//       <Modal show={showSignup} onHide={handleSignupClose} centered className="auth-modal">
//         <SignupForm 
//           onClose={handleSignupClose} 
//           onSuccess={handleSignupSuccess} 
//           onSwitchToLogin={switchToLogin}
//         />
//       </Modal>

//       <Modal show={showForgotPassword} onHide={handleForgotPasswordClose} centered className="auth-modal">
//         <ForgotPasswordForm 
//           onClose={handleForgotPasswordClose} 
//           onSuccess={handleForgotPasswordSuccess} 
//           onResetPassword={handleResetPasswordShow}
//         />
//       </Modal>

//       <Modal show={showResetPassword} onHide={handleResetPasswordClose} centered className="auth-modal">
//         <ResetPasswordForm 
//           resetToken={resetToken}
//           onClose={handleResetPasswordClose} 
//           onSuccess={handleResetPasswordSuccess}
//         />
//       </Modal>

//       <Modal show={showVerifyAccount} onHide={handleVerifyAccountClose} centered className="auth-modal">
//         <VerifyAccountForm 
//           userId={userId}
//           onClose={handleVerifyAccountClose} 
//           onSuccess={handleVerifyAccountSuccess}
//         />
//       </Modal>
//     </Container>
//   );
// };

// export default HomePage;


// src/pages/HomePage.js
// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import LoginForm from '../components/auth/LoginForm';
// import SignupForm from '../components/auth/SignupForm';
// import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
// import ResetPasswordForm from '../components/auth/ResetPasswordForm';
// import VerifyAccountForm from '../components/auth/VerifyAccountForm';
// import './HomePage.css';

// const HomePage = ({ onLoginSuccess }) => {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [showVerifyAccount, setShowVerifyAccount] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [resetToken, setResetToken] = useState('');

//   // Modal handlers
//   const handleLoginShow = () => setShowLogin(true);
//   const handleLoginClose = () => setShowLogin(false);
//   const handleSignupShow = () => setShowSignup(true);
//   const handleSignupClose = () => setShowSignup(false);
//   const handleForgotPasswordShow = () => {
//     setShowLogin(false);
//     setShowForgotPassword(true);
//   };
//   const handleForgotPasswordClose = () => setShowForgotPassword(false);
//   const handleResetPasswordShow = (token) => {
//     setResetToken(token);
//     setShowForgotPassword(false);
//     setShowResetPassword(true);
//   };
//   const handleResetPasswordClose = () => setShowResetPassword(false);
//   const handleVerifyAccountShow = (id) => {
//     setUserId(id);
//     setShowSignup(false);
//     setShowVerifyAccount(true);
//   };
//   const handleVerifyAccountClose = () => setShowVerifyAccount(false);
//   const switchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };
//   const switchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   // Updated success handlers
//   const handleLoginSuccess = (userData, token) => {
//     handleLoginClose();
//     onLoginSuccess({ user: userData, token });
//     toast.success("Logged in successfully!");
//   };

//   const handleSignupSuccess = (userId) => {
//     handleSignupClose();
//     handleVerifyAccountShow(userId);
//     toast.info('Please verify your account with the code sent to your email');
//   };

//   const handleForgotPasswordSuccess = () => {
//     handleForgotPasswordClose();
//     toast.info('Password reset instructions sent to your email');
//   };

//   const handleResetPasswordSuccess = () => {
//     handleResetPasswordClose();
//     toast.success('Password reset successfully!');
//     handleLoginShow();
//   };

//   const handleVerifyAccountSuccess = (userData, token) => {
//     handleVerifyAccountClose();
//     onLoginSuccess({ user: userData, token });
//     toast.success('Account verified successfully!');
//   };

//   return (
//     <Container fluid className="home-page">
//       {/* Background overlay */}
//       <div className="background-overlay"></div>

//       <Row className="justify-content-center align-items-center min-vh-100">
//         <Col md={8} lg={6} className="text-center content-container">
//           <div className="logo-container mb-4">
//             <div className="app-logo">
//               <span className="logo-text">AirChat</span>
//             </div>
//           </div>

//           <h1 className="display-4 mb-4">Connect with People</h1>
//           <p className="lead mb-5">
//             Real-time messaging with end-to-end encryption. Stay connected with friends and family.
//           </p>

//           <div className="cta-buttons">
//             <Button variant="primary" size="lg" onClick={handleLoginShow} className="me-3 login-btn">
//               Login
//             </Button>
//             <Button variant="outline-light" size="lg" onClick={handleSignupShow} className="signup-btn">
//               Sign Up
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {/* Auth Modals */}
//       <Modal show={showLogin} onHide={handleLoginClose} centered className="auth-modal">
//         <LoginForm 
//           onClose={handleLoginClose} 
//           onSuccess={handleLoginSuccess} 
//           onSwitchToSignup={switchToSignup} 
//           onForgotPassword={handleForgotPasswordShow}
//         />
//       </Modal>

//       <Modal show={showSignup} onHide={handleSignupClose} centered className="auth-modal">
//         <SignupForm 
//           onClose={handleSignupClose} 
//           onSuccess={handleSignupSuccess} 
//           onSwitchToLogin={switchToLogin}
//         />
//       </Modal>

//       <Modal show={showForgotPassword} onHide={handleForgotPasswordClose} centered className="auth-modal">
//         <ForgotPasswordForm 
//           onClose={handleForgotPasswordClose} 
//           onSuccess={handleForgotPasswordSuccess} 
//           onResetPassword={handleResetPasswordShow}
//         />
//       </Modal>

//       <Modal show={showResetPassword} onHide={handleResetPasswordClose} centered className="auth-modal">
//         <ResetPasswordForm 
//           resetToken={resetToken}
//           onClose={handleResetPasswordClose} 
//           onSuccess={handleResetPasswordSuccess}
//         />
//       </Modal>

//       <Modal show={showVerifyAccount} onHide={handleVerifyAccountClose} centered className="auth-modal">
//         <VerifyAccountForm 
//           userId={userId}
//           onClose={handleVerifyAccountClose} 
//           onSuccess={handleVerifyAccountSuccess}
//         />
//       </Modal>
//     </Container>
//   );
// };

// export default HomePage;


// // src/pages/HomePage.js
// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import LoginForm from '../components/auth/LoginForm';
// import SignupForm from '../components/auth/SignupForm';
// import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
// import ResetPasswordForm from '../components/auth/ResetPasswordForm';
// import VerifyAccountForm from '../components/auth/VerifyAccountForm';
// import './HomePage.css';

// const HomePage = ({ onLoginSuccess }) => {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [showVerifyAccount, setShowVerifyAccount] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [resetToken, setResetToken] = useState('');

//   // Modal handlers
//   const handleLoginShow = () => setShowLogin(true);
//   const handleLoginClose = () => setShowLogin(false);
//   const handleSignupShow = () => setShowSignup(true);
//   const handleSignupClose = () => setShowSignup(false);
//   const handleForgotPasswordShow = () => {
//     setShowLogin(false);
//     setShowForgotPassword(true);
//   };
//   const handleForgotPasswordClose = () => setShowForgotPassword(false);
//   const handleResetPasswordShow = (token) => {
//     setResetToken(token);
//     setShowForgotPassword(false);
//     setShowResetPassword(true);
//   };
//   const handleResetPasswordClose = () => setShowResetPassword(false);
//   const handleVerifyAccountShow = (id) => {
//     setUserId(id);
//     setShowSignup(false);
//     setShowVerifyAccount(true);
//   };
//   const handleVerifyAccountClose = () => setShowVerifyAccount(false);
//   const switchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };
//   const switchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   // Updated success handlers
//   const handleLoginSuccess = (userData, token) => {
//     handleLoginClose();
//     onLoginSuccess({ user: userData, token });
//     toast.success("Logged in successfully!");
//     // REMOVED navigation from here
//   };

//   const handleSignupSuccess = (userId) => {
//     handleSignupClose();
//     handleVerifyAccountShow(userId);
//     toast.info('Please verify your account with the code sent to your email');
//   };

//   const handleForgotPasswordSuccess = () => {
//     handleForgotPasswordClose();
//     toast.info('Password reset instructions sent to your email');
//   };

//   const handleResetPasswordSuccess = () => {
//     handleResetPasswordClose();
//     toast.success('Password reset successfully!');
//     handleLoginShow();
//   };

//   const handleVerifyAccountSuccess = (userData, token) => {
//     handleVerifyAccountClose();
//     onLoginSuccess({ user: userData, token });
//     toast.success('Account verified successfully!');
//     // REMOVED navigation from here
//   };

//   return (
//     <Container fluid className="home-page">
//       {/* Background overlay */}
//       <div className="background-overlay"></div>

//       <Row className="justify-content-center align-items-center min-vh-100">
//         <Col md={8} lg={6} className="text-center content-container">
//           <div className="logo-container mb-4">
//             <div className="app-logo">
//               <span className="logo-text">AirChat</span>
//             </div>
//           </div>

//           <h1 className="display-4 mb-4">Connect with People</h1>
//           <p className="lead mb-5">
//             Real-time messaging with end-to-end encryption. Stay connected with friends and family.
//           </p>

//           <div className="cta-buttons">
//             <Button variant="primary" size="lg" onClick={handleLoginShow} className="me-3 login-btn">
//               Login
//             </Button>
//             <Button variant="outline-light" size="lg" onClick={handleSignupShow} className="signup-btn">
//               Sign Up
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {/* Auth Modals */}
//       <Modal show={showLogin} onHide={handleLoginClose} centered className="auth-modal">
//         <LoginForm 
//           onClose={handleLoginClose} 
//           onSuccess={handleLoginSuccess} 
//           onSwitchToSignup={switchToSignup} 
//           onForgotPassword={handleForgotPasswordShow}
//         />
//       </Modal>

//       <Modal show={showSignup} onHide={handleSignupClose} centered className="auth-modal">
//         <SignupForm 
//           onClose={handleSignupClose} 
//           onSuccess={handleSignupSuccess} 
//           onSwitchToLogin={switchToLogin}
//         />
//       </Modal>

//       <Modal show={showForgotPassword} onHide={handleForgotPasswordClose} centered className="auth-modal">
//         <ForgotPasswordForm 
//           onClose={handleForgotPasswordClose} 
//           onSuccess={handleForgotPasswordSuccess} 
//           onResetPassword={handleResetPasswordShow}
//         />
//       </Modal>

//       <Modal show={showResetPassword} onHide={handleResetPasswordClose} centered className="auth-modal">
//         <ResetPasswordForm 
//           resetToken={resetToken}
//           onClose={handleResetPasswordClose} 
//           onSuccess={handleResetPasswordSuccess}
//         />
//       </Modal>

//       <Modal show={showVerifyAccount} onHide={handleVerifyAccountClose} centered className="auth-modal">
//         <VerifyAccountForm 
//           userId={userId}
//           onClose={handleVerifyAccountClose} 
//           onSuccess={handleVerifyAccountSuccess}
//         />
//       </Modal>
//     </Container>
//   );
// };

// export default HomePage;




import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import VerifyAccountForm from '../components/auth/VerifyAccountForm';
import './HomePage.css';

const HomePage = ({ onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showVerifyAccount, setShowVerifyAccount] = useState(false);

  const [userId, setUserId] = useState(null);
  const [resetToken, setResetToken] = useState('');

  // 🔑 Success handlers
  const handleLoginSuccess = (userData, token) => {
    setShowLogin(false);
    onLoginSuccess({ user: userData, token }); // ✅ send both
    toast.success('Logged in successfully!');
  };

  const handleSignupSuccess = (id) => {
    setShowSignup(false);
    setUserId(id);
    setShowVerifyAccount(true);
    toast.info('Please verify your account (check email).');
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    toast.info('Password reset link sent to your email.');
  };

  const handleResetPasswordSuccess = () => {
    setShowResetPassword(false);
    toast.success('Password reset successfully. Please log in.');
    setShowLogin(true);
  };

  const handleVerifyAccountSuccess = (userData, token) => {
    setShowVerifyAccount(false);
    onLoginSuccess({ user: userData, token });
    toast.success('Account verified successfully!');
  };

  return (
    <Container fluid className="home-page">
      {/* Page Hero Section */}
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6} className="text-center content-container">
          <div className="logo-container mb-4">
            <span className="logo-text">AirChat</span>
          </div>
          <h1 className="display-4 mb-4">Connect with People</h1>
          <p className="lead mb-5">
            Real-time messaging with end-to-end encryption.
          </p>
          <div className="cta-buttons">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowLogin(true)}
              className="me-3"
            >
              Login
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modals */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onForgotPassword={() => {
            setShowLogin(false);
            setShowForgotPassword(true);
          }}
        />
      </Modal>

      <Modal show={showSignup} onHide={() => setShowSignup(false)} centered>
        <SignupForm
          onClose={() => setShowSignup(false)}
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      </Modal>

      <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)} centered>
        <ForgotPasswordForm
          onClose={() => setShowForgotPassword(false)}
          onSuccess={handleForgotPasswordSuccess}
          onResetPassword={(token) => {
            setResetToken(token);
            setShowForgotPassword(false);
            setShowResetPassword(true);
          }}
        />
      </Modal>

      <Modal show={showResetPassword} onHide={() => setShowResetPassword(false)} centered>
        <ResetPasswordForm
          resetToken={resetToken}
          onClose={() => setShowResetPassword(false)}
          onSuccess={handleResetPasswordSuccess}
        />
      </Modal>

      <Modal show={showVerifyAccount} onHide={() => setShowVerifyAccount(false)} centered>
        <VerifyAccountForm
          userId={userId}
          onClose={() => setShowVerifyAccount(false)}
          onSuccess={handleVerifyAccountSuccess}
        />
      </Modal>
    </Container>
  );
};

export default HomePage;

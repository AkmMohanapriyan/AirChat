// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import LoginForm from '../components/auth/LoginForm';
// import SignupForm from '../components/auth/SignupForm';
// import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
// import ResetPasswordForm from '../components/auth/ResetPasswordForm';
// import VerifyAccountForm from '../components/auth/VerifyAccountForm';
// import './HomePage.css';

// const HomePage = () => {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [showVerifyAccount, setShowVerifyAccount] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [resetToken, setResetToken] = useState('');

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

//   const handleLoginSuccess = () => {
//     handleLoginClose();
//     toast.success('Logged in successfully!');
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

//   const handleVerifyAccountSuccess = () => {
//     handleVerifyAccountClose();
//     toast.success('Account verified successfully!');
//   };

//   return (
//     <Container fluid className="home-page">
//       <Row className="justify-content-center align-items-center min-vh-100">
//         <Col md={8} lg={6} className="text-center">
//           <h1 className="display-4 mb-4">Welcome to AirChat</h1>
//           <p className="lead mb-5">
//             Connect with friends and family in real-time with our secure and easy-to-use chat application.
//           </p>
//           <Button variant="primary" size="lg" onClick={handleLoginShow} className="me-3">
//             Login
//           </Button>
//           <Button variant="outline-primary" size="lg" onClick={handleSignupShow}>
//             Sign Up
//           </Button>
//         </Col>
//       </Row>

//       {/* Login Modal */}
//       <Modal show={showLogin} onHide={handleLoginClose} centered className="auth-modal">
//         <LoginForm 
//           onClose={handleLoginClose} 
//           onSuccess={handleLoginSuccess} 
//           onSwitchToSignup={switchToSignup} 
//           onForgotPassword={handleForgotPasswordShow}
//         />
//       </Modal>

//       {/* Signup Modal */}
//       <Modal show={showSignup} onHide={handleSignupClose} centered className="auth-modal">
//         <SignupForm 
//           onClose={handleSignupClose} 
//           onSuccess={handleSignupSuccess} 
//           onSwitchToLogin={switchToLogin}
//         />
//       </Modal>

//       {/* Forgot Password Modal */}
//       <Modal show={showForgotPassword} onHide={handleForgotPasswordClose} centered className="auth-modal">
//         <ForgotPasswordForm 
//           onClose={handleForgotPasswordClose} 
//           onSuccess={handleForgotPasswordSuccess} 
//           onResetPassword={handleResetPasswordShow}
//         />
//       </Modal>

//       {/* Reset Password Modal */}
//       <Modal show={showResetPassword} onHide={handleResetPasswordClose} centered className="auth-modal">
//         <ResetPasswordForm 
//           resetToken={resetToken}
//           onClose={handleResetPasswordClose} 
//           onSuccess={handleResetPasswordSuccess}
//         />
//       </Modal>

//       {/* Verify Account Modal */}
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

  const handleLoginShow = () => setShowLogin(true);
  const handleLoginClose = () => setShowLogin(false);

  const handleSignupShow = () => setShowSignup(true);
  const handleSignupClose = () => setShowSignup(false);

  const handleForgotPasswordShow = () => {
    setShowLogin(false);
    setShowForgotPassword(true);
  };
  const handleForgotPasswordClose = () => setShowForgotPassword(false);

  const handleResetPasswordShow = (token) => {
    setResetToken(token);
    setShowForgotPassword(false);
    setShowResetPassword(true);
  };
  const handleResetPasswordClose = () => setShowResetPassword(false);

  const handleVerifyAccountShow = (id) => {
    setUserId(id);
    setShowSignup(false);
    setShowVerifyAccount(true);
  };
  const handleVerifyAccountClose = () => setShowVerifyAccount(false);

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = (userData) => {
    handleLoginClose();
    onLoginSuccess(userData); // Call the parent's login success handler
    toast.success('Logged in successfully!');
  };

  const handleSignupSuccess = (userId) => {
    handleSignupClose();
    handleVerifyAccountShow(userId);
    toast.info('Please verify your account with the code sent to your email');
  };

  const handleForgotPasswordSuccess = () => {
    handleForgotPasswordClose();
    toast.info('Password reset instructions sent to your email');
  };

  const handleResetPasswordSuccess = () => {
    handleResetPasswordClose();
    toast.success('Password reset successfully!');
  };

  const handleVerifyAccountSuccess = (userData) => {
    handleVerifyAccountClose();
    onLoginSuccess(userData); // Log in after successful verification
    toast.success('Account verified successfully!');
  };

  return (
    <Container fluid className="home-page">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6} className="text-center">
          <h1 className="display-4 mb-4">Welcome to AirChat</h1>
          <p className="lead mb-5">
            Connect with friends and family in real-time with our secure and easy-to-use chat application.
          </p>
          <Button variant="primary" size="lg" onClick={handleLoginShow} className="me-3">
            Login
          </Button>
          <Button variant="outline-primary" size="lg" onClick={handleSignupShow}>
            Sign Up
          </Button>
        </Col>
      </Row>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleLoginClose} centered className="auth-modal">
        <LoginForm 
          onClose={handleLoginClose} 
          onSuccess={handleLoginSuccess} 
          onSwitchToSignup={switchToSignup} 
          onForgotPassword={handleForgotPasswordShow}
        />
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignup} onHide={handleSignupClose} centered className="auth-modal">
        <SignupForm 
          onClose={handleSignupClose} 
          onSuccess={handleSignupSuccess} 
          onSwitchToLogin={switchToLogin}
        />
      </Modal>

      {/* Forgot Password Modal */}
      <Modal show={showForgotPassword} onHide={handleForgotPasswordClose} centered className="auth-modal">
        <ForgotPasswordForm 
          onClose={handleForgotPasswordClose} 
          onSuccess={handleForgotPasswordSuccess} 
          onResetPassword={handleResetPasswordShow}
        />
      </Modal>

      {/* Reset Password Modal */}
      <Modal show={showResetPassword} onHide={handleResetPasswordClose} centered className="auth-modal">
        <ResetPasswordForm 
          resetToken={resetToken}
          onClose={handleResetPasswordClose} 
          onSuccess={handleResetPasswordSuccess}
        />
      </Modal>

      {/* Verify Account Modal */}
      <Modal show={showVerifyAccount} onHide={handleVerifyAccountClose} centered className="auth-modal">
        <VerifyAccountForm 
          userId={userId}
          onClose={handleVerifyAccountClose} 
          onSuccess={handleVerifyAccountSuccess}
        />
      </Modal>
    </Container>
  );
};

export default HomePage;
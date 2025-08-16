// components/AuthModal.js
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';
import ResetPasswordForm from './auth/ResetPasswordForm';

const AuthModal = ({ show, onHide }) => {
  const [authMode, setAuthMode] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  
  // Handle login success
  const handleLoginSuccess = () => {
    onHide();
    // Additional login success logic
  };
  
  // Handle signup success
  const handleSignupSuccess = (userId) => {
    setAuthMode('verify');
    // You might want to implement a verification component
  };
  
  // Handle forgot password
  const handleForgotPassword = (email) => {
    setResetEmail(email);
    setAuthMode('reset');
  };
  
  // Handle reset success
  const handleResetSuccess = () => {
    onHide();
    // Additional reset success logic
  };
  
  // Render the appropriate form
  const renderForm = () => {
    switch(authMode) {
      case 'login':
        return (
          <LoginForm
            onClose={onHide}
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setAuthMode('signup')}
            onForgotPassword={() => setAuthMode('forgot')}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onClose={onHide}
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm
            onClose={onHide}
            onResetPassword={handleForgotPassword}
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm
            email={resetEmail}
            onClose={onHide}
            onSuccess={handleResetSuccess}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Modal show={show} onHide={onHide} centered>
      {renderForm()}
    </Modal>
  );
};

export default AuthModal;
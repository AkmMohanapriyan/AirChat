// import React, { useState } from 'react';
// import { Form, Button, Modal } from 'react-bootstrap';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const ForgotPasswordForm = ({ onClose, onResetPassword }) => {
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};
//     if (!email) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate inputs
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       console.log('Submitting forgot password for:', email);
      
//       const response = await axios.post('/api/auth/forgot-password', { email });
      
//       if (response.data.success) {
//         toast.success(response.data.message);
//         // In a real app, you would get the token from the email
//         // For now, we'll just trigger the reset form
//         onResetPassword('demo-reset-token');
//         onClose();
//       }
//     } catch (error) {
//       console.error('Forgot password error:', {
//         request: error.config,
//         response: error.response
//       });
      
//       const message = error.response?.data?.message || 
//                      'Failed to send reset code. Please try again.';
//       toast.error(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Modal.Header closeButton>
//         <Modal.Title className="w-100 text-center">Forgot Password</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-4">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               isInvalid={!!errors.email}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.email}
//             </Form.Control.Feedback>
//             <Form.Text muted>
//               We'll send a verification code to reset your password.
//             </Form.Text>
//           </Form.Group>

//           <Button 
//             variant="primary" 
//             type="submit" 
//             className="w-100 btn-airchat"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Sending...' : 'Send Verification Code'}
//           </Button>
//         </Form>
//       </Modal.Body>
//     </>
//   );
// };

// export default ForgotPasswordForm;

// components/ForgotPasswordForm.js
import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPasswordForm = ({ onClose, onResetPassword }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        toast.success(response.data.message);
        onResetPassword(email);
        onClose();
      }
    } catch (error) {
      console.error('Forgot password error:', {
        request: error.config,
        response: error.response
      });
      
      const message = error.response?.data?.message || 
                     'Failed to send reset code. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <Form.Text muted>
              We'll send a verification code to reset your password.
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-between mb-3">
            <Button 
              variant="outline-secondary" 
              onClick={onClose}
            >
              Back to Login
            </Button>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="btn-airchat"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

export default ForgotPasswordForm;
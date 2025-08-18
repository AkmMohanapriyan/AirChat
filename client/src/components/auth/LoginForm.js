



import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import './LoginForm.css'; // We'll create this CSS file
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = ({
  onClose,
  onSuccess,
  onSwitchToSignup,
  onForgotPassword
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const validationSchema = Yup.object({
  //   email: Yup.string()
  //     .email('Invalid email address')
  //     .required('Email is required'),
  //   password: Yup.string()
  //     .required('Password is required')
  // });

  // const formik = useFormik({
  //   initialValues: {
  //     email: '',
  //     password: ''
  //   },
  //   validationSchema,
  //   onSubmit: async (values) => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.post('/api/auth/login', values);

  //       if (response.data.success) {
  //         // Extract user data from the response
  //         const userData = {
  //           id: response.data.user._id,
  //           name: `${response.data.user.firstName} ${response.data.user.lastName}`,
  //           email: response.data.user.email,
  //           profilePhoto: response.data.user.profilePhoto
  //         };

  //         // Pass user data to onSuccess
  //         onSuccess(userData);
  //       } else if (response.data.needsVerification) {
  //         toast.info('Account not verified. Check your email for verification code.');
  //         onClose();
  //       }
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || 'Login failed';

  //       if (error.response?.data?.needsVerification) {
  //         toast.info('Account not verified. A new verification code has been sent to your email.');
  //       } else {
  //         toast.error(errorMessage);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // });


  // Updated login form code
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const formik = useFormik({
  initialValues: {
    email: '',
    password: ''
  },
  validationSchema,
  onSubmit: async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', values);

      if (response.data.success) {
        // Extract user data AND token from the response
        const userData = {
          id: response.data.user._id,
          name: `${response.data.user.firstName} ${response.data.user.lastName}`,
          email: response.data.user.email,
          profilePhoto: response.data.user.profilePhoto
        };

        // Store token in localStorage
        localStorage.setItem('airchat_token', response.data.token);
        
        // Store user data
        localStorage.setItem('airchat_user', JSON.stringify(userData));

        // Pass user data to onSuccess
        onSuccess(userData);
      } else if (response.data.needsVerification) {
        toast.info('Account not verified. Check your email for verification code.');
        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';

      if (error.response?.data?.needsVerification) {
        toast.info('Account not verified. A new verification code has been sent to your email.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }
});

  return (
    <>

      <Modal.Header closeButton className="login-modal-header d-flex flex-column align-items-center">
        <Modal.Title className="w-100 text-center">Welcome Back</Modal.Title>
      </Modal.Header>
      <Modal.Body className="login-modal-body pt-4">
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-4 position-relative">
            <div className="input-icon">
              <FaEnvelope className="icon" />
            </div>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              isInvalid={formik.touched.email && formik.errors.email}
              className="input-field ps-5" // Added ps-5 for padding
            />
            <Form.Control.Feedback type="invalid" className="error-feedback">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 position-relative">
            <div className="input-icon">
              <FaLock className="icon" />
            </div>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              isInvalid={formik.touched.password && formik.errors.password}
              className="input-field ps-5" // Added ps-5 for padding
            />
            <div
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            <Form.Control.Feedback type="invalid" className="error-feedback">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between mb-4 auth-links">
            <span onClick={onForgotPassword}>
              Forgot password?
            </span>
            <span onClick={onSwitchToSignup}>
              Create account
            </span>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-100 login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : 'Sign In'}
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default LoginForm;
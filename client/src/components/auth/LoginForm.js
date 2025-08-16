


import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginForm = ({ 
  onClose, 
  onSuccess, 
  onSwitchToSignup, 
  onForgotPassword 
}) => {
  const [isLoading, setIsLoading] = useState(false);

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
          // Extract user data from the response
          const userData = {
            id: response.data.user._id,
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
            email: response.data.user.email,
            profilePhoto: response.data.user.profilePhoto
          };
          
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
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Login to AirChat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              isInvalid={formik.touched.email && formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              isInvalid={formik.touched.password && formik.errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between mb-4">
            <span 
              className="link-primary cursor-pointer" 
              onClick={onForgotPassword}
            >
              Forgot password?
            </span>
            <span 
              className="link-primary cursor-pointer" 
              onClick={onSwitchToSignup}
            >
              Don't have an account? Sign up
            </span>
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 btn-airchat"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default LoginForm;
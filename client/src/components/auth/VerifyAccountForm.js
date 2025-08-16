import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyAccountForm = ({ userId, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const validationSchema = Yup.object({
    verificationCode: Yup.string()
      .required('Verification code is required')
      .length(4, 'Verification code must be 4 digits')
  });

  const formik = useFormik({
    initialValues: {
      verificationCode: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/auth/verify', {
          userId,
          verificationCode: values.verificationCode
        });
        
        if (response.data.success) {
          onSuccess();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Verification failed');
      } finally {
        setIsLoading(false);
      }
    }
  });

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await axios.post('/api/auth/resend-verification', {
        userId
      });
      
      if (response.data.success) {
        toast.success('New verification code sent');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Verify Your Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              type="text"
              name="verificationCode"
              placeholder="Enter the 4-digit code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.verificationCode}
              isInvalid={formik.touched.verificationCode && formik.errors.verificationCode}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.verificationCode}
            </Form.Control.Feedback>
            <Form.Text muted>
              We've sent a 4-digit verification code to your email address.
            </Form.Text>
          </Form.Group>

          <div className="text-center mb-3">
            <span className="link-primary" onClick={handleResendCode}>
              {isResending ? 'Sending...' : 'Resend Code'}
            </span>
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 btn-airchat"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Account'}
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default VerifyAccountForm;
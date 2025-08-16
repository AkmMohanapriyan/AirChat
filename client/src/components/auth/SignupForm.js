import React, { useState } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignupForm = ({ onClose, onSuccess, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('First name is required')
      .max(50, 'First name must be 50 characters or less'),
    lastName: Yup.string()
      .required('Last name is required')
      .max(50, 'Last name must be 50 characters or less'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one number, and one special character'
      )
      .notOneOf(['.', ',', ':'], 'Password cannot contain full stop, comma, or colon'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    age: Yup.number()
      .required('Age is required')
      .min(13, 'You must be at least 13 years old')
      .max(120, 'Age must be reasonable'),
    country: Yup.string()
      .required('Country is required'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
  });

const formik = useFormik({
  initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      country: '',
      phoneNumber: '',
      profilePhoto: null
  },
  validationSchema,
  onSubmit: async (values) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Append all text fields
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('age', values.age);
      formData.append('country', values.country);
      formData.append('phoneNumber', values.phoneNumber);
      
      // Append profile photo if exists
      if (values.profilePhoto) {
        formData.append('profilePhoto', values.profilePhoto);
      }

      const response = await axios.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        onSuccess(response.data.userId);
        toast.success(`Verification code sent to ${values.email}`);
      }
    } catch (error) {
      // Enhanced error handling
      const errorMessage = error.response?.data?.message || 
                          (error.response?.status === 413 
                            ? 'File too large (max 5MB)' 
                            : 'Registration failed');
      
      toast.error(errorMessage);
      
      // Log detailed error for debugging
      console.error('Registration error:', {
        error: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
    } finally {
      setIsLoading(false);
    }
  }
});

  const handleFileChange = (event) => {
    formik.setFieldValue('profilePhoto', event.currentTarget.files[0]);
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Create AirChat Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  isInvalid={formik.touched.firstName && formik.errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  isInvalid={formik.touched.lastName && formik.errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Profile Photo</Form.Label>
            <Form.Control
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>

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

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.age}
                  isInvalid={formik.touched.age && formik.errors.age}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.age}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  as="select"
                  name="country"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                  isInvalid={formik.touched.country && formik.errors.country}
                >
                  <option value="">Select your country</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                  {/* Add more countries as needed */}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.country}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              placeholder="Enter your phone number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.phoneNumber}
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
            <Form.Text muted>
              Password must be at least 8 characters with one uppercase letter, one number, and one special character.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="text-center mb-3">
            <span className="link-primary" onClick={onSwitchToLogin}>
              Already have an account? Login
            </span>
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 btn-airchat"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default SignupForm;
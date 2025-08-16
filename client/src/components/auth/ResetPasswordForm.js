// import React, { useState } from 'react';
// import { Form, Button, Modal } from 'react-bootstrap';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const ResetPasswordForm = ({ email, onClose, onSuccess }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [verificationSent, setVerificationSent] = useState(false);
//   const [step, setStep] = useState(1); // 1: Enter code, 2: Reset password
//   const [resendLoading, setResendLoading] = useState(false);

//   // Step 1: Verification Code Schema
//   const verificationSchema = Yup.object({
//     verificationCode: Yup.string()
//       .required('Verification code is required')
//       .length(4, 'Verification code must be 4 digits')
//   });

//   // Step 2: Password Reset Schema
//   const passwordSchema = Yup.object({
//     newPassword: Yup.string()
//       .required('Password is required')
//       .min(8, 'Password must be at least 8 characters')
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
//         'Password must contain at least one uppercase letter, one number, and one special character'
//       ),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
//       .required('Please confirm your password')
//   });

//   // Formik for verification code step
//   const verificationFormik = useFormik({
//     initialValues: {
//       verificationCode: ''
//     },
//     validationSchema: verificationSchema,
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         // Verify the code with the server
//         const response = await axios.post('/api/auth/verify-reset-code', {
//           email,
//           code: values.verificationCode
//         });
        
//         if (response.data.success) {
//           toast.success('Code verified successfully');
//           setStep(2); // Move to password reset step
//         }
//       } catch (error) {
//         console.error('Verification error:', error.response?.data);
//         toast.error(error.response?.data?.message || 'Invalid verification code');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   });

//   // Formik for password reset step
//   const passwordFormik = useFormik({
//     initialValues: {
//       newPassword: '',
//       confirmPassword: ''
//     },
//     validationSchema: passwordSchema,
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         // Reset password with the verified code
//         const response = await axios.put('/api/auth/reset-password', {
//           email,
//           code: verificationFormik.values.verificationCode,
//           newPassword: values.newPassword
//         });
        
//         if (response.data.success) {
//           toast.success('Password reset successfully!');
//           onSuccess();
//         }
//       } catch (error) {
//         console.error('Password reset error:', error.response?.data);
//         toast.error(error.response?.data?.message || 'Failed to reset password');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   });

//   // Handle resend verification code
//   const handleResendCode = async () => {
//     setResendLoading(true);
//     try {
//       const response = await axios.post('/api/auth/resend-reset-code', { email });
//       if (response.data.success) {
//         toast.success('New verification code sent to your email');
//       }
//     } catch (error) {
//       console.error('Resend error:', error.response?.data);
//       toast.error(error.response?.data?.message || 'Failed to resend code');
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <>
//       <Modal.Header closeButton>
//         <Modal.Title className="w-100 text-center">
//           {step === 1 ? 'Verify Your Identity' : 'Reset Your Password'}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {step === 1 ? (
//           // Step 1: Verification Code Form
//           <Form onSubmit={verificationFormik.handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Verification Code</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="verificationCode"
//                 placeholder="Enter the 4-digit code sent to your email"
//                 onChange={verificationFormik.handleChange}
//                 onBlur={verificationFormik.handleBlur}
//                 value={verificationFormik.values.verificationCode}
//                 isInvalid={verificationFormik.touched.verificationCode && 
//                            verificationFormik.errors.verificationCode}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {verificationFormik.errors.verificationCode}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <Button 
//                 variant="link" 
//                 onClick={handleResendCode}
//                 disabled={resendLoading}
//               >
//                 {resendLoading ? 'Sending...' : 'Resend Code'}
//               </Button>
              
//               <span className="text-muted small">
//                 Sent to: {email}
//               </span>
//             </div>

//             <Button 
//               variant="primary" 
//               type="submit" 
//               className="w-100 btn-airchat"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Verifying...' : 'Verify Code'}
//             </Button>
//           </Form>
//         ) : (
//           // Step 2: Password Reset Form
//           <Form onSubmit={passwordFormik.handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>New Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="newPassword"
//                 placeholder="Enter your new password"
//                 onChange={passwordFormik.handleChange}
//                 onBlur={passwordFormik.handleBlur}
//                 value={passwordFormik.values.newPassword}
//                 isInvalid={passwordFormik.touched.newPassword && 
//                            passwordFormik.errors.newPassword}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {passwordFormik.errors.newPassword}
//               </Form.Control.Feedback>
//               <Form.Text muted>
//                 Password must be at least 8 characters with one uppercase letter, 
//                 one number, and one special character.
//               </Form.Text>
//             </Form.Group>

//             <Form.Group className="mb-4">
//               <Form.Label>Confirm New Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm your new password"
//                 onChange={passwordFormik.handleChange}
//                 onBlur={passwordFormik.handleBlur}
//                 value={passwordFormik.values.confirmPassword}
//                 isInvalid={passwordFormik.touched.confirmPassword && 
//                            passwordFormik.errors.confirmPassword}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {passwordFormik.errors.confirmPassword}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <div className="d-flex justify-content-between mb-3">
//               <Button 
//                 variant="outline-secondary" 
//                 onClick={() => setStep(1)}
//               >
//                 Back to Verification
//               </Button>
              
//               <Button 
//                 variant="primary" 
//                 type="submit" 
//                 className="btn-airchat"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Resetting...' : 'Reset Password'}
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Modal.Body>
//     </>
//   );
// };

// export default ResetPasswordForm;


// components/ResetPasswordForm.js
import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPasswordForm = ({ email, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter code, 2: Reset password
  const [resendLoading, setResendLoading] = useState(false);

  // Step 1: Verification Code Schema
  const verificationSchema = Yup.object({
    verificationCode: Yup.string()
      .required('Verification code is required')
      .length(4, 'Verification code must be 4 digits')
  });

  // Step 2: Password Reset Schema
  const passwordSchema = Yup.object({
    newPassword: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain uppercase, number, and special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password')
  });

  // Formik for verification code step
  const verificationFormik = useFormik({
    initialValues: {
      verificationCode: ''
    },
    validationSchema: verificationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/auth/verify-reset-code', {
          email,
          code: values.verificationCode
        });
        
        if (response.data.success) {
          toast.success('Code verified successfully');
          setStep(2);
        }
      } catch (error) {
        console.error('Verification error:', error.response?.data);
        toast.error(error.response?.data?.message || 'Invalid verification code');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Formik for password reset step
  const passwordFormik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.put('/api/auth/reset-password', {
          email,
          code: verificationFormik.values.verificationCode,
          newPassword: values.newPassword
        });
        
        if (response.data.success) {
          toast.success('Password reset successfully!');
          onSuccess(response.data.token, response.data.user);
        }
      } catch (error) {
        console.error('Password reset error:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to reset password');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Handle resend verification code
  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post('/api/auth/resend-reset-code', { email });
      if (response.data.success) {
        toast.success('New verification code sent to your email');
      }
    } catch (error) {
      console.error('Resend error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          {step === 1 ? 'Verify Your Identity' : 'Reset Your Password'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 ? (
          <Form onSubmit={verificationFormik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                name="verificationCode"
                placeholder="Enter the 4-digit code"
                onChange={verificationFormik.handleChange}
                onBlur={verificationFormik.handleBlur}
                value={verificationFormik.values.verificationCode}
                isInvalid={verificationFormik.touched.verificationCode && 
                           verificationFormik.errors.verificationCode}
              />
              <Form.Control.Feedback type="invalid">
                {verificationFormik.errors.verificationCode}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button 
                variant="link" 
                onClick={handleResendCode}
                disabled={resendLoading}
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Button>
              
              <span className="text-muted small">
                Sent to: {email}
              </span>
            </div>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 btn-airchat"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={passwordFormik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                value={passwordFormik.values.newPassword}
                isInvalid={passwordFormik.touched.newPassword && 
                           passwordFormik.errors.newPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.newPassword}
              </Form.Control.Feedback>
              <Form.Text muted>
                Must include uppercase, number, and special character
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                value={passwordFormik.values.confirmPassword}
                isInvalid={passwordFormik.touched.confirmPassword && 
                           passwordFormik.errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between mb-3">
              <Button 
                variant="outline-secondary" 
                onClick={() => setStep(1)}
              >
                Back to Verification
              </Button>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="btn-airchat"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </>
  );
};

export default ResetPasswordForm;
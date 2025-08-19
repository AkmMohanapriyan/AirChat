// import React, { useState } from 'react';
// import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import './SignupForm.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const SignupForm = ({ onClose, onSuccess, onSwitchToLogin }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const validationSchema = Yup.object({
//     firstName: Yup.string()
//       .required('First name is required')
//       .max(50, 'First name must be 50 characters or less'),
//     lastName: Yup.string()
//       .required('Last name is required')
//       .max(50, 'Last name must be 50 characters or less'),
//     email: Yup.string()
//       .email('Invalid email address')
//       .required('Email is required'),
//     password: Yup.string()
//       .required('Password is required')
//       .min(8, 'Password must be at least 8 characters')
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
//         'Password must contain at least one uppercase letter, one number, and one special character'
//       )
//       .notOneOf(['.', ',', ':'], 'Password cannot contain full stop, comma, or colon'),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('password'), null], 'Passwords must match')
//       .required('Please confirm your password'),
//     age: Yup.number()
//       .required('Age is required')
//       .min(13, 'You must be at least 13 years old')
//       .max(120, 'Age must be reasonable'),
//     country: Yup.string()
//       .required('Country is required'),
//     phoneNumber: Yup.string()
//       .required('Phone number is required')
//   });

//   const formik = useFormik({
//     initialValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       age: '',
//       country: '',
//       phoneNumber: '',
//       profilePhoto: null
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         const formData = new FormData();

//         // Append all text fields
//         formData.append('firstName', values.firstName);
//         formData.append('lastName', values.lastName);
//         formData.append('email', values.email);
//         formData.append('password', values.password);
//         formData.append('age', values.age);
//         formData.append('country', values.country);
//         formData.append('phoneNumber', values.phoneNumber);

//         // Append profile photo if exists
//         if (values.profilePhoto) {
//           formData.append('profilePhoto', values.profilePhoto);
//         }

//         const response = await axios.post('/api/auth/register', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         if (response.data.success) {
//           onSuccess(response.data.userId);
//           toast.success(`Verification code sent to ${values.email}`);
//         }
//       } catch (error) {
//         // Enhanced error handling
//         const errorMessage = error.response?.data?.message ||
//           (error.response?.status === 413
//             ? 'File too large (max 5MB)'
//             : 'Registration failed');

//         toast.error(errorMessage);

//         // Log detailed error for debugging
//         console.error('Registration error:', {
//           error: error.response?.data,
//           status: error.response?.status,
//           config: error.config
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   });

//   const handleFileChange = (event) => {
//     formik.setFieldValue('profilePhoto', event.currentTarget.files[0]);
//   };

//   return (
//     <>

//       <Modal.Header className=" signup-modal-body position-relative p-4 pb-2">
//         <div className="w-100 text-center">
//           <Modal.Title style={{ fontWeight: 'bold' }}>
//             Create AirChat Account
//           </Modal.Title>
//         </div>
//       </Modal.Header>
//       <Modal.Body className="  pt-3" style={{ padding: '0 1.5rem 1.5rem' }}>
//         <Form onSubmit={formik.handleSubmit} className="signup-form">
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3 position-relative">
//                 <Form.Label>First Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="firstName"
//                   placeholder="Enter your first name"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.firstName}
//                   isInvalid={formik.touched.firstName && formik.errors.firstName}
//                   className="ps-5 input-field"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.firstName}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3 position-relative">
//                 <Form.Label>Last Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="lastName"
//                   placeholder="Enter your last name"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.lastName}
//                   isInvalid={formik.touched.lastName && formik.errors.lastName}
//                   className="ps-5 input-field"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.lastName}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3">
//             <Form.Label>Profile Photo</Form.Label>
//             <Form.Control
//               type="file"
//               name="profilePhoto"
//               accept="image/*"
//               onChange={handleFileChange}
//               onBlur={formik.handleBlur}
//               className="custom-file-input"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3 position-relative">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//               isInvalid={formik.touched.email && formik.errors.email}
//               className="ps-5 input-field"
//             />
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.email}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Age</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="age"
//                   placeholder="Enter your age"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.age}
//                   isInvalid={formik.touched.age && formik.errors.age}
//                   className="input-field"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.age}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Country</Form.Label>
//                 <Form.Control
//                   as="select"
//                   name="country"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.country}
//                   isInvalid={formik.touched.country && formik.errors.country}
//                   className="input-field"
//                 >
//                   <option value="">Select your country</option>
//                   <option value="Afghanistan">Afghanistan</option>
//                   <option value="Albania">Albania</option>
//                   <option value="Algeria">Algeria</option>
//                   <option value="Andorra">Andorra</option>
//                   <option value="Angola">Angola</option>
//                   <option value="Argentina">Argentina</option>
//                   <option value="Armenia">Armenia</option>
//                   <option value="Australia">Australia</option>
//                   <option value="Austria">Austria</option>
//                   <option value="Azerbaijan">Azerbaijan</option>
//                   <option value="Bahamas">Bahamas</option>
//                   <option value="Bahrain">Bahrain</option>
//                   <option value="Bangladesh">Bangladesh</option>
//                   <option value="Belarus">Belarus</option>
//                   <option value="Belgium">Belgium</option>
//                   <option value="Belize">Belize</option>
//                   <option value="Benin">Benin</option>
//                   <option value="Bhutan">Bhutan</option>
//                   <option value="Bolivia">Bolivia</option>
//                   <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
//                   <option value="Botswana">Botswana</option>
//                   <option value="Brazil">Brazil</option>
//                   <option value="Brunei">Brunei</option>
//                   <option value="Bulgaria">Bulgaria</option>
//                   <option value="Burkina Faso">Burkina Faso</option>
//                   <option value="Burundi">Burundi</option>
//                   <option value="Cambodia">Cambodia</option>
//                   <option value="Cameroon">Cameroon</option>
//                   <option value="Canada">Canada</option>
//                   <option value="Chad">Chad</option>
//                   <option value="Chile">Chile</option>
//                   <option value="China">China</option>
//                   <option value="Colombia">Colombia</option>
//                   <option value="Costa Rica">Costa Rica</option>
//                   <option value="Croatia">Croatia</option>
//                   <option value="Cuba">Cuba</option>
//                   <option value="Cyprus">Cyprus</option>
//                   <option value="Czech Republic">Czech Republic</option>
//                   <option value="Denmark">Denmark</option>
//                   <option value="Djibouti">Djibouti</option>
//                   <option value="Dominica">Dominica</option>
//                   <option value="Dominican Republic">Dominican Republic</option>
//                   <option value="Ecuador">Ecuador</option>
//                   <option value="Egypt">Egypt</option>
//                   <option value="El Salvador">El Salvador</option>
//                   <option value="Estonia">Estonia</option>
//                   <option value="Eswatini">Eswatini</option>
//                   <option value="Ethiopia">Ethiopia</option>
//                   <option value="Fiji">Fiji</option>
//                   <option value="Finland">Finland</option>
//                   <option value="France">France</option>
//                   <option value="Gabon">Gabon</option>
//                   <option value="Gambia">Gambia</option>
//                   <option value="Georgia">Georgia</option>
//                   <option value="Germany">Germany</option>
//                   <option value="Ghana">Ghana</option>
//                   <option value="Greece">Greece</option>
//                   <option value="Grenada">Grenada</option>
//                   <option value="Guatemala">Guatemala</option>
//                   <option value="Guinea">Guinea</option>
//                   <option value="Guyana">Guyana</option>
//                   <option value="Haiti">Haiti</option>
//                   <option value="Honduras">Honduras</option>
//                   <option value="Hungary">Hungary</option>
//                   <option value="Iceland">Iceland</option>
//                   <option value="India">India</option>
//                   <option value="Indonesia">Indonesia</option>
//                   <option value="Iran">Iran</option>
//                   <option value="Iraq">Iraq</option>
//                   <option value="Ireland">Ireland</option>
//                   <option value="Israel">Israel</option>
//                   <option value="Italy">Italy</option>
//                   <option value="Jamaica">Jamaica</option>
//                   <option value="Japan">Japan</option>
//                   <option value="Jordan">Jordan</option>
//                   <option value="Kazakhstan">Kazakhstan</option>
//                   <option value="Kenya">Kenya</option>
//                   <option value="Kiribati">Kiribati</option>
//                   <option value="Kuwait">Kuwait</option>
//                   <option value="Kyrgyzstan">Kyrgyzstan</option>
//                   <option value="Laos">Laos</option>
//                   <option value="Latvia">Latvia</option>
//                   <option value="Lebanon">Lebanon</option>
//                   <option value="Lesotho">Lesotho</option>
//                   <option value="Liberia">Liberia</option>
//                   <option value="Libya">Libya</option>
//                   <option value="Liechtenstein">Liechtenstein</option>
//                   <option value="Lithuania">Lithuania</option>
//                   <option value="Luxembourg">Luxembourg</option>
//                   <option value="Madagascar">Madagascar</option>
//                   <option value="Malawi">Malawi</option>
//                   <option value="Malaysia">Malaysia</option>
//                   <option value="Maldives">Maldives</option>
//                   <option value="Mali">Mali</option>
//                   <option value="Malta">Malta</option>
//                   <option value="Marshall Islands">Marshall Islands</option>
//                   <option value="Mauritania">Mauritania</option>
//                   <option value="Mauritius">Mauritius</option>
//                   <option value="Mexico">Mexico</option>
//                   <option value="Micronesia">Micronesia</option>
//                   <option value="Moldova">Moldova</option>
//                   <option value="Monaco">Monaco</option>
//                   <option value="Mongolia">Mongolia</option>
//                   <option value="Montenegro">Montenegro</option>
//                   <option value="Morocco">Morocco</option>
//                   <option value="Mozambique">Mozambique</option>
//                   <option value="Myanmar">Myanmar</option>
//                   <option value="Namibia">Namibia</option>
//                   <option value="Nauru">Nauru</option>
//                   <option value="Nepal">Nepal</option>
//                   <option value="Netherlands">Netherlands</option>
//                   <option value="New Zealand">New Zealand</option>
//                   <option value="Nicaragua">Nicaragua</option>
//                   <option value="Niger">Niger</option>
//                   <option value="Nigeria">Nigeria</option>
//                   <option value="North Korea">North Korea</option>
//                   <option value="North Macedonia">North Macedonia</option>
//                   <option value="Norway">Norway</option>
//                   <option value="Oman">Oman</option>
//                   <option value="Pakistan">Pakistan</option>
//                   <option value="Palau">Palau</option>
//                   <option value="Panama">Panama</option>
//                   <option value="Papua New Guinea">Papua New Guinea</option>
//                   <option value="Paraguay">Paraguay</option>
//                   <option value="Peru">Peru</option>
//                   <option value="Philippines">Philippines</option>
//                   <option value="Poland">Poland</option>
//                   <option value="Portugal">Portugal</option>
//                   <option value="Qatar">Qatar</option>
//                   <option value="Romania">Romania</option>
//                   <option value="Russia">Russia</option>
//                   <option value="Rwanda">Rwanda</option>
//                   <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
//                   <option value="Saint Lucia">Saint Lucia</option>
//                   <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
//                   <option value="Samoa">Samoa</option>
//                   <option value="San Marino">San Marino</option>
//                   <option value="Sao Tome and Principe">Sao Tome and Principe</option>
//                   <option value="Saudi Arabia">Saudi Arabia</option>
//                   <option value="Senegal">Senegal</option>
//                   <option value="Serbia">Serbia</option>
//                   <option value="Seychelles">Seychelles</option>
//                   <option value="Sierra Leone">Sierra Leone</option>
//                   <option value="Singapore">Singapore</option>
//                   <option value="Slovakia">Slovakia</option>
//                   <option value="Slovenia">Slovenia</option>
//                   <option value="Solomon Islands">Solomon Islands</option>
//                   <option value="Somalia">Somalia</option>
//                   <option value="South Africa">South Africa</option>
//                   <option value="South Korea">South Korea</option>
//                   <option value="South Sudan">South Sudan</option>
//                   <option value="Spain">Spain</option>
//                   <option value="Sri Lanka">Sri Lanka</option>
//                   <option value="Sudan">Sudan</option>
//                   <option value="Suriname">Suriname</option>
//                   <option value="Sweden">Sweden</option>
//                   <option value="Switzerland">Switzerland</option>
//                   <option value="Syria">Syria</option>
//                   <option value="Taiwan">Taiwan</option>
//                   <option value="Tajikistan">Tajikistan</option>
//                   <option value="Tanzania">Tanzania</option>
//                   <option value="Thailand">Thailand</option>
//                   <option value="Togo">Togo</option>
//                   <option value="Tonga">Tonga</option>
//                   <option value="Trinidad and Tobago">Trinidad and Tobago</option>
//                   <option value="Tunisia">Tunisia</option>
//                   <option value="Turkey">Turkey</option>
//                   <option value="Turkmenistan">Turkmenistan</option>
//                   <option value="Tuvalu">Tuvalu</option>
//                   <option value="Uganda">Uganda</option>
//                   <option value="Ukraine">Ukraine</option>
//                   <option value="United Arab Emirates">United Arab Emirates</option>
//                   <option value="United Kingdom">United Kingdom</option>
//                   <option value="United States">United States</option>
//                   <option value="Uruguay">Uruguay</option>
//                   <option value="Uzbekistan">Uzbekistan</option>
//                   <option value="Vanuatu">Vanuatu</option>
//                   <option value="Vatican City">Vatican City</option>
//                   <option value="Venezuela">Venezuela</option>
//                   <option value="Vietnam">Vietnam</option>
//                   <option value="Yemen">Yemen</option>
//                   <option value="Zambia">Zambia</option>
//                   <option value="Zimbabwe">Zimbabwe</option>

//                 </Form.Control>
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.country}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3 position-relative">
//             <Form.Label>Phone Number</Form.Label>
//             <Form.Control
//               type="tel"
//               name="phoneNumber"
//               placeholder="Enter your phone number"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.phoneNumber}
//               isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
//               className="ps-5 input-field"
//             />
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.phoneNumber}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3 position-relative">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Enter your password"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.password}
//               isInvalid={formik.touched.password && formik.errors.password}
//               className="ps-5 input-field"
//             />
//             <div
//               className="password-toggle"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.password}
//             </Form.Control.Feedback>
//             <Form.Text muted className="mt-1">
//               Password must be at least 8 characters with one uppercase letter, one number, and one special character.
//             </Form.Text>
//           </Form.Group>

//           <Form.Group className="mb-4 position-relative">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               placeholder="Confirm your password"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.confirmPassword}
//               isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
//               className="ps-5 input-field"
//             />
//             <div
//               className="password-toggle"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             >
//               {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.confirmPassword}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <div className="text-center mb-3">
//             Already have an account?&nbsp;&nbsp;
//             <span
//               className="link-primary"
//               onClick={onSwitchToLogin}
//               style={{ cursor: 'pointer', color: '#1da1f2', fontWeight: 500 }}
//             >
//               Login
//             </span>
//           </div>

//           <Button
//             variant="primary"
//             type="submit"
//             className="w-100 login-btn"
//             disabled={isLoading}
//             style={{
//               backgroundColor: '#1da1f2',
//               borderColor: '#1da1f2',
//               fontWeight: 'bold',
//               padding: '0.75rem',
//               borderRadius: '50px'
//             }}
//           >
//             {isLoading ? (
//               <div className="spinner-border spinner-border-sm" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             ) : 'Sign Up'}
//           </Button>
//         </Form>
//       </Modal.Body>

//     </>
//   );
// };

// export default SignupForm;



// import React, { useState } from 'react';
// import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import './SignupForm.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const SignupForm = ({ onClose, onSuccess, onSwitchToLogin }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const validationSchema = Yup.object({
//     firstName: Yup.string()
//       .required('First name is required')
//       .max(50, 'First name must be 50 characters or less'),
//     lastName: Yup.string()
//       .required('Last name is required')
//       .max(50, 'Last name must be 50 characters or less'),
//     email: Yup.string()
//       .email('Invalid email address')
//       .required('Email is required'),
//     password: Yup.string()
//       .required('Password is required')
//       .min(8, 'Password must be at least 8 characters')
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
//         'Password must contain at least one uppercase letter, one number, and one special character'
//       )
//       .notOneOf(['.', ',', ':'], 'Password cannot contain full stop, comma, or colon'),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('password'), null], 'Passwords must match')
//       .required('Please confirm your password'),
//     age: Yup.number()
//       .required('Age is required')
//       .min(13, 'You must be at least 13 years old')
//       .max(120, 'Age must be reasonable'),
//     country: Yup.string()
//       .required('Country is required'),
//     phoneNumber: Yup.string()
//       .required('Phone number is required')
//   });

//   const formik = useFormik({
//     initialValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       age: '',
//       country: '',
//       phoneNumber: '',
//       profilePhoto: null
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         const formData = new FormData();

//         formData.append('firstName', values.firstName);
//         formData.append('lastName', values.lastName);
//         formData.append('email', values.email);
//         formData.append('password', values.password);
//         formData.append('age', values.age);
//         formData.append('country', values.country);
//         formData.append('phoneNumber', values.phoneNumber);

//         if (values.profilePhoto) {
//           formData.append('profilePhoto', values.profilePhoto);
//         }

//         const response = await axios.post('/api/auth/register', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });

//         if (response.data.success) {
//           onSuccess(response.data.userId);
//           toast.success(`Verification code sent to ${values.email}`);
//         }
//       } catch (error) {
//         const errorMessage = error.response?.data?.message ||
//           (error.response?.status === 413
//             ? 'File too large (max 5MB)'
//             : 'Registration failed');

//         toast.error(errorMessage);

//         console.error('Registration error:', {
//           error: error.response?.data,
//           status: error.response?.status,
//           config: error.config
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   });

//   const handleFileChange = (event) => {
//     formik.setFieldValue('profilePhoto', event.currentTarget.files[0]);
//   };

//   return (
//     <>
//       <Modal.Header className="signup-modal-body position-relative p-4 pb-2">
//         <div className="w-100 text-center">
//           <Modal.Title style={{ fontWeight: 'bold' }}>
//             Create AirChat Account
//           </Modal.Title>
//         </div>
//       </Modal.Header>

//       {/* Scrollable Modal Body */}
//       <Modal.Body
//         style={{
//           maxHeight: '70vh',
//           overflowY: 'auto',
//           padding: '1.5rem'
//         }}
//       >
//         <Form onSubmit={formik.handleSubmit} className="signup-form">
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3 position-relative">
//                 <Form.Label>First Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="firstName"
//                   placeholder="Enter your first name"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.firstName}
//                   isInvalid={formik.touched.firstName && formik.errors.firstName}
//                   className="ps-5 input-field"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.firstName}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3 position-relative">
//                 <Form.Label>Last Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="lastName"
//                   placeholder="Enter your last name"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.lastName}
//                   isInvalid={formik.touched.lastName && formik.errors.lastName}
//                   className="ps-5 input-field"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.lastName}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3">
//             <Form.Label>Profile Photo</Form.Label>
//             <Form.Control
//               type="file"
//               name="profilePhoto"
//               accept="image/*"
//               onChange={handleFileChange}
//               onBlur={formik.handleBlur}
//               className="custom-file-input"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3 position-relative">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//               isInvalid={formik.touched.email && formik.errors.email}
//               className="ps-5 input-field"
//             />
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.email}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Age</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="age"
//                   placeholder="Enter your age"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.age}
//                   isInvalid={formik.touched.age && formik.errors.age}
//                   className="input-field"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.age}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Country</Form.Label>
//                 <Form.Control
//                   as="select"
//                   name="country"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.country}
//                   isInvalid={formik.touched.country && formik.errors.country}
//                   className="input-field"
//                 >
//                   <option value="">Select your country</option>
//                   {/* Countries options here */}
//                   <option value="Sri Lanka">Sri Lanka</option>
//                   <option value="India">India</option>
//                   <option value="United States">United States</option>
//                 </Form.Control>
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.country}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3 position-relative">
//             <Form.Label>Phone Number</Form.Label>
//             <Form.Control
//               type="tel"
//               name="phoneNumber"
//               placeholder="Enter your phone number"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.phoneNumber}
//               isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
//               className="ps-5 input-field"
//             />
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.phoneNumber}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3 position-relative">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               placeholder="Enter your password"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.password}
//               isInvalid={formik.touched.password && formik.errors.password}
//               className="ps-5 input-field"
//             />
//             <div
//               className="password-toggle"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.password}
//             </Form.Control.Feedback>
//             <Form.Text muted className="mt-1">
//               Password must be at least 8 characters with one uppercase letter, one number, and one special character.
//             </Form.Text>
//           </Form.Group>

//           <Form.Group className="mb-4 position-relative">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type={showConfirmPassword ? 'text' : 'password'}
//               name="confirmPassword"
//               placeholder="Confirm your password"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.confirmPassword}
//               isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
//               className="ps-5 input-field"
//             />
//             <div
//               className="password-toggle"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             >
//               {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//             <Form.Control.Feedback type="invalid">
//               {formik.errors.confirmPassword}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <div className="text-center mb-3">
//             Already have an account?&nbsp;&nbsp;
//             <span
//               className="link-primary"
//               onClick={onSwitchToLogin}
//               style={{ cursor: 'pointer', color: '#1da1f2', fontWeight: 500 }}
//             >
//               Login
//             </span>
//           </div>

//           <Button
//             variant="primary"
//             type="submit"
//             className="w-100 login-btn"
//             disabled={isLoading}
//             style={{
//               backgroundColor: '#1da1f2',
//               borderColor: '#1da1f2',
//               fontWeight: 'bold',
//               padding: '0.75rem',
//               borderRadius: '50px'
//             }}
//           >
//             {isLoading ? (
//               <div className="spinner-border spinner-border-sm" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             ) : 'Sign Up'}
//           </Button>
//         </Form>
//       </Modal.Body>
//     </>
//   );
// };

// export default SignupForm;


import React, { useState } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaGlobe } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignupForm.css';

const SignupForm = ({ onClose, onSuccess, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('age', values.age);
        formData.append('country', values.country);
        formData.append('phoneNumber', values.phoneNumber);

        if (values.profilePhoto) {
          formData.append('profilePhoto', values.profilePhoto);
        }

        const response = await axios.post('/api/auth/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.success) {
          onSuccess(response.data.userId);
          toast.success(`Verification code sent to ${values.email}`);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message ||
          (error.response?.status === 413
            ? 'File too large (max 5MB)'
            : 'Registration failed');

        toast.error(errorMessage);

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
      <Modal.Header className="signup-modal-header p-4 pb-3">
        <div className="w-100 text-center">
          <Modal.Title className="signup-title">
            Create AirChat Account
          </Modal.Title>
          <p className="signup-subtitle mt-2">Join the conversation with people around the world</p>
        </div>
      </Modal.Header>

      <Modal.Body className="signup-modal-body">
        <Form onSubmit={formik.handleSubmit} className="signup-form">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 form-group-custom">
                <Form.Label className="form-label-custom">First Name</Form.Label>
                <div className="input-container">
                  <span className="input-icon">
                    <FaUser />
                  </span>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    isInvalid={formik.touched.firstName && formik.errors.firstName}
                    className="input-field-custom"
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="feedback-invalid">
                  {formik.errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3 form-group-custom">
                <Form.Label className="form-label-custom">Last Name</Form.Label>
                <div className="input-container">
                  <span className="input-icon">
                    <FaUser />
                  </span>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    isInvalid={formik.touched.lastName && formik.errors.lastName}
                    className="input-field-custom"
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="feedback-invalid">
                  {formik.errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3 form-group-custom">
            <Form.Label className="form-label-custom">Profile Photo</Form.Label>
            <Form.Control
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
              onBlur={formik.handleBlur}
              className="custom-file-input"
            />
            <Form.Text className="file-input-help">
              Optional - JPG, PNG or GIF. Max 5MB
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 form-group-custom">
            <Form.Label className="form-label-custom">Email</Form.Label>
            <div className="input-container">
              <span className="input-icon">
                <FaEnvelope />
              </span>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                isInvalid={formik.touched.email && formik.errors.email}
                className="input-field-custom"
              />
            </div>
            <Form.Control.Feedback type="invalid" className="feedback-invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 form-group-custom">
                <Form.Label className="form-label-custom">Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.age}
                  isInvalid={formik.touched.age && formik.errors.age}
                  className="input-field-custom"
                />
                <Form.Control.Feedback type="invalid" className="feedback-invalid">
                  {formik.errors.age}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3 form-group-custom">
                <Form.Label className="form-label-custom">Country</Form.Label>
                <div className="input-container">
                  <span className="input-icon">
                    <FaGlobe />
                  </span>
                  <Form.Control
                    as="select"
                    name="country"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
                    isInvalid={formik.touched.country && formik.errors.country}
                    className="input-field-custom"
                  >
                    <option value="">Select your country</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </Form.Control>
                </div>
                <Form.Control.Feedback type="invalid" className="feedback-invalid">
                  {formik.errors.country}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3 form-group-custom">
            <Form.Label className="form-label-custom">Phone Number</Form.Label>
            <div className="input-container">
              <span className="input-icon">
                <FaPhone />
              </span>
              <Form.Control
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
                className="input-field-custom"
              />
            </div>
            <Form.Control.Feedback type="invalid" className="feedback-invalid">
              {formik.errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 form-group-custom">
            <Form.Label className="form-label-custom">Password</Form.Label>
            <div className="input-container">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isInvalid={formik.touched.password && formik.errors.password}
                className="input-field-custom"
              />
              <div
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <Form.Control.Feedback type="invalid" className="feedback-invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
            <Form.Text className="password-help-text">
              Password must be at least 8 characters with one uppercase letter, one number, and one special character.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4 form-group-custom">
            <Form.Label className="form-label-custom">Confirm Password</Form.Label>
            <div className="input-container">
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                className="input-field-custom"
              />
              <div
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <Form.Control.Feedback type="invalid" className="feedback-invalid">
              {formik.errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="text-center mb-3 account-prompt">
            Already have an account?&nbsp;&nbsp;
            <span
              className="switch-link"
              onClick={onSwitchToLogin}
            >
              Login
            </span>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-100 signup-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : 'Sign Up'}
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default SignupForm;

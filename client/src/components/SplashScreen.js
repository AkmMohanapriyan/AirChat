import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <Container fluid className="splash-screen d-flex flex-column justify-content-center align-items-center">
      <h1 className="display-3 mb-4 text-primary">AirChat</h1>
      <Spinner animation="border" variant="primary" />
    </Container>
  );
};

export default SplashScreen;
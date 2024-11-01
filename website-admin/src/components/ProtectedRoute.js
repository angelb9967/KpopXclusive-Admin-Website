import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import '../styles/ProtectedRoute.css';
import logo1 from '../assets/Logo 1.png'; 
import logo2 from '../assets/Logo 2.png'; 
import '../styles/Login.css'; 

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();

  // If the user is not logged in, show the unauthorized message
  if (!isAuthenticated) {
    return (
      <div className="protected-route">
        <div className='login-divider'>
          <img src={logo1} className="login-image" alt="Logo 1" />
          <div className="divider" />
          <img src={logo2} className="login-image" alt="Logo 2" />
        </div>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Link to="/" state={{ from: location }}>
              <Button type="primary">Go to Login</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

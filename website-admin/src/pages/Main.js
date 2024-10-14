import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import '../styles/Main.css';
import logo1 from '../assets/Logo 1.png';
import 'boxicons/css/boxicons.min.css';

const Main = () => {
  const location = useLocation(); 
  const [title, setTitle] = useState('Dashboard'); 

  const updateTitle = () => {
    switch (location.pathname) {
      case '/Main/Dashboard':
        setTitle('DASHBOARD');
        break;
      case '/Main/User-Management':
        setTitle('USER MANAGEMENT');
        break;
      case '/Main/Admin-Approval':
        setTitle('ADMIN APPROVAL');
        break;
      case '/Main/Information-Handler':
        setTitle('INFORMATION HANDLER');
        break;
      case '/Main/Access-Website':
        setTitle('ACCESS WEBSITE');
        break;
      default:
        setTitle('DASHBOARD'); 
    }
  };

  useEffect(() => {
    updateTitle();
  }, [location]);

  return (
    <div className='main-container'>
      <div className='main-navbar'>
        <img src={logo1} className="main-image" alt="Logo 1" />
        <div className="vertical-divider"></div>
        <h2 className='main-title'>{title}</h2> 
      </div>

      <div className='main-sidebar'>
        <div className='sidebar-content'>
          <h2 className='sidebar-greet'>WELCOME,<br/>USER ACCOUNT!</h2>
          <ul className="lists">
            <li className="list">
              <Link to="/Main/Dashboard" className="nav-link">
                <i className='bx bxs-dashboard'></i> 
                <span className="link">DASHBOARD</span>
              </Link>
            </li>
            <li className="list">
              <Link to="/Main/User-Management" className="nav-link">
                <i className='bx bxs-user'></i> 
                <span className="link">USER MANAGEMENT</span>
              </Link>
            </li>
            <li className="list">
              <Link to="/Main/Admin-Approval" className="nav-link">
                <i className='bx bx-check'></i>
                <span className="link">ADMIN APPROVAL</span>
              </Link>
            </li>
            <li className="list">
              <Link to="/Main/Information-Handler" className="nav-link">
                <i className='bx bxs-info-circle'></i> 
                <span className="link">INFORMATION HANDLER</span>
              </Link>
            </li>
            <li className="list">
              <Link to="/Main/Access-Website" className="nav-link">
                <i className='bx bx-desktop'></i> 
                <span className="link">ACCESS WEBSITE</span>
              </Link>
            </li>
            <li className="list">
              <Link to="/" className="nav-link logout">
                <i className='bx bx-log-out'></i> 
                <span className="link">LOGOUT</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='section-content'>
        <Outlet /> {/* This is where the nested components will render */}
      </div>
    </div>
  );
};

export default Main;

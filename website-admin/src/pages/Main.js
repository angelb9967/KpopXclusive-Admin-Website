import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Main.css';
import logo1 from '../assets/Logo 1.png';
import 'boxicons/css/boxicons.min.css';
import { Modal } from 'antd'; // Import Modal from Ant Design

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(true); // New state for sidebar collapse
  const [showSubmenu, setShowSubmenu] = useState(false); // New state for submenu visibility

  const toggleSidebar = () => {
    setCollapsed(!collapsed); // Toggle the sidebar state
  };

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
      case '/Main/Information-Handler/Idols':
      case '/Main/Information-Handler/Groups':
        setTitle('INFORMATION HANDLER');
        break;
      case '/Main/Access-Website':
        setTitle('ACCESS WEBSITE');
        break;
      case '/Main/Create-News':
        setTitle('CREATE NEWS');
        break;
      default:
        setTitle('DASHBOARD');
    }
  };

  useEffect(() => {
    updateTitle();
  }, [location]);

  const confirmLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      onOk() {
        navigate("/");
        localStorage.removeItem("isAuthenticated");
        console.log('User logged out');
      },
      onCancel() {
        console.log('Logout canceled');
      },
    });
  };

  return (
    <div className='main-container'>
      <div className='main-navbar'>
        <img src={logo1} className="main-image" alt="Logo 1" />
        <div className="vertical-divider"></div>
        <h2 className='main-title'>{title}</h2>
      </div>

      <div className={`main-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className='sidebar-content'>
          <button onClick={toggleSidebar} className="toggle-btn">
            <i className={`bx ${collapsed ? 'bx-menu' : 'bx-x'}`}></i>
          </button>

          {!collapsed && (
            <>
              <h2 className='sidebar-greet'>WELCOME,<br />ADMIN ACCOUNT!</h2>
              <ul className="lists">
                <li className="list">
                  <Link to="/Main/Dashboard" className="nav-link">
                    <i className='bx bxs-dashboard'></i>
                    <span className={`link ${collapsed ? 'collapsed' : ''}`}>DASHBOARD</span>
                  </Link>
                </li>
                <li className="list">
                  <Link to="/Main/User-Management" className="nav-link">
                    <i className='bx bxs-user'></i>
                    <span className={`link ${collapsed ? 'collapsed' : ''}`}>USER MANAGEMENT</span>
                  </Link>
                </li>
                <li className="list" 
                    onMouseEnter={() => setShowSubmenu(true)} 
                    onMouseLeave={() => setShowSubmenu(false)}>
                  <span className="nav-link">
                    <i className='bx bxs-info-circle'></i>
                    <span className={`link ${collapsed ? 'collapsed' : ''}`}>INFORMATION HANDLER</span>
                  </span>
                  {showSubmenu && (
                    <ul className="submenu">
                      <li>
                        <Link to="/Main/Information-Handler/Idols" className="nav-link">
                          <i class='bx bxs-user'></i>
                          <span className={`link ${collapsed ? 'collapsed' : ''}`}>IDOLS</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/Main/Information-Handler/Groups" className="nav-link">
                          <i class='bx bxs-group' ></i>
                          <span className={`link ${collapsed ? 'collapsed' : ''}`}>GROUPS</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li className="list">
                  <Link to="/Main/Access-Website" className="nav-link">
                    <i className='bx bx-desktop'></i>
                    <span className={`link ${collapsed ? 'collapsed' : ''}`}>ACCESS WEBSITE</span>
                  </Link>
                </li>
                <li className="list">
                  <Link to="/Main/Create-News" className="nav-link">
                    <i class='bx bxs-news'></i>
                    <span className={`link ${collapsed ? 'collapsed' : ''}`}>CREATE NEWS</span>
                  </Link>
                </li>
                <li className="list">
                  <span onClick={confirmLogout} className="nav-link logout" style={{ cursor: 'pointer' }}>
                    <i className='bx bx-log-out'></i>
                    <span className={`link ${collapsed ? 'collapsed' : ''}`}>LOGOUT</span>
                  </span>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      <div className='section-content'>
        <Outlet /> {/* This is where the nested components will render */}
      </div>
    </div>
  );
};

export default Main;

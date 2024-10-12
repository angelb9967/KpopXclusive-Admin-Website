import '../styles/Dashboard.css';
import logo1 from '../assets/Logo 1.png';
import 'boxicons/css/boxicons.min.css'; // Import the Boxicons CSS

const Dashboard = () => {
  return (
    <div className='dashboard-container'>
        <div className='dashboard-navbar'>
            <img src={logo1} className="dashboard-image" alt="Logo 1" />
            <div className="vertical-divider"></div>
            <h2>DASHBOARD</h2>
        </div>

        <div className='dashboard-sidebar'>
            <div className='sidebar-content'>
                <h2 className='sidebar-greet'>WELCOME,<br/>USER ACCOUNT!</h2>
                <ul className="lists">
                    <div className="divider"></div>
                    <li className="list">
                        <a href="#" className="nav-link">
                          <i className='bx bxs-dashboard'></i> 
                          <span className="link">DASHBOARD</span>
                        </a>
                    </li>
                    <div className="divider"></div>
                    <li className="list">
                        <a href="#" className="nav-link">
                          <i className='bx bxs-user'></i> 
                          <span className="link">USER MANAGEMENT</span>
                        </a>
                    </li>
                    <div className="divider"></div>
                    <li className="list">
                        <a href="#" className="nav-link">
                        <i className='bx bx-check'></i>
                          <span className="link">ADMIN APPROVAL</span>
                        </a>
                    </li>
                    <div className="divider"></div>
                    <li className="list">
                        <a href="#" className="nav-link">
                          <i className='bx bxs-info-circle'></i> 
                          <span className="link">INFORMATION HANDLER</span>
                        </a>
                    </li>
                    <div className="divider"></div>
                    <li className="list">
                        <a href="#" className="nav-link">
                          <i className='bx bx-desktop'></i> 
                          <span className="link">ACCESS WEBSITE</span>
                        </a>
                    </li>
                    <div className="divider"></div>
                    <li className="list">
                        <a href="#" className="nav-link logout">
                          <i className='bx bx-log-out'></i> 
                          <span className="link">LOGOUT</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;

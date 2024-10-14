import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import AdminApproval from './components/AdminApproval';
import InformationHandler from './components/InformationHandler';
import AccessWebsite from './components/AccessWebsite';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login page */}
        <Route path="/Main" element={<Main />}> {/* Main layout */}
          <Route index element={<Dashboard />} /> {/* Default route for Main */}
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="User-Management" element={<UserManagement />} />
          <Route path="Admin-Approval" element={<AdminApproval />} />
          <Route path="Information-Handler" element={<InformationHandler />} />
          <Route path="Access-Website" element={<AccessWebsite />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

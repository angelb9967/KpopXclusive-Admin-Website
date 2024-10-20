import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import AdminApproval from './components/AdminApproval';
import InformationHandler from './components/InformationHandler';
import AccessWebsite from './components/AccessWebsite';
import IdolForm from './pages/IdolForm';
import GroupForm from './pages/GroupForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/EditGroup" element={<GroupForm/>} />
        <Route path="/EditIdol" element={<IdolForm/>} />
        <Route path="/Main" element={<Main/>}> 
        <Route index element={<Dashboard />} /> 
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

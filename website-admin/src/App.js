import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import InformationHandler from './components/InformationHandler';
import AccessWebsite from './components/AccessWebsite';
import IdolForm from './pages/IdolForm';
import GroupForm from './pages/GroupForm';
import IdolTable from './components/IdolTable';
import GroupTable from './components/GroupTable';
import CreateNews from './components/CreateNews';
import NewsForm from './components/NewsForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AddGroup" element={<GroupForm />} />
        <Route path="/EditGroup" element={<GroupForm />} />
        <Route path="/AddNews" element={<NewsForm />} />
        <Route path="/EditNews" element={<NewsForm />} />
        <Route path="/AddIdol" element={<IdolForm />} />
        <Route path="/EditIdol" element={<IdolForm />} />
        <Route path="/Main" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="User-Management" element={<UserManagement />} />
          <Route path="Information-Handler/Idols" element={<IdolTable />} />
          <Route path="Information-Handler/Groups" element={<GroupTable />} />
          <Route path="Access-Website" element={<AccessWebsite />} />
          <Route path="Create-News" element={<CreateNews />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

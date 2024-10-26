import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Dashboard from './pages/subpages/Dashboard';
import UserManagement from './pages/subpages/UserManagement';
import AccessWebsite from './components/AccessWebsite';
import IdolForm from './pages/forms/IdolForm';
import GroupForm from './pages/forms/GroupForm';
import IdolTable from './pages/subpages/IdolTable';
import GroupTable from './pages/subpages/GroupTable';
import CreateNews from './pages/subpages/CreateNews';
import NewsForm from './pages/forms/NewsForm';

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

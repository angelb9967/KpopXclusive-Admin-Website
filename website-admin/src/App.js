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
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AddGroup" element={<ProtectedRoute> <GroupForm/> </ProtectedRoute>} />
        <Route path="/EditGroup" element={<ProtectedRoute> <GroupForm/> </ProtectedRoute> } />
        <Route path="/AddNews" element={<ProtectedRoute> <NewsForm/> </ProtectedRoute>} />
        <Route path="/EditNews" element={<ProtectedRoute> <NewsForm/> </ProtectedRoute>} />
        <Route path="/AddIdol" element={<ProtectedRoute> <IdolForm /> </ProtectedRoute>} />
        <Route path="/EditIdol" element={<ProtectedRoute> <IdolForm /> </ProtectedRoute>} />
        <Route path="/Main" element={<ProtectedRoute> <Main/> </ProtectedRoute>}>
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="User-Management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="Information-Handler/Idols" element={<ProtectedRoute><IdolTable /></ProtectedRoute>} />
          <Route path="Information-Handler/Groups" element={<ProtectedRoute><GroupTable /></ProtectedRoute>} />
          <Route path="Access-Website" element={<ProtectedRoute><AccessWebsite /></ProtectedRoute>} />
          <Route path="Create-News" element={<ProtectedRoute><CreateNews/></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

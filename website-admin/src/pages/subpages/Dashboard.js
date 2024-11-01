import React, { useEffect, useState } from 'react';
import '../../styles/Dashboard.css';
import 'boxicons/css/boxicons.min.css';

const Dashboard = () => {
  const [numberOfAccounts, setNumberOfAccounts] = useState(0); 
  const [activeUsersCount, setActiveUsersCount] = useState(0); 
  const [totalLogins, setTotalLogins] = useState(0); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/users'); 
        if (response.ok) {
          const data = await response.json();
          setNumberOfAccounts(data.length);

          const activeUsers = data.filter(user => user.status === 'Active').length; 
          setActiveUsersCount(activeUsers);

          const totalLoginCounts = data.reduce((sum, user) => sum + user.loginCount, 0);
          setTotalLogins(totalLoginCounts);
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUserData(); 
  }, []);

  return (
    <div className='dashboard-container'>
      <div className='container-box'>
        <div className='header'>
          <i class='bx bx-window-open' style={{color:"white", marginRight:"5px", fontSize:"50px"}}></i><br/>
          Visitors<br/>on Website</div>
        <div className='content'>{totalLogins}</div>
      </div>
      <div className='container-box'>
        <div className='header'>
        <i class='bx bxs-user-account' style={{color:"white", marginRight:"5px", fontSize:"50px"}}></i><br/>
          Accounts Created<br/>on Website</div>
        <div className='content'>{numberOfAccounts}</div>
      </div>
      <div className='container-box'>
        <div className='header'>
        <i class='bx bxs-user-pin' style={{color:"white", marginRight:"5px", fontSize:"50px"}}></i><br/>
          Active Users<br/>on Website</div>
        <div className='content'>{activeUsersCount}</div>
      </div>
    </div>
  );
}

export default Dashboard;

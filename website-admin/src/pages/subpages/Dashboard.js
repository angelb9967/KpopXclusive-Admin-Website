import React, { useEffect, useState } from 'react';
import '../../styles/Dashboard.css';

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
        <h5>Number of Visitors on Website</h5>
        <h2>{totalLogins}</h2> 
      </div>
      <div className='container-box'>
        <h5>Number of Accounts Created on Website</h5>
        <h2>{numberOfAccounts}</h2> 
      </div>
      <div className='container-box'>
        <h5>Number of Active Users on Website</h5>
        <h2>{activeUsersCount}</h2> 
      </div>
    </div>
  );
}

export default Dashboard;

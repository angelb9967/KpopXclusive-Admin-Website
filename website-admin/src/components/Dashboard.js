import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [numberOfAccounts, setNumberOfAccounts] = useState(0); // State for number of accounts
  const [activeUsersCount, setActiveUsersCount] = useState(0); // State for active users

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/users'); // Fetch user data
        if (response.ok) {
          const data = await response.json();
          setNumberOfAccounts(data.length); // Set total number of accounts

          // Calculate active users based on the status string
          const activeUsers = data.filter(user => user.status === 'Active').length; // Corrected the condition to check for 'Active'

          setActiveUsersCount(activeUsers); // Set active users count
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
        <h2>XX</h2>
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

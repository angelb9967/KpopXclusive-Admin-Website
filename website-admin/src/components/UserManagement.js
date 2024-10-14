import React from 'react';
import { Input } from 'antd';
import '../styles/UserManagement.css';

const { Search } = Input;

const UserManagement = () => {
  return (
    <div className='usermanage-container'>
      <Search
        size="large"
        placeholder="Find User..."
        className="dashboardSearch"
      />
    </div>
  );
}

export default UserManagement;

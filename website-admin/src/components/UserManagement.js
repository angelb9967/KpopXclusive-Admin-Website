import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Modal, message, Checkbox, Select } from 'antd';
import '../styles/UserManagement.css';

const { Search } = Input;
const { Option } = Select; 

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    status: 'Inactive', 
    createdAt: '', 
    updatedAt: '',
    user_id: ''
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:8000/users');
      const data = await response.json();
      console.log(data); // Check data in browser console
      setUsers(data);
      setFilteredUsers(data); // Set initial filtered users to all users
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered); // Update filtered users based on search input
  };

  const showModal = (title, callback, user = {}) => {
    setModalTitle(title);
    setFormData({
      username: user.username || '',
      password: user.password || '',
      status: user.status || 'Inactive', 
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
      updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString().split('T')[0] : '',
      user_id: user._id || ''
    });
    setIsModalVisible(true);
    setStatusError(false)
  };

  const [statusError, setStatusError] = useState(false); // State to track status error

  const handleOk = () => {
    // Show confirmation modal
    Modal.confirm({
      title: 'Confirm Save',
      content: 'Are you sure you want to save these changes?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        let hasError = false; // Track if there's any error
        
        // Check if username is not blank
        if (!formData.username.trim()) {
          message.error('Username cannot be blank!');
          setStatusError(true); // Set status error state
          hasError = true; // Set error flag
        }
  
        // Check if password is not blank
        if (!formData.password.trim()) {
          message.error('Password cannot be blank!');
          setStatusError(true); // Set status error state
          hasError = true; // Set error flag
        }
  
        // Determine the status based on checkbox
        const status = formData.status; // This should already be a boolean
  
        // If the checkbox is not checked, mark as inactive
        if (status === false) {
          console.log('Status: Inactive');
        } else {
          console.log('Status: Active');
        }
  
        if (hasError) return; // Prevent submission if validation fails
  
        const { username, password, user_id } = formData;
  
        // Get the current date and time in UTC and convert to PHT
        const nowUtc = new Date();
        const nowPht = new Date(nowUtc.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours for PHT
  
        const url = user_id ? `http://localhost:8000/users/${user_id}` : 'http://localhost:8000/users';
        const method = user_id ? 'PUT' : 'POST';
  
        // Prepare data for saving
        const dataToSend = {
          username,
          password,
          status, // Use the boolean value for status directly
          // Use the existing createdAt value from formData when updating
          createdAt: user_id ? formData.createdAt : nowPht.toISOString(),
          updatedAt: nowPht.toISOString(), // Always set updatedAt to current PHT time
        };
  
        try {
          const response = await fetch(url, {
            method: method,
            body: JSON.stringify(dataToSend),
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log("Success:", data);
            setIsModalVisible(false);
            getData(); // Refresh the user list after a successful add or update
          } else {
            console.error("Failed to save user:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
          message.error('An unexpected error occurred.');
        }
      },
      onCancel() {
        console.log('Save action cancelled');
      },
    });
  };  

  const deleteData = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:8000/users/${id}`, { method: 'DELETE' });
          console.log(`Attempting to delete user with ID: ${id}`);
          
          if (response.ok) {
            console.log('User deleted successfully');
            getData();  // Refresh the user list after deletion
          } else {
            console.error("Failed to delete user:", response.statusText);
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      },
      onCancel() {
        console.log('Delete action cancelled');
      },
    });
  };  

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Password', dataIndex: 'password', key: 'password' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button
            type="link"
            onClick={() => showModal('Edit User', 'editData', record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => deleteData(record._id)}
          >
            Delete
          </Button>
        </>
      )
    }
  ];

  return (
    <div className="usermanage-container">
      {/* Search Field and Add Button Container */}
      <div className="action-container">
        {/* Search Field */}
        <div className="dashboardSearch-container">
          <Search
            size="large"
            placeholder="Find User..."
            className="dashboardSearch"
            onSearch={handleSearch} // Trigger search on button click
            onChange={(e) => setSearchInput(e.target.value)} // Update search input on change
            value={searchInput} // Bind the input value
          />
        </div>

        {/* Add Button */}
        <div className="addButton-container">
          <Button
            type="primary"
            onClick={() => showModal('Add User', 'insertData')}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* User Table */}
      <Table
        dataSource={filteredUsers} // Use filtered users for the table
        columns={columns}
        rowKey="_id"
        className="mt-3"
      />

      {/* Modal for Adding/Editing Users */}
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="mb-3">
          <label>Username</label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={{ borderColor: statusError ? 'red' : undefined }}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ borderColor: statusError ? 'red' : undefined }}
          />
        </div>
        <div className="mb-3">
          <label>Status</label>
          <Select
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            style={{ width: '100%' }} 
          >
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </div>
        <div className="mb-3">
          <label>Created At</label>
          <Input
            type="date"
            value={formData.createdAt}
            disabled 
          />
        </div>
        <div className="mb-3">
          <label>Updated At</label>
          <Input
            type="date"
            value={formData.updatedAt}
            disabled 
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;

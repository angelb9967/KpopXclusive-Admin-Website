import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Modal, message, Select, Space } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import moment from 'moment'; 
import '../styles/UserManagement.css';

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [visiblePassword, setVisiblePassword] = useState({}); 

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    status: 'Inactive',
    createdAt: '',
    updatedAt: '',
    user_id: '',
    showPassword: false,
  });

  const togglePasswordVisibility = (userId) => {
    setVisiblePassword((prev) => ({
        ...prev,
        [userId]: !prev[userId], 
    }));
};

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:8000/users');
      const data = await response.json();
      console.log(data);
      // Format dates before setting users
      const formattedData = data.map(user => ({
        ...user,
        createdAt: moment(user.createdAt).format('YYYY/MM/DD, hh:mm:ss A'), 
        updatedAt: moment(user.updatedAt).format('YYYY/MM/DD, hh:mm:ss A') 
      }));
      setUsers(formattedData);
      setFilteredUsers(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const showModal = (title, callback, user = {}) => {
    setModalTitle(title);
    setFormData({
      username: user.username || '',
      password: user.password || '',
      status: user.status || 'Inactive',
      createdAt: user.createdAt || '', 
      updatedAt: user.updatedAt || '', 
      user_id: user._id || ''
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    Modal.confirm({
      title: 'Confirm Save',
      content: 'Are you sure you want to save these changes?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        let hasError = false;

        // Validation
        if (!formData.username.trim()) {
          message.error('Username cannot be blank!');
          hasError = true;
        }
        if (!formData.password.trim()) {
          message.error('Password cannot be blank!');
          hasError = true;
        }
        if (hasError) return;

        const { username, password, user_id } = formData;
        const nowPht = moment().utcOffset(8).format('YYYY-MM-DD hh:mm:ss A'); // Get current time in PHT

        const url = user_id ? `http://localhost:8000/users/${user_id}` : 'http://localhost:8000/users';
        const method = user_id ? 'PUT' : 'POST';

        // Prepare data for saving
        const dataToSend = {
          username,
          password,
          status: formData.status,
          createdAt: user_id ? formData.createdAt : nowPht, // Keep existing createdAt when updating
          updatedAt: nowPht, // Always set updatedAt to current PHT time
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
            getData(); // Refresh user list
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
            getData(); // Refresh user list
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
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      render: (text, record) => (
        <span>
          {visiblePassword[record._id] ? text : '********'} {/* Show/hide password */}
          <Button
            type="link"
            icon={visiblePassword[record._id] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => togglePasswordVisibility(record._id)}
            style={{ marginLeft: 8 }}
          />
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div className={status === 'Active' ? 'status-active' : 'status-inactive'}>
          {status}
        </div>
      ),
    },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal('Edit User', 'editData', record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteData(record.key)} // Use record._id if that's your unique identifier
          >
            Delete
          </Button>
        </Space>
      )
    }
    
  ];

  return (
    <div className="usermanage-container">
      <div className="action-container">
        <div className="dashboardSearch-container">
          <Search
            size="large"
            placeholder="Find User..."
            className="dashboardSearch"
            onSearch={handleSearch}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </div>

        <div className="addButton-container">
          <Button
            type="primary"
            onClick={() => showModal('Add User', 'insertData')}
          >
            ADD
          </Button>
        </div>
      </div>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        className="mt-3"
      />

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="mb-3">
          <label>Username</label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div className="mb-3">
        <label>Password</label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input
            type={formData.showPassword ? 'text' : 'password'} // Toggle between text and password
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ flex: 1 }}
            suffix={null} // Remove any suffix icons from the input
        />
        <Button
            type="link"
            icon={formData.showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
            style={{ marginLeft: 8 }}
        />
    </div>
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
            type="text"
            value={formData.createdAt}
            disabled
          />
        </div>
        <div className="mb-3">
          <label>Updated At</label>
          <Input
            type="text"
            value={formData.updatedAt}
            disabled
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;

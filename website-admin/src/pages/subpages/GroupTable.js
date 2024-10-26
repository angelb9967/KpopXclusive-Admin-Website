import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/InformationHandler.css';

const { Search } = Input;

const GroupTable = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [groupSearchInput, setGroupSearchInput] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [groupPagination, setGroupPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:8000/groups');
      const groupData = await response.json();
      setGroups(groupData);
      setFilteredGroups(groupData);
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error("Error fetching data:", error);
    }
  };

  const handleGroupSearch = () => {
    const filtered = groups.filter(group =>
      group.groupName.toLowerCase().includes(groupSearchInput.toLowerCase())
    );
    setFilteredGroups(filtered);
    setGroupPagination({ current: 1, pageSize: 10 });
  };

  const deleteData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/groups/${id}`, { method: 'DELETE' });
      if (response.ok) {
        getData();
      } else {
        message.error('An unexpected error occurred.');
      }
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error(`Error deleting group:`, error);
    }
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this record?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deleteData(key),
    });
  };

  const handleEdit = (record) => {
    navigate('/EditGroup', { state: { record } });
    console.log('Edit Group', record);
};

  const formatDate = (dateString) => {
    const options = {
      timeZone: 'Asia/Manila', 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    
    const date = new Date(dateString).toLocaleString('en-PH', options);

    // Replace the standard locale format with the custom format
    const [datePart, timePart] = date.split(', ');
    const [year, month, day] = datePart.split('/');
    const [time, modifier] = timePart.split(' ');
    
    return `${year}/${month}/${day}, ${time} ${modifier}`;
  };

  const groupColumns = [
    {
      title: 'Image',
      dataIndex: 'groupImage',
      key: 'groupImage',
      render: (imageUrl) => (
        <img 
          src={imageUrl} 
          alt="Group" 
          style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            objectFit: 'cover',   
            objectPosition: 'center'
          }} 
        />
      ),  
    },
    {
        title: 'Group Name',
        dataIndex: 'groupName',
        key: 'groupName',
        render: (text) => (
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{text}</span> // Adjust font size as needed
        ),
        sorter: (a, b) => a.groupName.localeCompare(b.groupName),
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        render: (text) => (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ),
      },
      {
        title: 'Last Edited',
        dataIndex: 'lastEdited',
        key: 'lastEdited',
        render: (text) => formatDate(text), 
        sorter: (a, b) => new Date(a.lastEdited) - new Date(b.lastEdited),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record._id)} 
            >
              Delete
            </Button>
          </Space>
        ),
      },
  ];

  return (
    <div className='infohandler-container'>
      <div className="infohandleraction-container">
        <div className="infohandlerSearch-container">
          <Search
            size="large"
            placeholder="Find Group..."
            className="groupSearch searchInput"
            onSearch={handleGroupSearch}
            onChange={(e) => setGroupSearchInput(e.target.value)}
            value={groupSearchInput}
          />
        </div>
        <div className="addButton-container">
          <Button type="primary" onClick={() => navigate('/AddGroup')}>ADD</Button>
        </div>
      </div>
      <div className="table-container">
        <Table
          columns={groupColumns}
          dataSource={filteredGroups.slice((groupPagination.current - 1) * groupPagination.pageSize, groupPagination.current * groupPagination.pageSize)}
          rowKey="_id"
          pagination={{
            current: groupPagination.current,
            pageSize: groupPagination.pageSize,
            total: filteredGroups.length,
            onChange: (page, pageSize) => setGroupPagination({ current: page, pageSize }),
            showSizeChanger: true,
          }}
        />
      </div>
    </div>
  );
};

export default GroupTable;

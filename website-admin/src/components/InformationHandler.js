import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/InformationHandler.css';

const { Search } = Input;

const InformationHandler = () => {
  const navigate = useNavigate();
  const [idols, setIdols] = useState([]);
  const [groups, setGroups] = useState([]);

  const [idolSearchInput, setIdolSearchInput] = useState('');
  const [groupSearchInput, setGroupSearchInput] = useState('');

  const [filteredIdols, setFilteredIdols] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);

  // State for pagination
  const [idolPagination, setIdolPagination] = useState({ current: 1, pageSize: 10 });
  const [groupPagination, setGroupPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const [idolResponse, groupResponse] = await Promise.all([
        fetch('http://localhost:8000/idols'),
        fetch('http://localhost:8000/groups'),
      ]);

      const idolData = await idolResponse.json();
      const groupData = await groupResponse.json();

      setIdols(idolData);
      setFilteredIdols(idolData);
      setGroups(groupData);
      setFilteredGroups(groupData);
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error("Error fetching data:", error);
    }
  };

  // Handle Idol Search
  const handleIdolSearch = () => {
    const filtered = idols.filter(idol =>
      idol.idolName.toLowerCase().includes(idolSearchInput.toLowerCase())
    );
    setFilteredIdols(filtered);
    // Reset idol pagination when search changes
    setIdolPagination({ current: 1, pageSize: 10 });
  };

  // Handle Group Search
  const handleGroupSearch = () => {
    const filtered = groups.filter(group =>
      group.groupName.toLowerCase().includes(groupSearchInput.toLowerCase())
    );
    setFilteredGroups(filtered);
    // Reset group pagination when search changes
    setGroupPagination({ current: 1, pageSize: 10 });
  };

  const deleteData = async (id, type) => {
    console.log(`Attempting to delete ${type} with ID: ${id}`); // Log the ID
    try {
      const endpoint = type === 'idol' ? `http://localhost:8000/idols/${id}` : `http://localhost:8000/groups/${id}`;
      const response = await fetch(endpoint, { method: 'DELETE' });

      if (response.ok) {
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        getData();  // Refresh the idol list after deletion
      } else {
        message.error('An unexpected error occurred.');
        console.error(`Failed to delete ${type}:`, response.statusText);
      }
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleDelete = (key, type) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this record?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deleteData(key, type), // Pass type to deleteData
      onCancel() {
        console.log('Delete action cancelled');
      },
    });
  };

  // Function to format date in PHT
  const formatDate = (dateString) => {
    const options = {
      timeZone: 'Asia/Manila', // Philippine Time Zone
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

  const idolColumns = [
    {
      title: 'Image',
      dataIndex: 'idolImage',
      key: 'idolImage',
      render: (imageUrl) => (
        <img 
          src={imageUrl} 
          alt="Idol" 
          style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            objectFit: 'cover',      // Ensures the image covers the entire area
            objectPosition: 'center' // Centers the image content
          }} 
        />
      ),  
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
      title: 'Idol Name',
      dataIndex: 'idolName',
      key: 'idolName',
    },
    {
      title: 'Last Edited',
      dataIndex: 'lastEdited',
      key: 'lastEdited',
      render: (text) => formatDate(text), // Format the date
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record, 'idol')}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id, 'idol')} // Pass 'idol' type
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const groupColumns = [
    {
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: 'Last Edited',
      dataIndex: 'lastEdited',
      key: 'lastEdited',
      render: (text) => formatDate(text), // Format the date
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record, 'group')}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id, 'group')} 
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Handlers for Edit and Delete
  const handleEdit = (record, source) => {
    if (source === 'idol') {
      navigate('/EditIdol', { state: { record } });
      console.log('Edit Idol', record);
    } else if (source === 'group') {
      navigate('/EditGroup', { state: { record } });
      console.log('Edit Group', record);
    }
  };

  // Navigate to Add Idol page
  const handleAddIdol = () => {
    navigate('/AddIdol');
  };

  // Navigate to Add Group page
  const handleAddGroup = () => {
    navigate('/AddGroup');
  };

  return (
    <div className='container'>
      {/* Idols Section */}
      <div className='infohandler-container'>
        <label>KPOP IDOLS</label>
        <div className="infohandleraction-container">
          <div className="infohandlerSearch-container">
            <Search
              size="large"
              placeholder="Find Idol..."
              className="idolSearch searchInput"
              onSearch={handleIdolSearch}
              onChange={(e) => setIdolSearchInput(e.target.value)}
              value={idolSearchInput}
            />
          </div>
          <div className="addButton-container">
            <Button type="primary" onClick={handleAddIdol}>Add New Kpop Idol</Button>
          </div>
        </div>
        <div className="table-container">
          <Table
            columns={idolColumns}
            dataSource={filteredIdols.slice((idolPagination.current - 1) * idolPagination.pageSize, idolPagination.current * idolPagination.pageSize)}
            rowKey="_id"
            pagination={{
              current: idolPagination.current,
              pageSize: idolPagination.pageSize,
              total: filteredIdols.length,
              onChange: (page, pageSize) => {
                setIdolPagination({ current: page, pageSize });
                console.log('Idols - Page:', page, 'Page Size:', pageSize);
              },
              showSizeChanger: true,
            }}
          />
        </div>
      </div>

      {/* Groups Section */}
      <div className='infohandler-container'>
        <label>KPOP GROUPS</label>
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
            <Button type="primary" onClick={handleAddGroup}>Add New Kpop Group</Button>
          </div>
        </div>
        <div className="table-container">
          <Table
            columns={groupColumns}
            dataSource={filteredGroups.slice(
              (groupPagination.current - 1) * groupPagination.pageSize,
              groupPagination.current * groupPagination.pageSize
            )}
            rowKey="_id"
            pagination={{
              current: groupPagination.current,
              pageSize: groupPagination.pageSize,
              total: filteredGroups.length,
              onChange: (page, pageSize) => {
                setGroupPagination({ current: page, pageSize });
                console.log('Groups - Page:', page, 'Page Size:', pageSize);
              },
              showSizeChanger: true,
              position: ['bottomLeft', 'bottomRight'], 
            }}
          />

        </div>
      </div>
    </div>
  );
};

export default InformationHandler;

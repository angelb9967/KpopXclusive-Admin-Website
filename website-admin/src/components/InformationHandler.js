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
  };

  // Handle Group Search
  const handleGroupSearch = () => {
    const filtered = groups.filter(group =>
      group.groupName.toLowerCase().includes(groupSearchInput.toLowerCase())
    );
    setFilteredGroups(filtered);
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

  // Update handleDelete to include type parameter
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

  // Update the action render for the idol and group columns
  const idolColumns = [
    {
      title: 'Idol Name',
      dataIndex: 'idolName',
      key: 'idolName',
    },
    {
      title: 'Last Edited',
      dataIndex: 'lastEdited',
      key: 'lastEdited',
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

  return (
    <div className='container'>
      {/* Idols Section */}
      <div className='infohandler-container'>
        <h2>KPOP IDOLS</h2>
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
            <Button type="primary">Add New Kpop Idol</Button>
          </div>
        </div>
        <div className="table-container">
          <Table
            columns={idolColumns}
            dataSource={filteredIdols}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                console.log('Idols - Page:', page, 'Page Size:', pageSize);
              },
            }}
          />
        </div>
      </div>

      {/* Groups Section */}
      <div className='infohandler-container'>
        <h2>KPOP GROUPS</h2>
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
            <Button type="primary">Add New Kpop Group</Button>
          </div>
        </div>
        <div className="table-container">
          <Table
            columns={groupColumns}
            dataSource={filteredGroups}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                console.log('Groups - Page:', page, 'Page Size:', pageSize);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InformationHandler;

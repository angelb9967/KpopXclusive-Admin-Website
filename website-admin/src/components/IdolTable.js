import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/InformationHandler.css';

const { Search } = Input;

const IdolTable = () => {
  const navigate = useNavigate();
  const [idols, setIdols] = useState([]);
  const [idolSearchInput, setIdolSearchInput] = useState('');
  const [filteredIdols, setFilteredIdols] = useState([]);
  const [idolPagination, setIdolPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:8000/idols');
      const idolData = await response.json();
      setIdols(idolData);
      setFilteredIdols(idolData);
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error("Error fetching data:", error);
    }
  };

  const handleIdolSearch = () => {
    const filtered = idols.filter(idol =>
      idol.idolName.toLowerCase().includes(idolSearchInput.toLowerCase())
    );
    setFilteredIdols(filtered);
    setIdolPagination({ current: 1, pageSize: 10 });
  };

  const deleteData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/idols/${id}`, { method: 'DELETE' });
      if (response.ok) {
        getData();
      } else {
        message.error('An unexpected error occurred.');
      }
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error(`Error deleting idol:`, error);
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

  const handleEdit = (record, source) => {
      navigate('/EditIdol', { state: { record } });
      console.log('Edit Idol', record);
  };

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
        title: 'Idol Name',
        dataIndex: 'idolName',
        key: 'idolName',
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
        title: 'Group',
        dataIndex: 'group',
        key: 'group',
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
            placeholder="Find Idol..."
            className="idolSearch searchInput"
            onSearch={handleIdolSearch}
            onChange={(e) => setIdolSearchInput(e.target.value)}
            value={idolSearchInput}
          />
        </div>
        <div className="addButton-container">
          <Button type="primary" onClick={() => navigate('/AddIdol')}>ADD</Button>
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
            onChange: (page, pageSize) => setIdolPagination({ current: page, pageSize }),
            showSizeChanger: true,
          }}
        />
      </div>
    </div>
  );
};

export default IdolTable;

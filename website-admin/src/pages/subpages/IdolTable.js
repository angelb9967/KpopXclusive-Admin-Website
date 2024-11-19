import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, message, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/InformationHandler.css';

import axios from 'axios';

const { Search } = Input;

const IdolTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [groupFilters, setGroupFilters] = useState([]);
  const [idols, setIdols] = useState([]);
  const [idolSearchInput, setIdolSearchInput] = useState('');
  const [filteredIdols, setFilteredIdols] = useState([]);
  const [idolPagination, setIdolPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:8000/groups');
        const groups = response.data;
        const filters = groups.map(group => ({
          text: group.groupName,
          value: group.groupName,
        }));
        setGroupFilters(filters);
      } catch (error) {
        console.error('Failed to fetch group names:', error);
      } 
    };

    const fetchIdols = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/idols');
        setIdols(response.data);
        setFilteredIdols(response.data);
      } catch (error) {
        console.error('Failed to fetch idols:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchGroups();
    fetchIdols();
  }, []);

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
        setFilteredIdols(prevData => prevData.filter(item => item._id !== id));
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

  const handleEdit = (record) => {
    navigate('/EditIdol', { state: { record } });
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
    const [datePart, timePart] = date.split(', ');
    const [year, month, day] = datePart.split('/');
    const [time, modifier] = timePart.split(' ');
    return `${year}/${month}/${day}, ${time} ${modifier}`;
  };

  // Check if some idol happens to have the same stage name as another idol
  const nameCount = idols.reduce((acc, idol) => {
    const idolNameLower = idol.idolName.toLowerCase();
    
    // Log the current idol name being compared and the current count
    console.log(`Comparing: "${idol.idolName}" (lowercase: "${idolNameLower}")`);
    
    acc[idolNameLower] = (acc[idolNameLower] || 0) + 1;
  
    // Log the result for this comparison
    console.log(`Current count for "${idolNameLower}": ${acc[idolNameLower]}`);
  
    return acc;
  }, {});
  

  const idolColumns = [
    {
      title: 'Image',
      dataIndex: 'idolImage',
      key: 'idolImage',
      render: (imageUrl) => (
        <img
          src={imageUrl || 'https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'}
          alt="Idol"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          onError={(e) => {
            e.target.src = 'https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
          }}
        />
      ),
    },    
    {
      title: 'Idol Name',
      dataIndex: 'idolName',
      key: 'idolName',
      render: (text, record) => {
        const idolNameLower = text.toLowerCase();
        const displayName = nameCount[idolNameLower] > 1 ? `${text} (${record.fullname})` : text; // Check count using lowercase
        return (
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{displayName}</span>
        );
      },
      sorter: (a, b) => a.idolName.localeCompare(b.idolName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (text, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      filters: groupFilters,
      filterSearch: true,
      onFilter: (value, record) => record.group === value,
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
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            columns={idolColumns}
            dataSource={filteredIdols}
            rowKey="_id"
            pagination={{
              current: idolPagination.current,
              pageSize: idolPagination.pageSize,
              total: filteredIdols.length,
              onChange: (page, pageSize) => setIdolPagination({ current: page, pageSize }),
              showSizeChanger: true,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default IdolTable;
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/InformationHandler.css';

import axios from 'axios';

const { Search } = Input;

const QuizTable = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [quizSearchInput, setQuizSearchInput] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [quizPagination, setQuizPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/quizzes');
        setQuizzes(response.data);
        setFilteredQuizzes(response.data);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizSearch = () => {
    const filtered = quizzes.filter(quiz =>
      quiz.quizName.toLowerCase().includes(quizSearchInput.toLowerCase())
    );
    setFilteredQuizzes(filtered);
    setQuizPagination({ current: 1, pageSize: 10 });
  };

  const deleteData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/quizzes/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setFilteredQuizzes(prevData => prevData.filter(item => item._id !== id));
      } else {
        message.error('An unexpected error occurred.');
      }
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error(`Error deleting quiz:`, error);
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
    navigate('/EditQuiz', { state: { record } });
  };

  const quizColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{text}</span>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Objective',
      dataIndex: 'objective',
      key: 'objective',
      sorter: (a, b) => a.objective.localeCompare(b.objective),
      sortDirections: ['ascend', 'descend'],
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
            placeholder="Find Quiz..."
            className="quizSearch searchInput"
            onSearch={handleQuizSearch}
            onChange={(e) => setQuizSearchInput(e.target.value)}
            value={quizSearchInput}
          />
        </div>
        <div className="addButton-container">
          <Button type="primary" onClick={() => navigate('/AddQuiz')}>ADD</Button>
        </div>
      </div>
      <div className="table-container">
        <Table
        bordered
          columns={quizColumns}
          dataSource={filteredQuizzes}
          rowKey="_id"
          pagination={{
            current: quizPagination.current,
            pageSize: quizPagination.pageSize,
            total: filteredQuizzes.length,
            onChange: (page, pageSize) => setQuizPagination({ current: page, pageSize }),
            showSizeChanger: true,
          }}
        />
      </div>
    </div>
  );
};

export default QuizTable;

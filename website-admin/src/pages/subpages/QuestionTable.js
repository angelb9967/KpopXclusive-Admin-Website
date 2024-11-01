import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, message, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/InformationHandler.css';
import axios from 'axios';

const { Search } = Input;

const QuestionTable = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [questionSearchInput, setQuestionSearchInput] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [questionPagination, setQuestionPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    setLoading(true); 
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/questions');
        setQuestions(response.data);
        setFilteredQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionSearch = () => {
    const filtered = questions.filter(question =>
      question.question.toLowerCase().includes(questionSearchInput.toLowerCase())
    );
    setFilteredQuestions(filtered);
    setQuestionPagination({ current: 1, pageSize: 10 });
  };

  const deleteData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/questions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setFilteredQuestions(prevData => prevData.filter(item => item._id !== id));
      } else {
        message.error('An unexpected error occurred.');
      }
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error(`Error deleting question:`, error);
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
    navigate('/EditQuestion', { state: { record } });
  };

  const questionColumns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      render: (text) => (
        <span style={{ fontSize: '20px', fontWeight: 'bold', whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {text}
        </span>
      ),
      sorter: (a, b) => a.question.localeCompare(b.question),
      sortDirections: ['ascend', 'descend'],
      width: 500, 
    },
    {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (imageUrl) => (
            <img
                src={imageUrl}
                alt="News"
                style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
              />
          ),
      },
      {
          title: 'Answer',
          dataIndex: 'correctAnswer',
          key: 'correctAnswer',
          render: (text) => (
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{text}</span>
          ),
          sorter: (a, b) => a.correctAnswer.localeCompare(b.correctAnswer),
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
            placeholder="Find Question..."
            className="questionSearch searchInput"
            onSearch={handleQuestionSearch}
            onChange={(e) => setQuestionSearchInput(e.target.value)}
            value={questionSearchInput}
          />
        </div>
        <div className="addButton-container">
          <Button type="primary" onClick={() => navigate('/AddQuestion')}>ADD</Button>
        </div>
      </div>
      <div className="table-container">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            bordered
            columns={questionColumns}
            dataSource={filteredQuestions}
            rowKey="_id"
            pagination={{
              current: questionPagination.current,
              pageSize: questionPagination.pageSize,
              total: filteredQuestions.length,
              onChange: (page, pageSize) => setQuestionPagination({ current: page, pageSize }),
              showSizeChanger: true,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionTable;

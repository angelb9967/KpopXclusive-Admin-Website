import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/InformationHandler.css';

const { Search } = Input;

const CreateNews = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [newsSearchInput, setNewsSearchInput] = useState('');
    const [filteredNews, setFilteredNews] = useState([]);
    const [newsPagination, setNewsPagination] = useState({ current: 1, pageSize: 10 });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await fetch('http://localhost:8000/news');
            const newsData = await response.json();
            setNews(newsData);
            setFilteredNews(newsData);
        } catch (error) {
            message.error('An unexpected error occurred.');
            console.error("Error fetching data:", error);
        }
    };

    const handleNewsSearch = () => {
        const filtered = news.filter(item =>
            item.title.toLowerCase().includes(newsSearchInput.toLowerCase())
        );
        setFilteredNews(filtered);
        setNewsPagination({ current: 1, pageSize: 10 });
    };

    const deleteData = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/news/${id}`, { method: 'DELETE' });
            if (response.ok) {
                getData();
            } else {
                message.error('An unexpected error occurred.');
            }
        } catch (error) {
            message.error('An unexpected error occurred.');
            console.error(`Error deleting news:`, error);
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
        navigate('/EditNews', { state: { record } });
        console.log('Edit News', record);
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

    const newsColumns = [
        {
            title: 'News Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{text}</span> // Adjust font size as needed
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => formatDate(text),
        },
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
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
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <div style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    WebkitLineClamp: 3,
                    maxHeight: '4.5em',
                    lineHeight: '1.5em',
                    textOverflow: 'ellipsis',
                }}>
                    {text}
                </div>
            ),
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
                        placeholder="Find News..."
                        className="newsSearch searchInput"
                        onSearch={handleNewsSearch}
                        onChange={(e) => setNewsSearchInput(e.target.value)}
                        value={newsSearchInput}
                    />
                </div>
                <div className="addButton-container">
                    <Button type="primary" onClick={() => navigate('/AddNews')}>ADD</Button>
                </div>
            </div>
            <div className="table-container">
                <Table
                    columns={newsColumns}
                    dataSource={filteredNews.slice((newsPagination.current - 1) * newsPagination.pageSize, newsPagination.current * newsPagination.pageSize)}
                    rowKey="_id"
                    pagination={{
                        current: newsPagination.current,
                        pageSize: newsPagination.pageSize,
                        total: filteredNews.length,
                        onChange: (page, pageSize) => setNewsPagination({ current: page, pageSize }),
                        showSizeChanger: true,
                    }}
                />
            </div>
        </div>
    );
};

export default CreateNews;

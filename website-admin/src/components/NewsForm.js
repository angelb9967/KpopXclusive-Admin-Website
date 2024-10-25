import React from 'react'
import 'boxicons/css/boxicons.min.css';
import '../styles/NewsForm.css';
import { Button, Select, Input, Space, message, DatePicker, Radio, Form, Modal } from 'antd';
import { DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const NewsForm = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const { state } = location;
    const newsData = state?.record;
    const buttonText = location.pathname === '/EditNews' ? 'Update News' : 'Save News';
    const headingText = location.pathname === '/EditNews' ? 'EDIT NEWS' : 'ADD NEWS';

    const initialValues = {
        ...newsData,
        date: newsData?.date ? dayjs(newsData.date) : null
    };
    
    console.log('News Data:', newsData);

    const handleSubmit = async (values) => {
        const isValidUrl = (urlString) => {
            try {
                new URL(urlString);
                return true;
            } catch (error) {
                return false;
            }
        };

        if (!isValidUrl(values.thumbnail)) {
            message.error('News Thumnail is not valid');
            return;
        }

        const dataToSubmit = {
            title: values.title,
            description: values.description,
            thumbnail: values.thumbnail,
            author: values.author,
            date: values.date,
            content: values.content
        }

        try {
            if (location.pathname === '/EditNews' && newsData._id) {
                const response = await axios.put(`http://localhost:8000/news/${newsData._id}`, dataToSubmit);
                message.success(response.data.message);
            } else {
                const response = await axios.post('http://localhost:8000/news', dataToSubmit);
                message.success(response.data.message);
                form.resetFields();
            }
        } catch (error) {
            message.error('Failed to save or update idol');
            console.error('Error saving or updating idol:', error);
        }
    };

    return (
        <div className='newsForm-container'>
            <label>{headingText}</label>
            <label>Input the news of a kpop idol or group here</label>
            <Form form={form} onFinish={handleSubmit} scrollToFirstError initialValues={initialValues}>
                <div className='newsForm-subContainer'>
                    <div className='newsForm-box'>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input Title!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                                <Input placeholder="Enter the headline for your news article" required rules={[{ required: true, message: 'Please input Title!' }]} style={{ flexGrow: 1 }} />
                            </Form.Item>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <Form.Item label="Thumbnail" name="thumbnail" rules={[{ required: true, message: 'Please input Thumbnail!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                                <Input placeholder="Paste the URL for the article's thumbnail image" required rules={[{ required: true, message: 'Please input Thumbnail!' }]} style={{ flexGrow: 1 }} />
                            </Form.Item>
                        </div>
                    </div>
                    <div className='newsForm-box'>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <Form.Item label="Author" name="author" rules={[{ required: true, message: 'Please input Author!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                                <Input placeholder="Enter the author's name" required rules={[{ required: true, message: 'Please input Author!' }]} style={{ flexGrow: 1 }} />
                            </Form.Item>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please input Date!' }]} style={{ width: "100%", }}>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="Select or enter the publication date"
                                    value={form.getFieldValue('date')} 
                                    onChange={(date) => form.setFieldsValue({ date })} 
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                        </div>
                    </div>
                </div>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please provide a description' }]} >
                    <TextArea
                        placeholder="Provide a brief summary or introduction"
                        required
                        autoSize={{ minRows: 2, maxRows: 5 }}
                    />
                </Form.Item>
                <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please provide an introduction' }]}>
                    <TextArea
                        placeholder="Write the full content of the article here"
                        required
                        autoSize={{ minRows: 8, maxRows: 20 }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType='submit' className='submitBtn'>
                        {buttonText}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default NewsForm

import React from 'react';
import 'boxicons/css/boxicons.min.css';
import '../../styles/NewsForm.css';
import '../../styles/Main.css';
import { Button, Input, message, DatePicker, Form, Modal, Divider } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useLocation } from 'react-router-dom';
import logo1 from '../../assets/Logo 1.png';
import moment from 'moment';
import axios from 'axios';
import dayjs from 'dayjs';

const NewsForm = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const { state } = location;
    const newsData = state?.record;
    const buttonText = location.pathname === '/EditNews' ? 'Update News' : 'Add News';
    const buttonColor = location.pathname === '/EditNews' ? 'rgb(190,167,44)' : 'green';
    const headingText = location.pathname === '/EditNews' ? 'EDIT NEWS' : 'ADD NEWS';
    const initialValues = {
        ...newsData,
        date: newsData?.date ? dayjs(newsData.date) : null
    };

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
            message.error('News Thumbnail is not valid');
            return;
        }

        const dataToSubmit = {
            title: values.title,
            description: values.description,
            thumbnail: values.thumbnail,
            author: values.author,
            date: values.date,
            content: values.content
        };

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
            <div className='main-navbar'>
                <img src={logo1} className="main-image" alt="Logo 1" />
                <div className="vertical-divider"></div>
                <h2 className='main-title'>{headingText}</h2>
            </div>
            <div className='newsForm-subContainer1'>
                <label className='heading'>KPOP News Portal</label>
                <label>Share the latest news and updates on any K-pop idol or group here.</label>
            </div>
            <Form
                form={form}
                onFinish={handleSubmit}
                scrollToFirstError
                initialValues={initialValues}
                labelAlign="left" // Ensures all labels align to the left
                style={{ textAlign: 'left' }} // Ensures form items are aligned left
            >
                                    
                <div className='newsForm-subContainer'>
                    <div className='newsForm-box'>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: 'Please input Title' }]}
                            style={{ marginBottom: '16px' }}
                        >
                            <Input
                                placeholder="Enter the headline for your news article"
                                style={{ flexGrow: 1 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Thumbnail"
                            name="thumbnail"
                            rules={[{ required: true, message: 'Please input Thumbnail' }]}
                            style={{ marginBottom: '0' }}
                        >
                            <Input
                                placeholder="Paste the URL for the article's thumbnail image"
                                style={{ flexGrow: 1 }}
                            />
                        </Form.Item>
                    </div>
                    <div className='newsForm-box'>
                        <Form.Item
                            label="Author"
                            name="author"
                            rules={[{ required: true, message: 'Please input Author!' }]}
                            style={{ marginBottom: '16px' }}
                        >
                            <Input
                                placeholder="Enter the author's name"
                                style={{ flexGrow: 1 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Date"
                            name="date"
                            rules={[{ required: true, message: 'Please input Date!' }]}
                            style={{ marginBottom: '0' }}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder="Select or enter the publication date"
                                value={form.getFieldValue('date')}
                                onChange={(date) => form.setFieldsValue({ date })}
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current > moment().endOf('day')}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className='newsForm-subContainer1'>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please provide a Description' }]}
                    >
                        <TextArea
                            placeholder="Provide a brief summary or introduction"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        style={{ marginBottom: '0' }}

                        rules={[{ required: true, message: 'Please provide an Introduction' }]}
                    >
                        <TextArea
                            placeholder="Write the full content of the article here"
                            autoSize={{ minRows: 8, maxRows: 20 }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="submitBtn"
                            style={{
                                backgroundColor: buttonColor,
                                fontSize: "22px",
                                boxShadow: "inset 0px 1px 5px 0px rgba(0, 0, 0, 0.75)"
                            }}
                        >
                            {buttonText}
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default NewsForm;

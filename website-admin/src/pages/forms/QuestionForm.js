import { Form, Card, Input, message, Divider, Modal, Radio, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo1 from '../../assets/Logo 1.png';
import '../../styles/Main.css';
import '../../styles/QuestionForm.css';
import '../../styles/IdolForm.css';
import axios from 'axios'; 

const QuestionForm = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const { state } = location;
    const questionData = state?.record;
    const buttonText = location.pathname === '/EditQuestion' ? 'Update Question' : 'Add Question';
    const buttonColor = location.pathname === '/EditQuestion' ? 'rgb(190,167,44)' : 'green';
    const headingText = location.pathname === '/EditQuestion' ? 'EDIT QUESTION' : 'ADD QUESTION';

    const [imageUrl, setImageUrl] = useState(null);
    const [urlInput, setUrlInput] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null); // State for correct answer

    useEffect(() => {
        // Set initial values if editing a question
        if (questionData) {
            form.setFieldsValue({
                question: questionData.question,
                option1: questionData.options[0],
                option2: questionData.options[1],
                option3: questionData.options[2],
                option4: questionData.options[3],
                imageUrl: questionData.imageUrl,
            });
            setImageUrl(questionData.imageUrl);
            setCorrectAnswer(questionData.correctAnswer); // Set correct answer
        }
    }, [form, questionData]);

    const handleUrlChange = (newUrl) => {
        setUrlInput(newUrl);
        console.log('handleUrlChange called with URL:', newUrl);

        if (newUrl.trim() !== '') {
            const img = new Image();
            img.src = newUrl;

            img.onload = () => {
                setImageUrl(newUrl);
                console.log('Image loaded successfully, setImageUrl to:', newUrl);
            };

            img.onerror = () => {
                message.warning('Image not found');
                setImageUrl('');
                console.log('Image load failed, setImageUrl cleared');
            };
        } else {
            setImageUrl('');
            console.log('Empty URL, setImageUrl cleared');
        }
    };

    const handleDrop = (event, setImageCallback, imageFieldName) => {
        event.preventDefault();

        const items = event.dataTransfer.items;
        let validImageCount = 0;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.kind === 'string') {
                item.getAsString((url) => {
                    const imgTagMatch = url.match(/<img[^>]+src=["']([^"']+)["']/);
                    if (imgTagMatch) {
                        const imgUrl = imgTagMatch[1];
                        const img = new Image();
                        img.src = imgUrl;

                        img.onload = () => {
                            setImageCallback(imgUrl);
                            setUrlInput(imgUrl);
                            form.setFieldsValue({ [imageFieldName]: imgUrl });
                            validImageCount++;
                            checkForWarnings();
                        };

                        img.onerror = () => {
                            setImageCallback('');
                            setUrlInput('');
                            form.setFieldsValue({ [imageFieldName]: '' });
                        };
                    }
                });
            } else if (item.kind === 'file') {
                const file = item.getAsFile();
                const fileType = file.type;

                if (fileType.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const dataUrl = reader.result;
                        setImageCallback(dataUrl);
                        setUrlInput(dataUrl);
                        form.setFieldsValue({ [imageFieldName]: dataUrl });
                        validImageCount++;
                        checkForWarnings();
                    };
                    reader.readAsDataURL(file);
                } else {
                    message.warning('Please drop an image file.');
                }
            }
        }

        const checkForWarnings = () => {
            if (validImageCount === 0) {
                message.warning('No valid image URL found in the dropped content.');
            }
        };
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const showModal = () => {
        setUrlInput('');
        setIsModalVisible(true);
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
    
        // Check if no radio button is selected
        if (!correctAnswer) {
            message.error('Please select a correct answer before submitting!');
            return;
        }
    
        // Validate the image URL
        if (!isValidUrl(values.imageUrl)) {
            message.error('Image URL is not valid');
            return;
        }
    
        const options = [values.option1, values.option2, values.option3, values.option4];
    
        // Create a copy of the previous options
        const previousOptions = [questionData?.options[0], questionData?.options[1], questionData?.options[2], questionData?.options[3]];
    
        // Check if the correct answer is included in the options
        let updatedCorrectAnswer = correctAnswer;
    
        // Validate the current correct answer
        if (!options.includes(correctAnswer)) {
            const previousCorrectIndex = previousOptions.findIndex(option => option === correctAnswer);
    
            if (previousCorrectIndex !== -1) {
                updatedCorrectAnswer = options[previousCorrectIndex];
            } else {
                updatedCorrectAnswer = options[0]; // Fallback to the first option
            }
        }
    
        const dataToSubmit = {
            question: values.question,
            options: options,
            correctAnswer: updatedCorrectAnswer,
            imageUrl: values.imageUrl,
        };
    
        try {
            if (location.pathname === '/EditQuestion' && questionData?._id) {
                const response = await axios.put(`http://localhost:8000/questions/${questionData._id}`, dataToSubmit);
                message.success(response.data.message);
            } else {
                const response = await axios.post('http://localhost:8000/questions', dataToSubmit);
                message.success(response.data.message);
                form.resetFields();
                setImageUrl(null);
                setUrlInput('');
                setCorrectAnswer(null); // Reset the correct answer for new entries
            }
        } catch (error) {
            message.error('Failed to save or update the question');
            console.error('Error saving or updating question:', error);
        }
    };
    
    const handleModalOk = () => {
        console.log('Modal OK clicked with URL input:', urlInput);
    
        if (urlInput.trim() !== '') {
            const img = new Image();
            img.src = urlInput;
    
            img.onload = () => {
                form.setFieldsValue({ imageUrl: urlInput });
                setImageUrl(urlInput);
                console.log('Modal URL set successfully, form imageUrl set to:', urlInput);
                setIsModalVisible(false);
            };
    
            img.onerror = () => {
                message.error('Image not found or invalid. Please enter a valid URL.');
                console.log('Modal URL load failed');
            };
        } else {
            message.error('Please enter a valid URL.');
            console.log('Modal URL input was empty');
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    // New function to handle option changes
    const handleOptionChange = (index, value) => {
        form.setFieldsValue({ [`option${index + 1}`]: value });
    
        // Update the correct answer if this option was the correct answer
        if (correctAnswer === value[`option${index + 1}`]) {
            setCorrectAnswer(value); // Update correct answer if it has changed
        }
    };

    return (
        <div className='questionContainer'>
            <div className='main-navbar'>
                <img src={logo1} className="main-image" alt="Logo 1" />
                <div className="vertical-divider"></div>
                <h2 className='main-title'>{headingText}</h2>
            </div>
            <Form form={form} name="questionForm" initialValues={{ imageUrl: urlInput }} onFinish={handleSubmit} >

                <Card style={{ width: "50%", justifySelf: "center", marginTop: "50px" }}>
                    <div
                        className="questionform-image-upload-box"
                        onDrop={(event) => handleDrop(event, setImageUrl, 'imageUrl')}
                        onDragOver={handleDragOver}
                        onClick={showModal}
                    >
                        {!imageUrl ? (
                            <p>Drag & drop your question image here or click to upload.</p>
                        ) : (
                            <img src={imageUrl} alt="Question Preview" className="questionform-image-preview" />
                        )}
                    </div>

                    <Form.Item
                        id="imageUrlInput"
                        label="Question Image URL"
                        name="imageUrl"
                        rules={[{ required: true, message: 'Please input Image URL!' }]}
                        style={{ width: '100%', marginBottom: '0', marginTop: '10px' }}
                    >
                        <Input
                            style={{ marginBottom: '12px' }}
                            placeholder="Enter Image URL"
                            value={urlInput}
                            onChange={(e) => handleUrlChange(e.target.value)}
                        />
                    </Form.Item>

                    <Modal
                        title="Enter Image URL"
                        open={isModalVisible}
                        onOk={handleModalOk}
                        onCancel={handleModalCancel}
                    >
                        <Input
                            placeholder="Paste your image URL here"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                        />
                    </Modal>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <Form.Item label="Question" name="question" rules={[{ required: true, message: 'Please input Question!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                            <Input placeholder="Question" required style={{ flexGrow: 1 }} />
                        </Form.Item>
                    </div>
                    <Divider>Options</Divider>
                    <Form.Item label="Select Correct Answer" style={{ marginBottom: '16px' }}>
                        <Radio.Group onChange={(e) => setCorrectAnswer(e.target.value)} value={correctAnswer}>
                            {[...Array(4)].map((_, index) => (
                                <Radio key={index} value={form.getFieldValue(`option${index + 1}`)}>
                                    Option {index + 1}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    {[...Array(4)].map((_, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <Form.Item label={`Option ${index + 1}`} name={`option${index + 1}`} rules={[{ required: true, message: `Please input Option ${index + 1}!` }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                                <Input 
                                    placeholder={`Option ${index + 1}`} 
                                    required 
                                    style={{ flexGrow: 1 }} 
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                            </Form.Item>
                        </div>
                    ))}
                    <Form.Item>
                        <Button type="primary" htmlType='submit' className='submitBtn'
                            style={{
                                backgroundColor: buttonColor,
                                fontSize: "22px",
                                boxShadow: "inset 0px 1px 5px 0px rgba(0, 0, 0, 0.75)"
                            }}
                        >
                            {buttonText}
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </div>
    );
};

export default QuestionForm;

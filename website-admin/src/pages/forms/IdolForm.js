import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import '../../styles/IdolForm.css';
import '../../styles/Main.css';
import { Button, Select, Input, message, DatePicker, Radio, Form, Modal, AutoComplete, InputNumber } from 'antd';
import {MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import logo1 from '../../assets/Logo 1.png';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment-timezone';
import dayjs from 'dayjs';

const { Option } = Select;

const IdolForm = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const { state } = location;
  const idolData = state?.record;
  const buttonText = location.pathname === '/EditIdol' ? 'Update Idol' : 'Save Idol';
  const buttonColor = location.pathname === '/EditIdol' ? 'rgb(190,167,44)' : 'green';
  const headingText = location.pathname === '/EditIdol' ? 'EDIT IDOL' : 'ADD IDOL';

  console.log('Idol Data:', idolData);
  const initialValues = {
    ...idolData,
    birthday: idolData?.birthday ? dayjs(idolData.birthday) : null,
    debut: idolData?.debut ? dayjs(idolData.debut) : null,

};

  const [idolImage, setIdolImage] = useState(null);
  const [lightstickImage, setLightstickImage] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [funFactsList, setFunFactsList] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [imageType, setImageType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [funFactInputValue, setFunFactInputValue] = useState('');
  const [funFactsTextAreaValue, setFunFactsTextAreaValue] = useState('');

  useEffect(() => {
    if (idolData) {
      const companies = idolData.companyCurrent.map((company, index) => ({
        name: company, 
        since: idolData.companySince[company] || '', 
      }));
      const initialFunFactsArray = idolData.funFacts || []; 
      const formattedFacts = initialFunFactsArray
        .map((fact, index) => `${index + 1}.) ${fact}`) 
        .join('\n'); 
  
      setFunFactsTextAreaValue(formattedFacts);
      setFunFactsList(initialFunFactsArray); 

      form.setFieldsValue({
        languages: idolData.language || [], 
        companies: companies.length > 0 ? companies : [{ name: '', since: null }], 
      });

      setSelectedCountry(idolData.country); 
      setIdolImage(idolData.idolImage); 
      setLightstickImage(idolData.lightstickImage); 
    }
  }, [idolData, form]);

  const isValidDateFormat = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
};

const getZodiacSign = (date) => {
  const month = date.getMonth() + 1; // Month is zero-based in JS
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';

  return null; // Default case
};

const handleSubmit = async (values) => {
  const isNotEmptyOrWhitespace = (text) => text && text.trim().length > 0;
  if (!isNotEmptyOrWhitespace(values.nationality)) {
    message.error('Nationality cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.fullname)) {
    message.error('Full name cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.bloodtype)) {
    message.error('Blood Type cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.height)) {
    message.error('Height cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.koreanName)) {
    message.error('Korean Name cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.zodiacSign)) {
    message.error('Zodiac Sign cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.trainingPeriod)) {
    message.error('Training Period cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.stageName)) {
    message.error('Stage Name cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.education)) {
    message.error('Education cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.fandom)) {
    message.error('Fandom cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.mbti)) {
    message.error('MBTI cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.latestAlbum)) {
    message.error('Latest Album cannot be empty or whitespace only.');
    return;
  }
  if (!isNotEmptyOrWhitespace(values.introduction)) {
    message.error('Introduction cannot be empty or whitespace only.');
    return;
  }

  // Check if there is atleast one fun fact
  if (funFactsList.length === 0) {
    message.error('Please provide at least one fun fact about the idol');
    return;
  }
   // Check if the Korean name contains Hangul characters
   const containsKoreanCharacters = (text) => {
    const koreanRegex = /[가-힣]/; // Regular expression for Hangul characters
    return koreanRegex.test(text);
  };
  if (!containsKoreanCharacters(values.koreanName)) {
    message.error('Korean Name must contain valid Hangul characters.');
    return;
  }
  // Zodiac Sign Validation
  const validZodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const zodiacInput = values.zodiacSign?.trim(); // Get zodiac sign input and trim whitespace
  if (zodiacInput && !validZodiacSigns.map(sign => sign.toLowerCase()).includes(zodiacInput.toLowerCase())) {
    message.error('Invalid zodiac sign. Please provide a valid sign (e.g., Aries, Taurus).');
    return;
  }
  // Check if URLs are valid  
  const isValidUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (error) {
      return false;
    }
  };
  if (!isValidUrl(idolImage)) {
    message.error('Idol image URL is not valid');
    return;
  }
  if (!isValidUrl(lightstickImage)) {
    message.error('Lightstick image URL is not valid');
    return;
  }
  // Validate Birthdate
  const birthdateInput = values.birthday;
  const birthdate = new Date(birthdateInput);
  // Get the zodiac sign based on the birthdate
  const calculatedZodiacSign = getZodiacSign(birthdate);
  // Check if the provided zodiac sign matches the calculated zodiac sign
  if (values.zodiacSign && calculatedZodiacSign.toLowerCase() !== values.zodiacSign.toLowerCase()) {
    message.error(`The provided zodiac sign (${values.zodiacSign}) does not match the birthdate. It should be ${calculatedZodiacSign}.`);
    return;
  }
   
  // Calculate the current age based on birthdate
  const today = new Date();
  let calculatedAge = today.getUTCFullYear() - birthdate.getUTCFullYear(); // Use UTC methods to avoid timezone issues
  const monthDiff = today.getUTCMonth() - birthdate.getUTCMonth();
  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthdate.getUTCDate())) {
    calculatedAge--;
  }
  // Age Validation - Check if the provided age matches the calculated age
  if (values.age && values.age !== calculatedAge) {
    message.error(`The provided age (${values.age}) does not match the birthdate. It should be ${calculatedAge}.`);
    return;
  }

  // Extract social media URLs from form values
  const socialMediaUrls = values.socialMediaPlatforms;

  // Validate each social media URL
  for (const [platform, url] of Object.entries(socialMediaUrls)) {
    if (url && !isValidUrl(url)) {
      message.error(`The ${platform.charAt(0).toUpperCase() + platform.slice(1)} URL is not valid.`);
      return;
    }
  }
  
  // Language Validation - remove whitespace
  const languagesArray = values.languages.filter(language => language && language.trim() !== '');
  // Save Last Edited
  const lastEdited = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
  // MBTI Validation
  const validMBTITypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
  const mbtiInput = values.mbti?.trim(); // Get MBTI input and trim whitespace
  if (mbtiInput && !validMBTITypes.includes(mbtiInput)) {
    message.error('Invalid MBTI type. Please provide a valid type (e.g., INFJ, ENTP).');
    return;
  }
  // Blood Type Validation
  const validBloodTypes = ['A', 'B', 'AB', 'O'];
  const bloodTypeInput = values.bloodtype?.trim(); // Get blood type input and trim whitespace
  if (bloodTypeInput && !validBloodTypes.includes(bloodTypeInput)) {
    message.error('Invalid blood type. Please provide a valid type (A, B, AB, or O).');
    return;
  }
  // Check if Date are valid format
  const companySince = {};
  let allCompaniesValid = true;
  values.companies.forEach(company => {
    if (isValidDateFormat(company.since)) {
      companySince[company.name] = moment(company.since).format('YYYY-MM-DD');
    } else {
      message.error(`Invalid company since date for ${company.name}. Please use YYYY-MM-DD.`);
      allCompaniesValid = false; 
    }
  });
  if (!allCompaniesValid) {
    return; 
  }

  const dataToSubmit = {
    idolName: values.stageName,
    nationality: values.nationality,
    fullname: values.fullname,
    birthday: values.birthday,
    group: values.group,
    age: values.age,
    bloodtype: values.bloodtype,
    height: values.height,
    debut: values.debut,
    koreanName: values.koreanName,
    stageName: values.stageName,
    trainingPeriod: values.trainingPeriod,
    zodiacSign: values.zodiacSign,
    activeYears: values.activeYears,
    education: values.education,
    fandom: values.fandom,
    mbti: values.mbti,
    musicShowWins: values.musicShowWins,
    socialMediaPlatforms: values.socialMediaPlatforms,
    totalAlbums: values.totalAlbums,
    latestAlbum: values.latestAlbum,
    introduction: values.introduction,
    language: languagesArray,
    country: selectedCountry,
    companyCurrent: values.companies.map(company => company.name),
    companySince: companySince, 
    status: values.status,
    funFacts: funFactsList,
    lastEdited: lastEdited,
    idolImage: idolImage,
    lightstickImage: lightstickImage
  };

  try {
    const existingIdolsResponse = await axios.get('http://localhost:8000/idols'); // Fetch existing idols
    const existingIdols = existingIdolsResponse.data;

    // Check for duplicates (case insensitive)
    const stageNameLower = dataToSubmit.stageName?.toLowerCase();
    const duplicateStageName = existingIdols.some(idol => 
      idol.stageName.toLowerCase() === stageNameLower
    );

    let contentMessage = '';
    const isEditing = location.pathname === '/EditIdol' && idolData._id;

    if (duplicateStageName) {
      // If editing, check if the existing idol has the same ID
      const sameIdExists = existingIdols.some(idol => 
        idol.stageName.toLowerCase() === stageNameLower && idol._id === idolData._id
      );

      // If the same ID doesn't exist, show the warning
      if (!sameIdExists) {
        contentMessage = 'You are about to save or update an idol record with the same stage name as an existing record. Do you wish to continue?';
      }
    }

    // Show confirmation if there is a conflict 
    if (contentMessage) { 
      const confirmProceed = await new Promise((resolve) => {
        Modal.confirm({
          title: 'Duplicate Record Warning',
          content: contentMessage,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
      if (!confirmProceed) return; // Exit if user chooses not to proceed
    }

    if (isEditing) {
      const response = await axios.put(`http://localhost:8000/idols/${idolData._id}`, dataToSubmit);
      message.success(response.data.message);
    } else {
      const response = await axios.post('http://localhost:8000/idols', dataToSubmit);
      message.success(response.data.message);
      form.resetFields();
      clearInput();
      setSelectedCountry(undefined);
      setFunFactsList([]);
      setUrlInput('');
      setIdolImage('');
      setLightstickImage('');
    }
  } catch (error) {
    message.error('Failed to save or update idol');
    console.error('Error saving or updating idol:', error);
  }
};

  const fetchCountryNames = async () => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data = await response.json();
      setCountryData(data);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchCountryNames();
    fetchGroupNames();
  }, []);

  const fetchGroupNames = async () => {
    try {
      const response = await axios.get('http://localhost:8000/groups'); 
      const groupNames = response.data.map(group => ({
        value: group.groupName, 
      }));
      setGroupOptions(groupNames);
    } catch (error) {
      console.error('Error fetching group names:', error);
    }
  };

  const handleCountrySelect = (value) => {
    setSelectedCountry(value);
  };

  ////////////////  UPLOAD IMAGE - *START 
  const handleUrlChange = (newUrl, setImageCallback) => {
    setUrlInput(newUrl); // Update the input field value

    if (newUrl.trim() !== '') {
      const img = new Image();
      img.src = newUrl;

      img.onload = () => {
        setImageCallback(newUrl); // Set the image if it loads successfully
      };

      img.onerror = () => {
        message.warning('Image not found');
        setImageCallback(''); // Reset image on error
      };
    } else {
      setImageCallback(''); // Reset image if input is cleared
    }
  };

  const handleDrop = (event, setImageCallback, imageFieldName) => {
    event.preventDefault(); // Prevent default behavior

    const items = event.dataTransfer.items;
    let validImageCount = 0; // Counter to track valid images

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Check if the item is a URL
      if (item.kind === 'string') {
        item.getAsString((url) => {
          const imgTagMatch = url.match(/<img[^>]+src=["']([^"']+)["']/);
          if (imgTagMatch) {
            const imgUrl = imgTagMatch[1];
            const img = new Image();
            img.src = imgUrl;

            img.onload = () => {
              setImageCallback(imgUrl); // Set the image URL
              setUrlInput(imgUrl); // Update the state for the input
              form.setFieldsValue({ [imageFieldName]: imgUrl }); // Set the Form.Item value
              validImageCount++;
              checkForWarnings(); // Check for warnings after successful load
            };

            img.onerror = () => {
              setImageCallback(''); // Clear image URL on error
              setUrlInput(''); // Clear the input on error
              form.setFieldsValue({ [imageFieldName]: '' }); // Clear the Form.Item value
            };
          }
        });
      }
      // Check if the item is a file
      else if (item.kind === 'file') {
        const file = item.getAsFile();
        const fileType = file.type;

        if (fileType.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result;
            setImageCallback(dataUrl); // Use existing state update function
            setUrlInput(dataUrl); // Set the input field state
            form.setFieldsValue({ [imageFieldName]: dataUrl }); // Set the Form.Item value
            validImageCount++; // Increment counter on successful load
            checkForWarnings(); // Check for warnings after successful load
          };
          reader.readAsDataURL(file);
        } else {
          message.warning('Please drop an image file.');
        }
      }
    }

    // After processing all items, check if we had valid images
    const checkForWarnings = () => {
      if (validImageCount === 0) {
        message.warning('No valid image URL found in the dropped content.');
      }
    };
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const showModal = (type) => {
    setUrlInput('');
    setImageType(type); // Set the image type ('idol' or 'lightstick')
    setIsModalVisible(true);
  };

  // Handle modal submit
  const handleModalOk = () => {
    if (urlInput.trim() !== '') {
      const img = new Image();
      img.src = urlInput;

      img.onload = () => {
        if (imageType === 'idol') {
          form.setFieldsValue({ idolImage: urlInput }); // Use string literal for the field name
          setIdolImage(urlInput);
        } else if (imageType === 'lightstick') {
          form.setFieldsValue({ lightstickImage: urlInput }); // Use string literal for the field name
          setLightstickImage(urlInput);
        }
        setIsModalVisible(false); // Close modal
      };

      img.onerror = () => {
        message.warning('Image not found');
      };
    } else {
      message.error('Please enter a valid URL.');
    }
  };


  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  ////////////////  UPLOAD IMAGE - *END

  //////////////// ADD FUN FACT AREA - *START
  const addFunFact = () => {
    if (funFactInputValue.trim() === '') return; // Ignore empty input
    const newFact = funFactInputValue.trim();

    // Check if the fun fact already exists (case insensitive)
    if (funFactsList.some(fact => fact.toLowerCase() === newFact.toLowerCase())) {
      // Optionally, show a message or feedback to the user
      message.warning('This fun fact already exists!'); // You can use any feedback mechanism you prefer
      return; // Exit the function if the fact exists
    }

    let formattedFact;

    // Prepare the formatted fact with numbering
    if (funFactsTextAreaValue.trim() === '') {
      formattedFact = `1.) ${newFact}`; // First fun fact
    } else {
      const existingFacts = funFactsTextAreaValue.split('\n').filter(Boolean); // Split by new line and filter empty lines
      const nextIndex = existingFacts.length + 1; // Determine the next index for numbering
      formattedFact = `${nextIndex}.) ${newFact}`; // Format the new fun fact with index
    }
  
    // Save the plain fun fact (without prefix) for submission
    setFunFactsList([...funFactsList, newFact]); // Store just the fact without the prefix
    setFunFactsTextAreaValue((prev) => (prev ? `${prev}\n${formattedFact}` : formattedFact)); // Append to textarea
    setFunFactInputValue(''); // Clear the input field
  };

  const clearInput = () => {
    setFunFactInputValue(''); // Clear input field
    setFunFactsTextAreaValue(''); // Clear textarea
    setFunFactsList([]); // Clear the fun facts list
  };

  const eraseLast = () => {
    const existingFacts = funFactsTextAreaValue.split('\n').filter(Boolean); // Split by new line and filter empty lines
  if (existingFacts.length === 0) return; // If there are no facts, do nothing

  // Remove the last fun fact from both the display and the list
  existingFacts.pop();
  const updatedTextAreaValue = existingFacts.join('\n'); // Join the remaining facts
  setFunFactsTextAreaValue(updatedTextAreaValue); // Update the textarea
  
  const updatedFunFactsList = funFactsList.slice(0, -1); // Remove the last item from funFactsList
  setFunFactsList(updatedFunFactsList); // Update funFactsList for submission
  };
  //////////////// ADD FUN FACT AREA - *END

  return (
    <div className='idolForm-maincontainer'>
      <div className='idolForm'>
        <div className='main-navbar'>
          <img src={logo1} className="main-image" alt="Logo 1" />
          <div className="vertical-divider"></div>
          <h2 className='main-title'>{headingText}</h2>
        </div>
        <Form form={form} onFinish={handleSubmit} scrollToFirstError initialValues={initialValues}>
          <div className='page-box-container'>
            <div className="idolform-box-container" id="idolform-box1">
              {/* Content for box 1 */}
              <label className='headline'>1.) Input the image of the idol here</label>
              <div className="idolform-image-upload-container">
                <div>
                  {/* Idol Image Upload Section */}
                  <div
                    className="idolform-image-upload-box"
                    onDrop={(event) => handleDrop(event, setIdolImage, 'idolImage')}
                    onDragOver={handleDragOver}
                    onClick={() => showModal('idol')} // Open modal for idol image
                  >
                    {!idolImage ? (
                      <p>Drag & drop your idol image here or click to upload.</p>
                    ) : (
                      <img src={idolImage} alt="Idol Preview" className="idolform-image-preview" />
                    )}
                  </div>

                  <Form.Item
                    id="idolImageInput"
                    label="Idol Image URL"
                    name="idolImage"
                    rules={[{ required: true, message: 'Please input Idol Image URL!' }]}
                    style={{ width: '100%', marginBottom: '0', marginTop: '10px' }}
                  >
                    <Input
                      style={{ marginBottom: '12px' }}
                      placeholder="Enter Idol Image URL"
                      value={idolImage}
                      onChange={(e) => handleUrlChange(e.target.value, setIdolImage)}
                    />
                  </Form.Item>

                  {/* Lightstick Image Upload Section */}
                  <label className='headline'>3.) Input the image of the lightstick here</label>
                  <div className="idolform-image-upload-container">
                    <div
                      className="idolform-image-upload-box"
                      onDrop={(event) => handleDrop(event, setLightstickImage, 'lightstickImage')}
                      onDragOver={handleDragOver}
                      onClick={() => showModal('lightstick')} // Open modal for lightstick image
                    >
                      {!lightstickImage ? (
                        <p>Drag & drop your lightstick image here or click to upload.</p>
                      ) : (
                        <img src={lightstickImage} alt="Lightstick Preview" className="idolform-image-preview" />
                      )}
                    </div>

                    <Form.Item
                      id="lightstickImageInput"
                      label="Lightstick Image URL"
                      name="lightstickImage"
                      rules={[{ required: true, message: 'Please input Lightstick Image URL!' }]}
                      style={{ width: '100%', marginBottom: '0', marginTop: '10px' }}
                    >
                      <Input
                        style={{ marginBottom: '12px' }}
                        placeholder="Enter Lightstick Image URL"
                        value={lightstickImage}
                        onChange={(e) => handleUrlChange(e.target.value, setLightstickImage)}
                      />
                    </Form.Item>
                  </div>

                  {/* Modal for URL input */}
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
                </div>
              </div>

              <label className='headline'>5.) Input the awards and albums here</label>
              {/* Music Show Wins Field */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Form.Item
                  label="Music Show Wins"
                  name="musicShowWins"
                  rules={[
                    { required: true, message: 'Please input Music Show Wins!' },
                    { pattern: /^[0-9]+$/, message: 'Only numbers are allowed!' } // Only digits
                  ]}
                  style={{ flexGrow: 1, marginBottom: '0' }}
                >
                  <InputNumber
                    placeholder="Input total music show wins (e.g., 164)"
                    min={0} // Minimum value of 0
                    type='number'
                    style={{ flexGrow: 1, width: '100%' }}
                    formatter={(value) => (value ? String(value).replace(/[^0-9]/g, '') : '')}
                    parser={(value) => (value ? value.replace(/[^0-9]/g, '') : '')}
                  />
                </Form.Item>
              </div>

              {/* Total Albums Field */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Form.Item
                  label="Total Albums"
                  name="totalAlbums"
                  rules={[
                    { required: true, message: 'Please input Total Albums!' },
                    { pattern: /^[0-9]+$/, message: 'Only numbers are allowed!' } // Only digits
                  ]}
                  style={{ flexGrow: 1, marginBottom: '0' }}
                >
                  <InputNumber
                    placeholder="Indicate total number of albums released"
                    min={0} // Minimum value of 0
                    type='number'
                    style={{ flexGrow: 1, width: '100%' }}
                    formatter={(value) => (value ? String(value).replace(/[^0-9]/g, '') : '')}
                    parser={(value) => (value ? value.replace(/[^0-9]/g, '') : '')}
                  />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Form.Item label="Latest Album" name="latestAlbum" rules={[{ required: true, message: 'Please input Latest Album!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                  <Input placeholder="Enter their most recent album title" required rules={[{ required: true, message: 'Please input Latest Album!' }]} style={{ flexGrow: 1 }} />
                </Form.Item>
              </div>
            </div>

            <div className='trylang'>
              <div className="idolform-box-container" id="idolform-box2">
                {/* Content for box 2 */}
                <div className='idolform-box-container1' id="idolform-box3">
                  <div style={{ marginBottom: '8px' }}>
                    <label className='headline'>2.) Idol's Information</label>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0' }}>
                      <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please select a country!' }]} style={{ width: '100%', marginBottom: '14px' }}  >
                        <Select
                          placeholder="Select the country of origin"
                          style={{ width: '100%' }}
                          onChange={handleCountrySelect}
                          value={selectedCountry}
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          {countryData.map((country) => (
                            <Option key={country.cca3} value={country.name.common}>
                              {country.name.common}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    {/* Nationality Text Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Nationality" name="nationality" rules={[{ required: true, message: 'Please input Nationality!' }, { pattern: /^[A-Za-z\s\-]+$/, message: 'Only letters, spaces, and hyphens are allowed!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                        <Input placeholder="Enter the nationality (e.g., South Korean)" style={{ width: '100%' }} required rules={[{ required: true, message: 'Please input Nationality!' }]} />
                      </Form.Item>
                    </div>

                    {/* Full Name Text Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Full Name" name="fullname" rules={[{ required: true, message: 'Please input Full Name!' }]} style={{ width: '100%', marginBottom: '0' }}>
                        <Input placeholder="Provide the full name of the idol " required rules={[{ required: true, message: 'Please input Full Name!' }]} style={{ flexGrow: 1 }} />
                      </Form.Item>
                    </div>

                    {/* Blood Type Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Blood Type" name="bloodtype" rules={[{ required: true, message: 'Please input Blood Type!' }]} style={{ width: '100%', marginBottom: '0' }}>
                        <Input placeholder="Input the blood type (e.g., A, B, AB, O)" required rules={[{ required: true, message: 'Please input Blood Type!' }]} style={{ flexGrow: 1 }} />
                      </Form.Item>
                    </div>

                    {/* Height Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Height" name="height" rules={[{ required: true, message: 'Please input Height!' }]} style={{ width: '100%', marginBottom: '0' }}>
                        <Input placeholder="Enter the height (e.g., 177 cm)" required rules={[{ required: true, message: 'Please input Height!' }]} style={{ flexGrow: 1 }} />
                      </Form.Item>
                    </div>

                    {/* Group Field */}
                    <Form.Item label="Group" name="group" style={{ width: '100%', marginBottom: '12px' }}>
                      <AutoComplete
                        options={groupOptions} 
                        placeholder="Specify the idol's group name (optional)"
                        style={{ flexGrow: 1 }}
                        onSearch={fetchGroupNames} 
                      >
                        <Input />
                      </AutoComplete>
                    </Form.Item>

                    {/* Birthday Field */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Birthday" name="birthday" rules={[{ required: true, message: 'Please input Birthday!' }]} style={{ flexGrow: 1, marginBottom: "0" }}>
                          <DatePicker 
                          placeholder='Select the birth date' 
                          format="YYYY-MM-DD" 
                          required 
                          rules={[{ required: true, message: 'Please input Birthday!' }]} 
                          style={{ flexGrow: 1 , width: '100%'}} 
                          value={form.getFieldValue('birthday')}
                          onChange={(birthday) => form.setFieldsValue({ birthday })}
                          disabledDate={(current) => // Dont allow unreasonable dates
                            current && (current > moment().endOf('day') || current < moment().subtract(110, 'years'))
                          }
                        />
                      </Form.Item>
                    </div>

                    {/* Age Field */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item
                        label="Age"
                        name="age"
                        rules={[
                          { required: true, message: 'Please input Age!' },
                          { pattern: /^[0-9]+$/, message: 'Only numbers are allowed!' } // Only digits
                        ]}
                        style={{ width: '100%', marginBottom: '0' }}
                      >
                        <InputNumber
                          placeholder="Specify the age"
                          type='number'
                          style={{ flexGrow: 1, width: '100%' }}
                          min={1} // Sets minimum to prevent negative or zero input
                          formatter={(value) => (value ? String(value).replace(/[^0-9]/g, '') : '')}
                          parser={(value) => (value ? value.replace(/[^0-9]/g, '') : '')}
                        />
                      </Form.Item>
                    </div>

                    <Form.List name="companies" initialValue={[{ name: '', since: null }]}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <div key={field.key}>
                              <Form.Item
                                label={`Company ${index + 1}`} // Always show a label for each company
                                required={true}
                              >
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'name']}
                                  rules={[{ required: true, whitespace: true, message: "Please input company's name." }]}
                                  noStyle
                                >
                                  <Input placeholder="Specify the entertainment company" style={{ width: '85%' }} />
                                </Form.Item>
                                {fields.length > 1 ? (
                                  <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                                ) : null}
                              </Form.Item>

                              <Form.Item
                                label={`Company Since (Company ${index + 1})`}
                                required={true}
                              >
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'since']}
                                  rules={[{ required: true, message: 'Please input the date of the corresponding company.' }]}
                                  noStyle
                                >
                                  <Input
                                    placeholder="Enter the date when the idol joined the company (e.g., YYYY-MM-DD)"
                                    style={{ width: '80%' }}
                                  />
                                </Form.Item>
                              </Form.Item>
                            </div>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} style={{ width: '87%' }} icon={<PlusOutlined />}>
                              Add Company
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                </div>


                <div className='idolform-box-container' id="idolform-box4">
                  <div style={{ marginTop: '16px' }}>
                    <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true, message: 'Please select a status!' }]}
                    >
                      <Radio.Group >
                        <Radio value="Active">Active</Radio>
                        <Radio value="Inactive">Inactive</Radio>
                        <Radio value="In Hiatus">In Hiatus</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Korean Name" name="koreanName" rules={[{ required: true, message: 'Please input Korean Name!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Provide the idol's name in Hangul (e.g., 제이홉)" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Zodiac Sign" name="zodiacSign" rules={[{ required: true, message: 'Please input Zodiac Sign!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Enter the zodiac sign (e.g., Aquarius)" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Training Period" name="trainingPeriod" rules={[{ required: true, message: 'Please input Training Period!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Indicate duration of training (e.g., 3 Years)" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Debut" name="debut" rules={[{ required: true, message: 'Please input Debut!' }]} style={{ flexGrow: 1, marginBottom: "0" }}>
                      <DatePicker
                        placeholder='Select the debut date'
                        format="YYYY-MM-DD"
                        required
                        rules={[{ required: true, message: 'Please input Debut!' }]}
                        style={{ flexGrow: 1, width: '100%' }}
                        value={form.getFieldValue('debut')}
                        onChange={(debut) => form.setFieldsValue({ debut })}
                        disabledDate={(current) => current && current > moment().endOf('day')}
                      />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Stage Name" name="stageName" rules={[{ required: true, message: 'Please input Stage Name!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Enter the stage name of the idol" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item
                      label="Active Years"
                      name="activeYears"
                      rules={[{ required: true, message: 'Please input Active Years!' }]}
                      style={{ flexGrow: 1, marginBottom: '0' }}
                    >
                      <InputNumber
                        min={0} // Prevent negative numbers
                        placeholder="State how many years the idol has been active"
                        required
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Education" name="education" rules={[{ required: true, message: 'Please input Education!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Provide educational background" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Fandom" name="fandom" rules={[{ required: true, message: 'Please input Fandom!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Specify the fandom name" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="MBTI" name="mbti" rules={[{ required: true, message: 'Please input MBTI!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Specify the MBTI personality type (e.g., INFJ)" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>


                  <Form.Item label="Language(s):" required>
                    <Form.List
                      name="languages"
                      initialValue={['']}
                      rules={[
                        {
                          validator: async (_, languages) => {
                            if (!languages || languages.length < 1) {
                              return Promise.reject(new Error('Please provide at least one language.'));
                            }
                          },
                        },
                      ]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Form.Item key={key} required={false}>
                              <Form.Item
                                {...restField}
                                name={[name]}
                                fieldKey={[fieldKey]}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: "Please input a language.",
                                  },
                                ]}
                                noStyle
                              >
                                <Input
                                  placeholder="List the languages spoken by the idol"
                                  required
                                  style={{ width: '80%', marginRight: '8px' }}
                                />
                              </Form.Item>
                              {fields.length > 1 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => remove(name)}
                                />
                              ) : null}
                            </Form.Item>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              style={{ width: '80%' }}
                              icon={<PlusOutlined />}
                            >
                              Add Language
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form.Item>
                </div>
              </div>

              <div className='anotherbox'>
                <div className='anotherbox-small'>
                  <label className='headline' style={{ textAlign: 'center', display: 'block', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                    ENTER FUN FACTS ABOUT THIS IDOL
                  </label>
                  <div className='field'>
                    <label>Add Fun Facts:</label>
                    <Input
                      value={funFactInputValue}
                      onChange={(e) => setFunFactInputValue(e.target.value)} // Update input value state
                      placeholder='Enter fun fact here'
                    />
                    <Button onClick={addFunFact}>Add</Button>
                    <Button onClick={clearInput} style={{ marginLeft: '8px' }}>Clear All</Button>
                    <Button onClick={eraseLast} style={{ marginLeft: '8px' }}>Undo</Button>
                  </div>
                  <Form.Item
                    label="Fun Facts"
                    rules={[{ required: true, message: 'Please provide at least one fun fact about the idol' }]}
                  >
                    <TextArea
                      required
                      value={funFactsTextAreaValue}
                      placeholder="What makes this idol unique? Share a fun tidbit..."
                      autoSize={{ minRows: 5, maxRows: 10 }}
                      readOnly
                      style={{ cursor: "not-allowed" }}
                    />
                  </Form.Item>

                  <div className='anotherbox-container'>
                    <div className='anotherbox-small' style={{padding: "0px"}}>
                      <label className='headline'>6.) Social Media Platforms</label>
                      <Form.Item
                        label={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px'}}><FontAwesomeIcon icon={faYoutube} /></span>
                            <span>YouTube</span>
                          </span>
                        }
                        name={['socialMediaPlatforms', 'youtube']} 
                      >
                        <Input placeholder="Enter YouTube URL" />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}><FontAwesomeIcon icon={faSpotify} /></span>
                            <span>Spotify</span>
                          </span>
                        }
                        name={['socialMediaPlatforms', 'spotify']} 
                      >
                        <Input placeholder="Enter Spotify URL" />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}><i className='bx bxl-tiktok'></i></span>
                            <span>TikTok</span>
                          </span>
                        }
                        name={['socialMediaPlatforms', 'tiktok']} 
                      >
                        <Input placeholder="Enter TikTok URL" />
                      </Form.Item>
                    </div>
                    <div className='anotherbox-small'>
                      <Form.Item
                        style={{ marginTop: '20px' }}
                        label={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}><i className='bx bxl-instagram-alt'></i></span>
                            <span>Instagram</span>
                          </span>
                        }
                        name={['socialMediaPlatforms', 'instagram']} 
                      >
                        <Input placeholder="Enter Instagram Account URL" />
                      </Form.Item>

                      <Form.Item
                        label={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}><FontAwesomeIcon icon={faXTwitter} /></span>
                            <span>X</span>
                          </span>
                        }
                        name={['socialMediaPlatforms', 'x']} // Nested under socialMedia object
                      >
                        <Input placeholder="Enter X Account URL" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Idol Introduction Container*/}
          <div className='addFLex'>
            <div className='anotherbox-small'>
              <label className='headline'>7.) Create Introduction here:</label>
              <Form.Item name="introduction" label="Introduction" rules={[{ required: true, message: 'Please provide an introduction' }]} >
                <TextArea
                  placeholder="Write a brief introduction about the idol, including their achievements, background, and personality."
                  required
                  autoSize={{ minRows: 5, maxRows: 10 }}
                />
              </Form.Item>


              {/* Submit Button */}
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
            </div>
          </div>


        </Form>
      </div>
    </div>
  );
};

export default IdolForm;

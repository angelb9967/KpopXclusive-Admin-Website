import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import '../styles/IdolForm.css';
import { Button, Select, Input, Space, message, DatePicker, Radio, Form, Modal } from 'antd';
import { DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment-timezone';

const { Option } = Select;

const IdolForm = () => {
  const [form] = Form.useForm();
  const location = useLocation(); // Get the current location
  const buttonText = location.pathname === '/EditIdol' ? 'Update Idol' : 'Save Idol';

  const [idolImage, setIdolImage] = useState(null);
  const [lightstickImage, setLightstickImage] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [funFactsList, setFunFactsList] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [imageType, setImageType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [funFactInputValue, setFunFactInputValue] = useState('');
  const [funFactsTextAreaValue, setFunFactsTextAreaValue] = useState('');

  const handleSubmit = async (values) => {
    if (funFactsList.length === 0) {
      message.error('Please provide at least one fun fact about the idol');
      return;
    }

    const languagesArray = values.languages.filter(language => language && language.trim() !== '');
    const lastEdited = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
    const formattedBirthday = moment(values.birthday).format('YYYY-MM-DD');
    const formattedDebut = moment(values.debut).format('YYYY-MM-DD');

    const dataToSubmit = {
      idolName: values.stageName,
      nationality: values.nationality,
      fullname: values.fullname,
      birthday: formattedBirthday,
      group: values.group,
      age: values.age,
      bloodtype: values.bloodtype,
      height: values.height,
      debut: formattedDebut,
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
      companySince: Object.fromEntries(values.companies.map(company => [
        company.name,
        moment(company.since).format('YYYY-MM-DD')
      ])),
      status: values.status,
      funFacts: funFactsList,
      lastEdited: lastEdited,
      idolImage: idolImage,
      lightstickImage: lightstickImage
    };

    try {
      const response = await axios.post('http://localhost:8000/idols', dataToSubmit);
      message.success(response.data.message);
      form.resetFields();
      setSelectedCountry(undefined);
      setFunFactsList([]);
      setUrlInput('');
      setIdolImage('');
      setLightstickImage('');
    } catch (error) {
      message.error('Failed to save idol');
      console.error('Error saving idol:', error);
    }
  };

  ////////////////  FETCH COUNTRY NAMES API - *START 
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
    // Fetch country names when component mounts
    fetchCountryNames();
  }, []);

  const handleCountrySelect = (value) => {
    setSelectedCountry(value);
  };
  ////////////////  FETCH COUNTRY NAMES API - *END 

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
    // Remove the last fun fact
    existingFacts.pop();
    const updatedTextAreaValue = existingFacts.join('\n'); // Join the remaining facts
    setFunFactsTextAreaValue(updatedTextAreaValue); // Update the textarea
  };
  //////////////// ADD FUN FACT AREA - *END

  return (
    <div className='idolForm-maincontainer'>
      <div className='idolForm'>
        <h1 className='idolform-title'>KPOP IDOL INFORMATION</h1>
        <Form form={form} onFinish={handleSubmit} scrollToFirstError>
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
      value={urlInput}
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
        value={urlInput}
        onChange={(e) => handleUrlChange(e.target.value, setLightstickImage)}
      />
    </Form.Item>
  </div>

  {/* Modal for URL input */}
  <Modal
    title="Enter Image URL"
    visible={isModalVisible}
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
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Form.Item label="Music Show Wins" name="musicShowWins" rules={[{ required: true, message: 'Please input Music Show Wins!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                  <Input type='number' placeholder="Music Show Wins" required rules={[{ required: true, message: 'Please input Music Show Wins!' }]} style={{ flexGrow: 1 }} />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Form.Item label="Total Albums" name="totalAlbums" rules={[{ required: true, message: 'Please input Total Albums!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                  <Input type='number' placeholder="Total Albums" required rules={[{ required: true, message: 'Please input Total Albums!' }]} style={{ flexGrow: 1 }} />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Form.Item label="Latest Album" name="latestAlbum" rules={[{ required: true, message: 'Please input Latest Album!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                  <Input placeholder="Latest Album" required rules={[{ required: true, message: 'Please input Latest Album!' }]} style={{ flexGrow: 1 }} />
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
                          placeholder="Select a country"
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
                      <Form.Item label="Nationality" name="nationality" rules={[{ required: true, message: 'Please input Nationality!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                        <Input placeholder="Nationality" style={{ width: '100%' }} required rules={[{ required: true, message: 'Please input Nationality!' }]} />
                      </Form.Item>
                    </div>

                    {/* Full Name Text Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Full Name" name="fullname" rules={[{ required: true, message: 'Please input Full Name!' }]} style={{ width: '100%', marginBottom: '0' }}>
                        <Input placeholder="Full Name" required rules={[{ required: true, message: 'Please input Full Name!' }]} style={{ flexGrow: 1 }} />
                      </Form.Item>
                    </div>

                    {/* Blood Type Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Blood Type" name="bloodtype" rules={[{ required: true, message: 'Please input Blood Type!' }]} style={{ width: '100%', marginBottom: '0' }}>
                        <Input placeholder="Blood Type" required rules={[{ required: true, message: 'Please input Blood Type!' }]} style={{ flexGrow: 1 }} />
                      </Form.Item>
                    </div>

                    {/* Height Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Height" name="height" rules={[{ required: true, message: 'Please input Height!' }]} style={{ width: '100%', marginBottom: '0' }}>
                        <Input placeholder="Height" required rules={[{ required: true, message: 'Please input Height!' }]} style={{ flexGrow: 1 }} />
                      </Form.Item>
                    </div>

                    {/* Group Field */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Group" name="group" rules={[{ required: true, message: 'Please input Group!' }]} style={{ width: '100%', marginBottom: '0' }}>
                        <Input placeholder="Group" required rules={[{ required: true, message: 'Please input Group!' }]} style={{ flexGrow: 1 }} />
                      </Form.Item>
                    </div>

                    {/* Birthday Field */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Birthday" name="birthday" rules={[{ required: true, message: 'Please input Birthday!' }]} style={{ flexGrow: 1, marginBottom: "0" }}>
                        <DatePicker placeholder='Birthday' required style={{ width: '100%' }} />
                      </Form.Item>
                    </div>

                    {/* Age Field */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Age" name="age" rules={[{ required: true, message: 'Please input Age!' }]} style={{ width: '100%', marginBottom: '0' }}>
                        <Input type='number' placeholder='Age' required rules={[{ required: true, message: 'Please input Age!' }]} style={{ flexGrow: 1 }} />
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
                                  <Input placeholder="Company Name" style={{ width: '85%' }} />
                                </Form.Item>
                                {fields.length > 1 ? (
                                  <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                                ) : null}
                              </Form.Item>

                              <Form.Item
                                label={`Company Since (Company ${index + 1})`} // Keep the label for Company Since
                                required={true}
                              >
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'since']}
                                  rules={[{ required: true, message: 'Please select the year of the corresponding company.' }]}
                                  noStyle
                                >
                                  <DatePicker
                                    placeholder="Select date"
                                    style={{ width: '80%' }}
                                    format="YYYY-MM-DD" // Set the format you need
                                    disabledDate={current => current && current > moment().endOf('day')} // Disable future dates if necessary
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
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Korean Name" name="koreanName" rules={[{ required: true, message: 'Please input Korean Name!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Korean Name" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Zodiac Sign" name="zodiacSign" rules={[{ required: true, message: 'Please input Zodiac Sign!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Zodiac Sign" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Training Period" name="trainingPeriod" rules={[{ required: true, message: 'Please input Training Period!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Training Period" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Debut" name="debut" rules={[{ required: true, message: 'Please input Debut!' }]} style={{ flexGrow: 1, marginBottom: "0" }}>
                      <DatePicker placeholder='Debut' required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Stage Name" name="stageName" rules={[{ required: true, message: 'Please input Stage Name!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Stage Name" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Active Years" name="activeYears" rules={[{ required: true, message: 'Please input Active Years!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Active Years" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Education" name="education" rules={[{ required: true, message: 'Please input Education!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Education" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Fandom" name="fandom" rules={[{ required: true, message: 'Please input Fandom!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Fandom" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="MBTI" name="mbti" rules={[{ required: true, message: 'Please input MBTI!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="MBTI" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>


                  <Form.Item label="Language(s):" required>
                    <Form.List
                      name="languages"
                      initialValue={['']} // Start with one empty input
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
                                  placeholder="Language"
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
                <label className='headline'>ENTER FUN FACTS ABOUT THIS IDOL!</label>
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
                  <div className='anotherbox-small'>
                    <label className='headline'>6.) Social Media Platforms</label>
                    <Form.Item
                      label={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: '8px' }}><FontAwesomeIcon icon={faYoutube} /></span>
                          <span>YouTube</span>
                        </span>
                      }
                      name={['socialMediaPlatforms', 'youtube']} // Nested under socialMedia object
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
                      name={['socialMediaPlatforms', 'spotify']} // Nested under socialMedia object
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
                      name={['socialMediaPlatforms', 'tiktok']} // Nested under socialMedia object
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
                      name={['socialMediaPlatforms', 'instagram']} // Nested under socialMedia object
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
                <Button type="primary" htmlType='submit' className='submitBtn'>
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

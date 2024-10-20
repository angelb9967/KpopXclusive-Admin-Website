import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import '../styles/IdolForm.css';
import { Button, Select, Input, Space, message, DatePicker, Radio, Form } from 'antd';
import { DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

const IdolForm = () => {
  const [form] = Form.useForm();
  const [idolImage, setIdolImage] = useState(null);
  const [lightstickImage, setLightstickImage] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [funFactsList, setFunFactsList] = useState([]); 
  const [funFactInputValue, setFunFactInputValue] = useState(''); 
  const [funFactsTextAreaValue, setFunFactsTextAreaValue] = useState(''); 
  const location = useLocation(); // Get the current location

  // Determine button text based on the current URL
  const buttonText = location.pathname === '/EditIdol' ? 'Update Idol' : 'Save Idol';

  // Fetch country names from the API
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => setCountryData(data))
      .catch((error) => message.error('Failed to fetch countries'));
  }, []);

  const handleCountrySelect = (value) => {
    setSelectedCountry(value);
  };

  const handleChange = () => {

  };

  ////////////////  UPLOAD IMAGE - *START 

  const handleFile = (file, setImage) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (event, setImage) => {
    const file = event.target.files[0];
    handleFile(file, setImage);
  };

  const handleDrop = (event, setImage) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file, setImage);
  };

  const handlePaste = (event, setImage) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.includes('image')) {
        const file = items[i].getAsFile();
        handleFile(file, setImage);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

   ////////////////  UPLOAD IMAGE - *END


   //////////////// ADD FUN FACT AREA - *START

   const addFunFact = () => {
    if (funFactInputValue.trim() === '') return; // Ignore empty input

    const newFact = funFactInputValue.trim();
    let formattedFact;

    if (funFactsTextAreaValue.trim() === '') {
      formattedFact = `1.) ${newFact}`; // First fun fact
    } else {
      const existingFacts = funFactsTextAreaValue.split('\n').filter(Boolean); // Split by new line and filter empty lines
      const nextIndex = existingFacts.length + 1; // Determine the next index for numbering
      formattedFact = `${nextIndex}.) ${newFact}`; // Format the new fun fact
    }

    setFunFactsList([...funFactsList, formattedFact]); // Store the formatted fun fact
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

  const onFinish = async (values) => {
    const formData = {
      ...values,
      idolImage, // Idol image
      lightstickImage, // Lightstick image
    };

    try {
      const response = await axios.post('http://localhost:8000/idols', formData);
      message.success(response.data.message);
    } catch (error) {
      message.error('Failed to save idol');
    }
  };

  const onCompanyNameChange = (index) => {
    const companies = form.getFieldValue('companies');

    // Automatically show the "Since" field if the company name is not empty
    const updatedCompanies = companies.map((company, idx) => {
      if (idx === index) {
        return {
          ...company,
          showSince: !!company.name, // Show "Since" if company name is not empty
        };
      }
      return company;
    });

    form.setFieldsValue({ companies: updatedCompanies });
  };

  return (
    <div className='idolForm-maincontainer'>
      <div className='idolForm'>
        <h1 className='idolform-title'>KPOP IDOL INFORMATION</h1>
        <Form form={form} onFinish={onFinish}>
          <div className='page-box-container'>
            <div className="idolform-box-container" id="idolform-box1">
              {/* Content for box 1 */}
              <label className='headline'>1.) Input the image of the idol here</label>
              <div className="idolform-image-upload-container">
                <div
                  className="idolform-image-upload-box"
                  onDrop={(event) => handleDrop(event, setIdolImage)}
                  onDragOver={handleDragOver}
                  onPaste={(event) => handlePaste(event, setIdolImage)}
                  onClick={() => document.getElementById('idolFileInput').click()}
                >
                  {!idolImage ? (
                    <p>Paste your image here, drag & drop, or double-click to upload.</p>
                  ) : (
                    <img src={idolImage} alt="Idol Preview" className="idolform-image-preview" />
                  )}
                </div>
                <div className="idolform-file-actions">
                  <button onClick={() => document.getElementById('idolFileInput').click()}>
                    Choose File
                  </button>
                  <input
                   id="idolFileInput"
                   type="file"
                   accept="image/*"
                   onChange={(event) => handleFileSelect(event, setIdolImage)}
                   style={{ display: 'none' }}
                />
              </div>
            </div>

            <label className='headline'>3.) Input the image of the lightstick here</label>
            <div className="idolform-image-upload-container">
              <div
                className="idolform-image-upload-box"
                onDrop={(event) => handleDrop(event, setLightstickImage)}
                  onDragOver={handleDragOver}
                  onPaste={(event) => handlePaste(event, setLightstickImage)}
                  onClick={() => document.getElementById('lightstickFileInput').click()}
                >
                  {!lightstickImage ? (
                    <p>Paste your image here, drag & drop, or double-click to upload.</p>
                  ) : (
                    <img src={lightstickImage} alt="Lightstick Preview" className="idolform-image-preview" />
                  )}
                </div>
                <div className="idolform-file-actions">
                  <button onClick={() => document.getElementById('lightstickFileInput').click()}>
                    Choose File
                  </button>
                  <input
                   id="lightstickFileInput"
                   type="file"
                   accept="image/*"
                   onChange={(event) => handleFileSelect(event, setLightstickImage)}
                   style={{ display: 'none' }}
                />
              </div>
            </div>

            <label className='headline'>5.) Input the awards and albums here</label>
            {['Music Show Wins', 'Total Wins', 'Latest Album'].map((placeholder, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ marginRight: '8px', flexShrink: 0 }}>{placeholder}:</span>
                <Input placeholder={placeholder} style={{ flexGrow: 1 }} />
              </div>
            ))}
          </div>



          <div className='trylang'>
            <div className="idolform-box-container" id="idolform-box2">
              {/* Content for box 2 */}
              <div className='idolform-box-container1' id="idolform-box3">
                <div style={{ marginBottom: '16px' }}>
                  <label className='headline'>2.) Idol's Information</label>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ marginRight: '8px', flexShrink: 0 }}>Country:</span>
                    <Select
                      placeholder="Select a country"
                      style={{ flexGrow: 1 }}
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
                  </div>

                  {['Nationality', 'Full Name', 'Blood type', 'Height', 'Group'].map((placeholder, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ marginRight: '8px', flexShrink: 0 }}>{placeholder}:</span>
                      <Input placeholder={placeholder} style={{ flexGrow: 1 }} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ marginRight: '8px', flexShrink: 0 }}>Birthday:</span>
                    <DatePicker style={{ flexGrow: 1 }} placeholder='Birthday' />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ marginRight: '8px', flexShrink: 0 }}>Age:</span>
                    <Input type='number' placeholder='Age' style={{ flexGrow: 1 }} />
                  </div>

                  <Form
                    form={form}
                    name="dynamic_form_item"
                    onFinish={onFinish}
                    style={{
                      maxWidth: 600,
                    }}
                    initialValues={{ companies: [{ name: '', since: '', showSince: false }] }}
                  >
                    <Form.List
                      name="companies"
                      rules={[
                        {
                          validator: async (_, companies) => {
                            if (!companies || companies.length < 1) {
                              return Promise.reject(new Error('Please provide at least 1 company'));
                            }
                          },
                        },
                      ]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => (
                            <div key={field.key}>
                              <Form.Item
                                {...(index === 0 ? { label: 'Company' } : {})}
                                required={false}
                              >
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'name']} // Use 'name' as the field name
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: "Please input company's name.",
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Input
                                    placeholder="Company Name"
                                    style={{
                                      width: '60%',
                                    }}
                                    onChange={() => onCompanyNameChange(index)} // Trigger visibility check for "Since" field
                                  />
                                </Form.Item>
                                {fields.length > 1 ? (
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                  />
                                ) : null}
                              </Form.Item>

                              {/* Show the "Company Since" field only if the corresponding company name is not empty */}
                              {form.getFieldValue(['companies', index, 'showSince']) && (
                                <Form.Item
                                  label={`Company Since for Company ${index + 1}`}

                                  required={true}
                                >
                                  <Form.Item
                                    name={[field.name, 'since']} // Use 'since' as the field name
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                      {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please input the year of the corresponding company.',
                                      },
                                    ]}
                                    noStyle
                                  >
                                    <Input
                                      placeholder="Ex. 2024-01-01"
                                      style={{
                                        width: '60%',
                                      }}
                                    />
                                  </Form.Item>
                                </Form.Item>
                              )}
                            </div>
                          ))}

                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                // Add new company object with initial state
                                const currentCompanies = form.getFieldValue('companies');
                                form.setFieldsValue({
                                  companies: [...currentCompanies, { name: '', since: '', showSince: false }],
                                });
                              }}
                              style={{
                                width: '60%',
                              }}
                              icon={<PlusOutlined />}
                            >
                              Add Company
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form>
                </div>
              </div>


              <div className='idolform-box-container' id="idolform-box4">
                <div style={{ marginTop: '16px' }}>
                  <span style={{ marginRight: '8px' }}>Status:</span>
                  <Radio.Group>
                    <Radio value="Active">Active</Radio>
                    <Radio value="Inactive">Inactive</Radio>
                  </Radio.Group>
                </div>
                {['Korean Name', 'Zodiac Sign', 'Training Period', 'Debut', 'Stage Name', 'Active Years', 'Education', 'Fandom', 'MBTI'].map((placeholder, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ marginRight: '8px', flexShrink: 0 }}>{placeholder}:</span>
                    <Input placeholder={placeholder} style={{ flexGrow: 1 }} />
                  </div>
                ))}

                <Form
                  name="language_form"
                  onFinish={onFinish}
                  style={{
                    maxWidth: 600,
                  }}
                >
                  <Form.Item label="Language(s):">
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
                            <Form.Item
                              required={false}
                              key={key}
                            >
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
                                  style={{ width: '60%', marginRight: '8px' }}
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
                              style={{ width: '60%' }}
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
                </Form>

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
                  <Button onClick={clearInput} style={{ marginLeft: '8px' }}>Clear</Button>
                  <Button onClick={eraseLast} style={{ marginLeft: '8px' }}>Undo</Button>
                </div>
                <TextArea 
                  value={funFactsTextAreaValue}
                  placeholder="What makes this idol unique? Share a fun tidbit..."
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  disabled
                />

                <div className='anotherbox-container'>
                  <div className='anotherbox-small'>
                    <label className='headline'>6.) Social Media Platforms</label>
                    {/* Youtube */}
                    <div className='social-media-item'>
                    <span className='social-media-logo'>
                      <FontAwesomeIcon icon={faYoutube} />
                    </span>
                    <span className='social-media-name'>Youtube:</span>
                    <Input placeholder="Youtube" className='social-media-input' />
                  </div>

                  {/* Spotify */}
                  <div className='social-media-item'>
                    <span className='social-media-logo'>
                      <FontAwesomeIcon icon={faSpotify} />
                    </span>
                    <span className='social-media-name'>Spotify:</span>
                    <Input placeholder="Spotify" className='social-media-input' />
                  </div>

                  {/* Tiktok */}
                  <div className='social-media-item'>
                    <span className='social-media-logo'>
                      <i className='bx bxl-tiktok' />
                    </span>
                    <span className='social-media-name'>Tiktok:</span>
                    <Input placeholder="Tiktok" className='social-media-input' />
                  </div>
                  </div>
                  <div className='anotherbox-small'>
                    {[
                      { icon: <i className='bx bxl-instagram-alt'></i>, name: 'Instagram', fieldName: 'socialMedia.instagram' },
                      { icon: <FontAwesomeIcon icon={faXTwitter} />, name: 'X', fieldName: 'socialMedia.twitter' },
                    ].map((item, index) => (
                      <Form.Item
                        key={index}
                        label={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}>{item.icon}</span>
                            <span>{item.name}:</span>
                          </span>
                        }
                      >
                        <Input placeholder={`Enter ${item.name} URL`} name={item.fieldName} />
                      </Form.Item>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
          <div className='addFLex'>
            <div className='anotherbox-small'>
              <label className='headline'>7.) Create Introduction here:</label>
              <TextArea
                name="introduction"
                placeholder="Write a brief introduction about the idol, including their achievements, background, and personality."
                autoSize={{ minRows: 5, maxRows: 10 }} 
                onChange={handleChange}
                required
                />
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

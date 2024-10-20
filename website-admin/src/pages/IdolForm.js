import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import '../styles/IdolForm.css';
import { Button, Select, Input, Space, message, DatePicker, Radio, Form } from 'antd';
import { DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};

const IdolForm = () => {
  const [image, setImage] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Fetch country names from the API
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
    fetchCountryNames(); // Fetch country names when component mounts
  }, []);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.includes('image')) {
        const file = items[i].getAsFile();
        handleFile(file);
      }
    }
  };

  const handleCountrySelect = (value) => {
    setSelectedCountry(value);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const [form] = Form.useForm();

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

  const onFinish = (values) => {
    console.log('Form Submitted: ', values);
  };


  return (
    <div className='idolForm-maincontainer'>
      <div className='idolForm'>
        <h1 className='idolform-title'>KPOP IDOL INFORMATION</h1>
        <div className='page-box-container'>
          <div className="idolform-box-container" id="idolform-box1">
            {/* Content for box 1 */}
            <label className='headline'>1.) Input the image of the idol here</label>
            <div className="idolform-image-upload-container">
              <div
                className="idolform-image-upload-box"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onPaste={handlePaste}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {!image ? (
                  <p>Paste your image here, drag & drop, or double-click to upload.</p>
                ) : (
                  <img src={image} alt="Preview" className="idolform-image-preview" />
                )}
              </div>
              <div className="idolform-file-actions">
                <button onClick={() => document.getElementById('fileInput').click()}>
                  Choose File
                </button>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <label className='headline'>3.) Input the image of the lightstick here</label>
            <div className="idolform-image-upload-container">
              <div
                className="idolform-image-upload-box"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onPaste={handlePaste}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {!image ? (
                  <p>Paste your image here, drag & drop, or double-click to upload.</p>
                ) : (
                  <img src={image} alt="Preview" className="idolform-image-preview" />
                )}
              </div>
              <div className="idolform-file-actions">
                <button onClick={() => document.getElementById('fileInput').click()}>
                  Choose File
                </button>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
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
                <Input placeholder='Enter fun fact here' />
                <Button>Add</Button>
              </div>
              <TextArea
                placeholder="What makes this idol unique? Share a fun tidbit..."
                disabled
                autoSize={{ minRows: 5, maxRows: 10 }}
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
                    { icon: <i class='bx bxl-instagram-alt'></i>, name: 'Instagram' },
                    { icon: <FontAwesomeIcon icon={faXTwitter} />, name: 'X' },
                  ].map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ marginRight: '8px', flexShrink: 0 }}>
                        {item.icon}
                      </span>
                      <span style={{ marginRight: '8px', flexShrink: 0 }}>{item.name}:</span>
                      <Input placeholder={item.name} style={{ flexGrow: 1 }} />
                    </div>
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
              placeholder="Write a brief introduction about the idol, including their achievements, background, and personality."
              autoSize={{ minRows: 5, maxRows: 10 }} />
            <Button className='submitBtn'>ADD</Button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default IdolForm;

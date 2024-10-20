import React, { useState, useEffect } from 'react';
import '../styles/GroupForm.css';
import { Button, Select, Input, Space, message, Form, Radio, Table } from 'antd';
import { DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/skeleton/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import TextArea from 'antd/es/input/TextArea';
import { useLocation } from 'react-router-dom';

const { Option } = Select;

const membersData = [
  {
    key: '1',
    name: 'John Doe',
    link: 'http://example.com/johndoe',
  },
  {
    key: '2',
    name: 'Jane Smith',
    link: 'http://example.com/janesmith',
  },
  // Add more members as needed
];

const GroupForm = () => {
  const [image, setImage] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const location = useLocation(); // Get the current location

  // Determine button text based on the current URL
  const buttonText = location.pathname === '/EditGroup' ? 'Update Group' : 'Save Group';

  const handleEdit = (key) => {
    console.log(`Edit member with key: ${key}`);
  };

  const handleRemove = (key) => {
    console.log(`Remove member with key: ${key}`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button onClick={() => handleEdit(record.key)} type="primary" style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={() => handleRemove(record.key)} type="danger">
            Remove
          </Button>
        </span>
      ),
    },
  ];

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
    // Fetch country names when component mounts
    fetchCountryNames();
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
    <div className='groupForm-maincontainer'>
      <div className='groupForm'>
        <h1 className='groupform-title'>KPOP GROUP INFORMATION</h1>
        <div className="groupform-box-container">
          <div className="groupform-box1" id="groupform-box1">
            {/* Content for box 1 */}
            <label className='headline'>1.) Input the image of the group here</label>
            <div className="groupform-image-upload-container">
              <div
                className="groupform-image-upload-box"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onPaste={handlePaste}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {!image ? (
                  <p>Paste your image here, drag & drop, or double-click to upload.</p>
                ) : (
                  <img src={image} alt="Preview" className="groupform-image-preview" />
                )}
              </div>
              <div className="groupform-file-actions">
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
            <div className="groupform-image-upload-container">
              <div
                className="groupform-image-upload-box"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onPaste={handlePaste}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {!image ? (
                  <p>Paste your image here, drag & drop, or double-click to upload.</p>
                ) : (
                  <img src={image} alt="Preview" className="groupform-image-preview" />
                )}
              </div>
              <div className="groupform-file-actions">
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
            <div className="groupform-box-container" id="groupform-box2">
              <div className='groupform-box-container1' id="groupform-box3">
                <div style={{ marginBottom: '16px' }}>
                  <label className='headline'>2.) Group's Information</label>
                  {['Group Name', 'Korean Group Name', 'Debut', 'Debut to 1st win', 'Fandom'].map((placeholder, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ marginRight: '8px', flexShrink: 0 }}>{placeholder}:</span>
                      <Input placeholder={placeholder} style={{ flexGrow: 1 }} />
                    </div>
                  ))}

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ marginRight: '8px' }}>Country:</span>
                    <Select
                      placeholder="Select a country"
                      style={{ width: 'calc(100% - 100px)' }}
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

              <div className="groupform-box1" id="groupform-box4">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ marginRight: '8px' }}>Active Years:</span>
                  <Input placeholder="Active Years" style={{ flexGrow: 1 }} />
                </div>
                <div style={{ marginTop: '16px' }}>
                  <span style={{ marginRight: '8px' }}>Status:</span>
                  <Radio.Group>
                    <Radio value="Active">Active</Radio>
                    <Radio value="Inactive">Inactive</Radio>
                  </Radio.Group>
                </div>

              </div>
            </div>


            <div className='anotherbox anotherbox-container'>
              <div className='anotherbox-small'>
                <label className='headline'>4.) Group Members</label>
                <div className="groupform-image-upload-container" id='changeFlex'>
                  <label className='headline'>Add Member:</label>
                  <div
                    className="groupform-image-upload-box"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onPaste={handlePaste}
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    {!image ? (
                      <p>Paste your image here, drag & drop, or double-click to upload.</p>
                    ) : (
                      <img src={image} alt="Preview" className="groupform-image-preview" />
                    )}
                  </div>
                  <div className="groupform-file-actions">
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
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span id='name' style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>Add Name:</span>
                  <Input placeholder="Add Name" style={{ flexGrow: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span id='name' style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>Add Link to Image:</span>
                  <Input placeholder="Link to Image" style={{ flexGrow: 1 }} />
                  <Button style={{ width: '150px', marginLeft: '8px', backgroundColor: '#45a049', color: 'white' }} >Add</Button>
                </div>
              </div>


              <div className='anotherbox-small'>
                <div>
                  <Title level={4}>Current Members</Title>
                  <Table dataSource={membersData} columns={columns} pagination={false} />
                </div>




              </div>





            </div>

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
        <div className='addFLex'>
          <div className='anotherbox-small'>
            <label className='headline'>7.) Create Introduction here:</label>
            <TextArea
              placeholder="Write a brief introduction about the group, including their achievements, background, and songs."
              autoSize={{ minRows: 5, maxRows: 10 }} />
            <Button className='submitBtn'>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;

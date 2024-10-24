import React, { useState, useEffect } from 'react';
import '../styles/GroupForm.css';
import { Button, Select, Input, Space, message, Form, Radio, Table, Modal, DatePicker } from 'antd';
import { DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/skeleton/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import TextArea from 'antd/es/input/TextArea';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment-timezone';

const { Option } = Select;

const GroupForm = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const buttonText = location.pathname === '/EditGroup' ? 'Update Group' : 'Save Group';

  const [memberImage, setMemberImage] = useState(null);
  const [groupImage, setGroupImage] = useState(null);
  const [lightstickImage, setLightstickImage] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [editKey, setEditKey] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [imageType, setImageType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSubmit = async (values) => {
    // Helper function to validate URLs
    const isValidUrl = (urlString) => {
      try {
        new URL(urlString);
        return true;
      } catch (error) {
        return false;
      }
    };

    // Validate group and lightstickImage URLs
    if (!isValidUrl(groupImage)) {
      message.error('Group image URL is not valid');
      return;
    }

    if (!isValidUrl(lightstickImage)) {
      message.error('Lightstick image URL is not valid');
      return;
    }

    if (groupMembers.length === 0) {
      message.error('Please add at least one member to the group.');
      return;
    }

    const lastEdited = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
    const formattedDebut = moment(values.debut).format('YYYY-MM-DD');

    const dataToSubmit = {
      groupName: values.groupName,
      koreanGroupName: values.koreanGroupName,
      debut: formattedDebut,
      debutToFirstWin: values.debutToFirstWin,
      country: values.country,
      fandom: values.fandom,
      companyCurrent: values.companyCurrent,
      companySince: values.companySince,
      activeYears: values.activeYears,
      status: values.status,
      musicShowWins: values.musicShowWins,
      totalAlbums: values.totalAlbums,
      latestAlbum: values.latestAlbum,
      upcomingAlbum: values.upcomingAlbum,
      groupIntro: values.groupIntro,
      groupImage: values.groupImage,
      lightstickImage: values.lightstickImage,
      socialMediaPlatforms: values.socialMediaPlatforms,
      groupMembers: groupMembers.map(member => ({
        name: member.name,
        image: member.image,
        memberLink: member.link
      })),
      lastEdited: lastEdited
    };

    try {
      const response = await axios.post('http://localhost:8000/groups', dataToSubmit);
      message.success(response.data.message);
      form.resetFields();
      setGroupMembers([]);
      setSelectedCountry(undefined);
      setUrlInput('');
      setGroupImage('');
      setLightstickImage('');
      setMemberImage('');
    } catch (error) {
      message.error('Failed to save group');
      console.error('Error saving group:', error);
    }
  };

  ////////////////  FETCH MEMBER TABLE - *START 
  const handleSaveMember = () => {
    const memberName = form.getFieldValue('name');
    const memberLink = form.getFieldValue('memberLink');

    if (!memberImage || !memberName || !memberLink) {
      message.error('Please fill out all member fields.');
      return;
    }

    const isValidUrl = (urlString) => {
      try {
        new URL(urlString);
        return true;
      } catch (error) {
        return false;
      }
    };

    if (!isValidUrl(memberImage)) {
      message.error('Member image URL is not valid');
      return;
    }

    const newMember = {
      key: editKey || Date.now(), 
      name: memberName,
      image: memberImage,
      link: memberLink,
    };

    if (editKey) {
      // Update existing member
      const updatedMembers = groupMembers.map(member =>
        member.key === editKey ? newMember : member
      );
      setGroupMembers(updatedMembers);
      setEditKey(null); // Reset after editing
      message.success('Member updated successfully.');
    } else {
      // Add new member
      setGroupMembers([...groupMembers, newMember]);
      message.success('Member added successfully.');
    }  

    // Clear input fields after saving
    form.resetFields(['name', 'memberLink', 'memberImage']);
    setMemberImage(''); 
    setUrlInput(''); 
  }

  // Edit member - populate fields for editing
  const handleEdit = (key) => {
    const memberToEdit = groupMembers.find((member) => member.key === key);
    form.setFieldsValue({
      name: memberToEdit.name,
      memberLink: memberToEdit.link,
      memberImage: memberToEdit.image, 
    });
    setMemberImage(memberToEdit.image); // Set image for editing
    setUrlInput(memberToEdit.image); // Populate the image URL in the input field
    setEditKey(key); // Set the key for editing
  };

  // Remove member from the table
  const handleRemove = (key) => {
    const updatedMembers = groupMembers.filter(member => member.key !== key);
    setGroupMembers(updatedMembers);
    message.success('Member removed successfully.');
  };

  ////////////////  FETCH MEMBER TABLE - *END

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
    setImageType(type); // Set the image type ('group' or 'lightstick' or 'member')
    setIsModalVisible(true);
  };

  // Handle modal submit
  const handleModalOk = () => {
    if (urlInput.trim() !== '') {
      const img = new Image();
      img.src = urlInput;

      img.onload = () => {
        if (imageType === 'group') {
          form.setFieldsValue({ groupImage: urlInput });
          setGroupImage(urlInput);
        } else if (imageType === 'lightstick') {
          form.setFieldsValue({ lightstickImage: urlInput });
          setLightstickImage(urlInput);
        } else if (imageType === 'member') {
          form.setFieldValue({ memberImage: urlInput });
          setMemberImage(urlInput);
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
      title: 'Image',
      dataIndex: 'image', // Ensure this matches the property name in your data
      key: 'image',
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="member"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Adjust size as needed
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Button 
            onClick={() => handleEdit(record.key)} 
            type="primary" 
            size="small"
            style={{ flex: '1 1 auto' }}
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleRemove(record.key)} 
            type="danger" 
            size="small"
            style={{ flex: '1 1 auto' }}
          >
            Remove
          </Button>
        </div>
      ),
    }    
  ];  

  return (
    <div className='groupForm-maincontainer'>
      <div className='groupForm'>
        <h1 className='groupform-title'>KPOP GROUP INFORMATION</h1>
        <Form form={form} onFinish={handleSubmit} scrollToFirstError>
          <div className="groupform-box-container">
            <div className="groupform-box1" id="groupform-box1">
              {/* Content for box 1 */}
              <label className='headline'>1.) Input the image of the group here</label>
              <div className="groupform-image-upload-container">
                <div>
                  {/* Group Image Upload Section */}
                  <div
                    className="groupform-image-upload-box"
                    onDrop={(event) => handleDrop(event, setGroupImage, 'groupImage')}
                    onDragOver={handleDragOver}
                    onClick={() => showModal('group')} // Open modal for idol image
                  >
                    {!groupImage ? (
                      <p>Drag & drop your idol image here or click to upload.</p>
                    ) : (
                      <img src={groupImage} alt="Group Preview" className="groupform-image-preview" />
                    )}
                  </div>

                  <Form.Item
                    id="groupImageInput"
                    label="Group Image URL"
                    name="groupImage"
                    rules={[{ required: true, message: 'Please input Group Image URL!' }]}
                    style={{ width: '100%', marginBottom: '0', marginTop: '10px' }}
                  >
                    <Input
                      style={{ marginBottom: '12px' }}
                      placeholder="Enter Group Image URL"
                      value={urlInput}
                      onChange={(e) => handleUrlChange(e.target.value, setGroupImage)}
                    />
                  </Form.Item>

                  {/* Lightstick Image Upload Section */}
                  <label className='headline'>3.) Input the image of the lightstick here</label>
                  <div className="groupform-image-upload-container">
                    <div
                      className="groupform-image-upload-box"
                      onDrop={(event) => handleDrop(event, setLightstickImage, 'lightstickImage')}
                      onDragOver={handleDragOver}
                      onClick={() => showModal('lightstick')} // Open modal for lightstick image
                    >
                      {!lightstickImage ? (
                        <p>Drag & drop your lightstick image here or click to upload.</p>
                      ) : (
                        <img src={lightstickImage} alt="Preview" className="groupform-image-preview" />
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

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Form.Item label="Upcoming Album" name="upcomingAlbum" rules={[{ required: true, message: 'Please input Upcoming Album!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                  <Input placeholder="Upcoming Album" required rules={[{ required: true, message: 'Please input Upcoming Album!' }]} style={{ flexGrow: 1 }} />
                </Form.Item>
              </div>
            </div>

            <div className='trylang'>
              <div className="groupform-box-container" id="groupform-box2">
                {/* Content for box 2 */}
                <div className='groupform-box-container1' id="groupform-box3">
                  <div style={{ marginBottom: '8px' }}>
                    <label className='headline'>2.) Group's Information</label>
                    {/* Group Name Text Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Group Name" name="groupName" rules={[{ required: true, message: 'Please input Group Name!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                        <Input placeholder="Group Name" style={{ width: '100%' }} required rules={[{ required: true, message: 'Please input Group Name!' }]} />
                      </Form.Item>
                    </div>

                    {/* Korean Group Name Text Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Korean Group Name" name="koreanGroupName" rules={[{ required: true, message: 'Please input Korean Group Name!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                        <Input placeholder="Korean Group Name" style={{ width: '100%' }} required rules={[{ required: true, message: 'Please input Korean Group Name!' }]} />
                      </Form.Item>
                    </div>

                    {/* Debut Name Text Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Debut" name="debut" rules={[{ required: true, message: 'Please input Debut!' }]} style={{ flexGrow: 1, marginBottom: "0" }}>
                        <DatePicker placeholder='Debut' required style={{ width: '100%' }} />
                      </Form.Item>
                    </div>

                    { }
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Debut to 1st win" name="debutToFirstWin" rules={[{ required: true, message: 'Please input Debut to 1st win!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                        <Input placeholder="Debut to 1st win" style={{ width: '100%' }} required rules={[{ required: true, message: 'Please input Debut to 1st win!' }]} />
                      </Form.Item>
                    </div>

                    {/* Fandom Text Field  */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Form.Item label="Fandom" name="fandom" rules={[{ required: true, message: 'Please input Fandom!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                        <Input placeholder="Fandom" style={{ width: '100%' }} required rules={[{ required: true, message: 'Please input Fandom!' }]} />
                      </Form.Item>
                    </div>

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

                <div className="groupform-box1" id="groupform-box4">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Active Years" name="activeYears" rules={[{ required: true, message: 'Please input Active Years!' }]} style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input type='number' placeholder="Active Years" required style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
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
                </div>
              </div>


              <div className='anotherbox anotherbox-container'>
                <div className='anotherbox-small'>
                  <label className='headline'>4.) Group Members</label>
                  <div className="groupform-image-upload-container" id='changeFlex'>
                    <label className='headline'>Add Member:</label>
                    <div
                      className="groupform-image-upload-box"
                      onDrop={(event) => handleDrop(event, setMemberImage, 'memberImage')}
                      onDragOver={handleDragOver}
                      onClick={() => showModal('member')}
                    >
                      {!memberImage ? (
                        <p>Drag & drop your member image here or click to upload.</p>
                      ) : (
                        <img src={memberImage} alt="Preview" className="groupform-image-preview" />
                      )}
                    </div>
                  </div>

                  <Form.Item
                    id="memberImageInput"
                    label="Member Image URL"
                    name="memberImage"
                    style={{ width: '100%', marginBottom: '0', marginTop: '10px' }}
                  >
                    <Input
                      style={{ marginBottom: '12px' }}
                      placeholder="Enter Member Image URL"
                      value={urlInput}
                      onChange={(e) => handleUrlChange(e.target.value, setMemberImage)}
                    />
                  </Form.Item>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Member Name" name="name" style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Add Member Name" style={{ flexGrow: 1 }} />
                    </Form.Item>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Form.Item label="Member Link" name="memberLink" style={{ flexGrow: 1, marginBottom: '0' }}>
                      <Input placeholder="Add Member Link" style={{ flexGrow: 1 }} />
                    </Form.Item>
                  </div>
                  <Button onClick={handleSaveMember} style={{ width: '150px', marginLeft: '8px', backgroundColor: '#45a049', color: 'white', float: 'right' }} >Save Member</Button>
                </div>


                <div className='anotherbox-small'>
                  <div>
                    <Title level={4}>Current Members</Title>
                    <Table dataSource={groupMembers} columns={columns} pagination={false} scroll={{ y: 240 }} />
                  </div>
                </div>
              </div>


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

          {/* Idol Introduction Container*/}
          <div className='addFLex'>
            <div className='anotherbox-small'>
              <label className='headline'>7.) Create Introduction here:</label>
              <Form.Item name="groupIntro" label="Introduction" rules={[{ required: true, message: 'Please provide an introduction' }]} >
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

export default GroupForm;

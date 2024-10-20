import React, { useState, useEffect } from 'react';
import '../styles/GroupForm.css';
import { Button, Select, Input, Space, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Option } = Select;

const GroupForm = () => {
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

  return (
    <div>
      <h1 className='groupform-title'>KPOP GROUP INFORMATION</h1>
      <div className="groupform-box-container">
        <div className="groupform-box" id="groupform-box1">
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
        </div>
        <div className="groupform-box" id="groupform-box2">
          <label>Group's Information</label>
          <div style={{ marginBottom: '16px' }}>
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

            <Input placeholder='Nationality'></Input>
            <Input placeholder='Full Name'></Input>
            <Input placeholder='Full Name'></Input>

          </div>

        </div>
        <div className="groupform-box" id="groupform-box3"></div>
      </div>
    </div>
  );
};

export default GroupForm;

import React, { useState } from 'react';
import '../styles/Login.css'; 
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Input, Button, message } from 'antd'; 
import logo1 from '../assets/Logo 1.png'; 
import logo2 from '../assets/Logo 2.png'; 

const Login = () => {
    const history = useNavigate(); 
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e) {
        e.preventDefault(); 

        try {
            await axios.post("http://localhost:8000/auth", {
                username, password
            })
            .then(res => {
                console.log("Response from server:", res.data); 
                if (res.data === "exist") {
                    history("/Main/Dashboard")
                    localStorage.setItem("isAuthenticated", true);
                } else if (res.data === "notexist") {
                    message.error('Username or Password is Incorrect!');
                } else if (res.data === "wrong password") {
                    message.error('Username or Password is Incorrect!');
                }
            })
            .catch((e) => {
                alert(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="login-container">
            <div className='login-divider'>
                <img src={logo1} className="login-image" alt="Logo 1" />
                <div className="divider" /> 
                <img src={logo2} className="login-image" alt="Logo 2" />
            </div>
            <h2 className='login-desc'>"Your go-to source for K-pop news, artist updates, and concert info! Join the K-pop community today!"</h2>
            <form className="login-form" onSubmit={submit}>
                <div className='login-greet'>
                    <h1 className='head'>Annyeong, Admin!</h1>
                    <h1>안녕하세요</h1>
                </div>
                <label htmlFor="username" className="login-label">Username</label>
                <Input 
                    type="text"
                    placeholder="Minimum of 8 characters (e.g. Cristine)"
                    className="login-input" 
                    onChange={(e) => { setUsername(e.target.value) }} 
                    required 
                />
                <label htmlFor="password" className="login-label">Password</label>
                <Input.Password 
                    placeholder="Password" 
                    className="login-input" 
                    onChange={(e) => { setPassword(e.target.value) }} 
                    required 
                />
                <Button type="primary" className="login-button" htmlType="submit">Login</Button>
            </form>
            <p>©Copyright. All Rights Reserved 2024</p>
        </div>
    );
}

export default Login;

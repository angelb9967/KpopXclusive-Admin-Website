import React from 'react';
import '../styles/Login.css'; 
import logo1 from '../assets/Logo 1.png'; 
import logo2 from '../assets/Logo 2.png'; 

const Login = () => {
  return (
    <div className="login-container">
         <div className='login-divider'>
            <img src={logo1} className="login-image" alt="Logo 1" />
            <div className="divider" /> 
            <img src={logo2} className="login-image" alt="Logo 2" />
        </div>
        <h2 className='login-desc'>"Your go-to source for K-pop news, artist updates, and concert info! Join the K-pop community today!"</h2>
        <form className="login-form">
            <div className='login-greet'>
                <h1>Anyeong, Admin!</h1>
                <h1>안녕하세요</h1>
            </div>
            <label htmlFor="username" className="login-label">Username</label>
            <input type="text" placeholder="Minimum of 8 characters (e.g. Cristine)" className="login-input" />
            <label htmlFor="password" className="login-label">Password</label>
            <input type="password" placeholder="Password" className="login-input" />
            <button type="submit" className="login-button">Login</button>
        </form>
        <p>©Copyright. All Rights Reserved 2024</p>
    </div>
  );
}

export default Login;

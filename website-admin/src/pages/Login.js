import React, { useState } from 'react';
import '../styles/Login.css'; 
import axios from "axios"
import {useNavigate, Link} from "react-router-dom"
import logo1 from '../assets/Logo 1.png'; 
import logo2 from '../assets/Logo 2.png'; 

const Login = () => {
    const history=useNavigate(); 

    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')
  
    async function submit(e){
      e.preventDefault(); 

      try{
        await axios.post("http://localhost:8000/", {
            username, password
        })
        .then(res=>{
          console.log("Response from server:", res.data); 
          if(res.data==="exist"){
            history("/Main/Dashboard")
          }
          else if(res.data==="notexist"){
            alert("User does not exist")
          } 
          else if(res.data==="wrong password"){
            alert("Username or password is incorrect!")
          }
        })
        .catch((e)=>{
          alert(e)
        })
      } catch(e) {
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
        <form className="login-form" action="POST">
            <div className='login-greet'>
                <h1>Anyeong, Admin!</h1>
                <h1>안녕하세요</h1>
            </div>
            <label htmlFor="username" className="login-label">Username</label>
            <input type="text" placeholder="Minimum of 8 characters (e.g. Cristine)" className="login-input" 
                onChange={(e)=>{setUsername(e.target.value)}} required minLength={8}/>
            <label htmlFor="password" className="login-label">Password</label>
            <input type="password" placeholder="Password" className="login-input" 
                onChange={(e)=>{setPassword(e.target.value)}} required minLength={8}/>
            <button type="submit" className="login-button"
                onClick={submit}>Login</button>
        </form>
        <p>©Copyright. All Rights Reserved 2024</p>
    </div>
  );
}

export default Login;

import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginComp = (props) => {
  const navigate = useNavigate();
  const handleOnSuccess = async(credentialResponse) => {
    console.log(credentialResponse);
    const token = credentialResponse.credential;
    const res = await axios.post("http://localhost:4000/api/auth/google",{token},{withCredentials:true});//withCredentials:true sets cookies on the browser during login
    console.log(res);
    props.changeLoginValue(true);
    localStorage.setItem('isLogin','true');
    localStorage.setItem('userInfo',JSON.stringify(res.data.user));
    navigate("/feeds");
    // console.log(import.meta.env.VITE_APP_GOOGLE_AUTH===credentialResponse.clientId);//true
  }
  return (
    <div>
      <GoogleLogin 
      onSuccess={(credentialResponse) => handleOnSuccess(credentialResponse)}
      onError={()=>console.log('Login failed')} />
    </div>
  )
}

export default GoogleLoginComp
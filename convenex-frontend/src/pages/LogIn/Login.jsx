import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleLoginComp from '../../components/GoogleLogin/GoogleLoginComp'
import { ToastContainer, toast } from 'react-toastify'
import axios from "axios"
import socket from '../../../socket'

const Login = (props) => {
  const navigate = useNavigate();
  const [loginField, setLoginField] = useState({ email: "", password: "" });
  const onInputChange = (event, key) => {
    setLoginField({ ...loginField, [key]: event.target.value });
  };
  const handleLogin = async ()=>{
    if (!loginField.email.trim() || !loginField.password.trim()) {
      return toast.error("Please fill all credentials.");
    }
    await axios.post("http://localhost:4000/api/auth/login", loginField, { withCredentials: true }).then((res) => {//withCredentials:true sets cookies on the browser during login
      // console.log(res);
      props.changeLoginValue(true);
      localStorage.setItem('isLogin','true');//we need to set some data in the browser's localStorage
      localStorage.setItem('userInfo',JSON.stringify(res.data.userExists));//When we clicked login, we received a response from backend (refer to Screenshot 2026-05-09 123144.png) or do console.log(res) to see
      // socket.emit("register",res.data.userExists._id);//when page reloads res.data.userExists might become undefined so not much useful better emit event from App.jsx
      navigate("/feeds");
    }).catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.error);
    });
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col shadow-xl my-4 p-10 md:w-[28%] w-85% gap-4'>
        <div className='font-semibold text-2xl'>Login</div>
        <GoogleLoginComp changeLoginValue={props.changeLoginValue} />
        <div className='flex gap-2 items-center'>
          <div className='w-[45%] border-b'></div>
          or
          <div className='w-[45%] border-b'></div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Email">Email</label>
          <input value={loginField.email} onChange={(e) => onInputChange(e, "email")} type="text" placeholder='Email' className='px-1 w-full border-2 rounded-lg' />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Password">Password</label>
          <input value={loginField.password} onChange={(e) => onInputChange(e, "password")} type="password" placeholder='Password' className='px-1 w-full border-2 rounded-lg' />
        </div>
        <div onClick={handleLogin} className='mt-2 w-full text-center py-2 bg-violet-700 rounded-lg text-white cursor-pointer'>Login</div>
      </div>
      <div className='my-3'>New to ConveneX ? <Link to={"/signup"} className='text-violet-800 hover:underline'>Join now</Link></div>
      <ToastContainer />
    </div>
  )
}

export default Login
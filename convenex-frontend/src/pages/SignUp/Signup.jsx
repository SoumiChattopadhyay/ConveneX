import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleLoginComp from '../../components/GoogleLogin/GoogleLoginComp'
import { ToastContainer,toast } from 'react-toastify'
import axios from 'axios'

const Signup = (props) => {
    const navigate = useNavigate();
    const [signupField, setSignupField] = useState({email:"",password:"",f_name:""});
    const onInputChange = (event,key)=>{
        setSignupField({...signupField,[key]:event.target.value});
    };
    const handleSubmit = async()=>{
        if(signupField.email.trim()===0 || signupField.password.trim()===0 || signupField.f_name.trim()===0){
            return toast.error("Please fill all credentials.");
        }
        await axios.post("http://localhost:4000/api/auth/register",signupField).then((res)=>{//{withCredentials:true} not needed here as we are not storing any cookie on browser at time of register, we are doing it only at time of login
            console.log(res);
            toast.success("You have registered successfully.");
            setSignupField({email:"",password:"",f_name:""});
            navigate("/login");
        }).catch((err)=>{
            toast.error(err?.response?.data?.error);
        });        
    };
    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <h2 className='my-5 text-2xl font-semibold'>Make the most of your Professional Life</h2>
            <div className='flex flex-col gap-5 w-[85%] md:w-[28%] p-10 box-border shadow-xl rounded-sm mb-5'>
                <div className="flex flex-col gap-1">
                    <label htmlFor='Email'>Email</label>
                    <input onChange={(e)=>onInputChange(e,"email")} type='text' placeholder='Email' className='w-full px-1 py-1 border-2 rounded-lg' />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor='Password'>Password</label>
                    <input onChange={(e)=>onInputChange(e,"password")} type='password' placeholder='Password' className='w-full px-1 py-1 border-2 rounded-lg' />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor='f-name'>Full Name</label>
                    <input onChange={(e)=>onInputChange(e,"f_name")} type='text' placeholder='Full Name' className='w-full px-1 py-1 border-2 rounded-lg' />
                </div>
                <div onClick={handleSubmit} className='w-full text-center py-2 cursor-pointer bg-violet-700 rounded-lg text-white'>Register</div>
                <div className='flex gap-2 items-center'>
                    <div className='w-[45%] border-b'></div>
                    or
                    <div className='w-[45%] border-b'></div>
                </div>
                <GoogleLoginComp changeLoginValue={props.changeLoginValue}/>
            </div>
            <div className='mb-4'>Already on ConveneX ? <Link to={"/login"} className='text-violet-800 hover:underline'>Sign in</Link></div>
            <ToastContainer/>
        </div>
    )
}

export default Signup
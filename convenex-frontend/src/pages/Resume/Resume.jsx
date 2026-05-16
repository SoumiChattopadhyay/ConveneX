import React, { useEffect, useState } from 'react'
import Advertisement from '../../components/Advertisement/Advertisement'
import axios from 'axios'

const Resume = () => {
  const [selfData, setSelfData] = useState(null);
  const fetchUser = async()=>{
    const selfData = await axios.get("http://localhost:4000/api/auth/self",{withCredentials:true});
    console.log(selfData);
    setSelfData(selfData.data.user);
  }
  useEffect(()=>{
    fetchUser();
  },[]);
  return (
    <div className='p-5 xl:px-50 flex gap-5 w-full bg-[#f5f2f7] h-full'>
        <div className='w-full sm:w-[75%]'>
            <img className='w-full h-full rounded-lg' src={selfData?.resume} alt="" />
        </div>
        <div className='w-[25%] hidden md:block sticky top-19'>
            <Advertisement/>
        </div>
    </div>
  )
}

export default Resume


// https://resumegenius.com/wp-content/uploads/google-resume-example.png?w=1200
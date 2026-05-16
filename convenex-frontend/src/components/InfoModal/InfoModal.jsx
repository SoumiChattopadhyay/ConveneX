import axios from 'axios';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const InfoModal = (props) => {
  const [formData, setFormData] = useState({
    f_name: props?.selfData?.f_name || '',
    headline: props?.selfData?.headline || '',
    curr_company: props?.selfData?.curr_company || '',
    curr_location: props?.selfData?.curr_location || ''
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value //dynamically updates whichever input changed,without the [], JavaScript thinks you literally mean the key name "e.target.name"
    });
  }
  const handleInfo = async () => {
    try {
      const data = {};
      if (formData.f_name.trim()) data.f_name = formData.f_name;
      if (formData.headline.trim()) data.headline = formData.headline;
      if (formData.curr_company.trim()) data.curr_company = formData.curr_company;
      if (formData.curr_location.trim()) data.curr_location = formData.curr_location;
      if (Object.keys(data).length === 0) return toast.error("Please enter a field.");
      props.handleEditFunct(data);
    }catch(err){
      toast.error(err?.response?.data?.error);
    }
  }
  return (
    <div className='p-5 w-full h-full'>
      <div className='text-md font-semibold'>Edit Info</div>
      <div className='mt-2 w-full h-full overflow-auto flex flex-col gap-3'>
        <div>
          <label className='text-sm' htmlFor='name'>Full Name*</label>
          <br />
          <input name='f_name' value={formData.f_name} onChange={handleChange} className='text-sm border rounded-md p-2 mt-1 w-full' type="text" id='name' placeholder='Enter your full name' />
        </div>
        <div>
          <label className='text-sm' htmlFor='headline'>Headline*</label>
          <br />
          <textarea name='headline' value={formData.headline} onChange={handleChange} cols={10} rows={3} className='text-sm border rounded-md p-2 mt-1 w-full'></textarea>
        </div>
        <div>
          <label className='text-sm' htmlFor='company'>Current Company*</label>
          <br />
          <input name='curr_company' value={formData.curr_company} onChange={handleChange} className='text-sm border rounded-md p-2 mt-1 w-full' type="text" id='company' placeholder='Enter Current Company' />
        </div>
        <div className='pb-5'>
          <label className='text-sm' htmlFor='loc'>Current Location*</label>
          <br />
          <input name='curr_location' value={formData.curr_location} onChange={handleChange} className='text-sm border rounded-md p-2 mt-1 w-full' type="text" id='loc' placeholder='Enter Current Location' />
        </div>
        <div onClick={handleInfo} className='px-3 py-1 mb-3 w-fit bg-violet-800 text-white rounded-3xl cursor-pointer'>Save</div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default InfoModal
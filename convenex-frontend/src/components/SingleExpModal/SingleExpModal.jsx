import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';

const SingleExpModal = ({ selfData, handleEditFunct, expId }) => {

    const singleExp = selfData?.experience?.find((item) => {
        return item._id === expId
    });

    const [formData, setFormData] = useState({
        company_name: singleExp?.company_name,
        designation: singleExp?.designation,
        duration: singleExp?.duration,
        location: singleExp?.location
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = () => {
        if (!formData.designation.trim() || !formData.duration.trim() || !formData.location.trim() || !formData.company_name.trim()) {
            return toast.error("Missing field.");
        }

        const updatedExperiences = selfData?.experience?.map((item) => {
            if (item._id === expId) {
                return {
                    ...item,//to preserve other hidden fields like _id
                    designation: formData.designation,
                    company_name: formData.company_name,
                    duration: formData.duration,
                    location: formData.location
                };
            }
            return item;
        });

        handleEditFunct({
            experience: updatedExperiences
        });
    }

    const handleOnDelete = () => {
        const newFilteredData = selfData?.experience.filter((item) => {
            return item._id !== expId
        });
        handleEditFunct({
            experience: newFilteredData
        });
    }

    return (
        <div className='p-5 w-full h-full'>
            <div className='text-md font-semibold'>Edit Experience</div>
            <div className='mt-2 w-full h-full overflow-auto flex flex-col gap-3'>
                <div>
                    <label className='text-sm' htmlFor='role'>Role*</label>
                    <br />
                    <input name="designation" value={formData.designation} onChange={handleChange} className='text-sm border rounded-md p-2 mt-1 w-full' type="text" id='role' placeholder='Enter Role' />
                </div>
                <div>
                    <label className='text-sm' htmlFor='company'>Company*</label>
                    <br />
                    <input name="company_name" value={formData.company_name} onChange={handleChange} className='text-sm border rounded-md p-2 mt-1 w-full' type="text" id='company' placeholder='Enter company name' />
                </div>
                <div>
                    <label className='text-sm' htmlFor='duration'>Duration*</label>
                    <br />
                    <input name="duration" value={formData.duration} onChange={handleChange} className='text-sm border rounded-md p-2 mt-1 w-full' type="text" id='duration' placeholder='Duration' />
                </div>
                <div>
                    <label className='text-sm' htmlFor='place'>Place*</label>
                    <br />
                    <input name="location" value={formData.location} onChange={handleChange} className='text-sm border rounded-md p-2 mt-1 w-full' type="text" id='place' placeholder='Enter company location' />
                </div>
                <div className='flex justify-between'>
                    <div onClick={handleSubmit} className='px-3 py-1 mb-3 w-fit bg-violet-800 text-white rounded-3xl cursor-pointer'>Save</div>
                    <div onClick={handleOnDelete} className='px-3 py-1 mb-3 w-fit bg-violet-800 text-white rounded-3xl cursor-pointer'>Delete</div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default SingleExpModal
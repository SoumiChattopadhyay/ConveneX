import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress'; //https://mui.com/material-ui/react-progress/#circular
import Box from '@mui/material/Box';

const AboutModal = ({ handleEditFunct, selfData }) => {

    const [formData, setFormData] = useState({
        about: selfData?.about || '',
        skills: selfData?.skills?.join(', ') || '',//converts array to textarea-friendly string.
        resume: selfData?.resume
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleResumeUpload = async (e) => {
        const files = e.target.files;
        const data = new FormData();//special JS object to send files to backend APIs
        data.append('file', files[0]);
        data.append('upload_preset', import.meta.env.VITE_PRESET_NAME);
        setLoading(true);
        try {
            const res = await axios.post(`http://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/raw/upload`, data);
            console.log(res);
            setFormData({
                ...formData,
                resume: res.data.url
            });
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        const data = {};
        if (formData.about.trim())
            data.about = formData.about;
        if (formData.skills.trim())
            data.skills = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        if (formData.resume)
            data.resume = formData.resume;
        handleEditFunct(data);
    }

    return (
        <div className='w-full p-3'>
            <div className='h-full flex flex-col gap-1'>
                <div className='w-full font-semibold'>Edit About</div>
                <div>
                    <label className='text-xs' htmlFor="about">About*</label>
                    <textarea name='about' value={formData.about} onChange={handleChange} id='about' className='text-xs w-full border rounded-md p-3' placeholder='Enter message' rows={2} cols={10}></textarea>
                </div>
                <div>
                    <label className='text-xs' htmlFor="about">Skills*(Add by separating commas)</label>
                    <textarea name='skills' value={formData.skills} onChange={handleChange} id='skills' className='text-xs w-full border rounded-md p-3' placeholder='Enter message' rows={2} cols={10}></textarea>
                </div>
                {
                    formData.resume && <div className='p-3'>
                        <a href={formData.resume} target='_blank' className='text-violet-700 text-sm underline'>View Resume</a>
                    </div>
                }
                <div className='mb-7'>
                    <label className='cursor-pointer text-xs rounded-md w-fit px-2 py-1 bg-blue-800 text-white ' htmlFor="inputFile">Resume Upload</label>
                    <input onChange={handleResumeUpload} type="file" className='hidden' id='inputFile' />
                </div>
                {
                    loading ? <Box sx={{ display: 'flex' }}>
                        <CircularProgress aria-label="Loading…" />
                    </Box> : <div onClick={handleSubmit} className='cursor-pointer text-xs rounded-2xl w-fit px-2 py-1 mb-3 bg-blue-800 text-white '>Save</div>
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default AboutModal
import axios from 'axios';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress'; //https://mui.com/material-ui/react-progress/#circular
import Box from '@mui/material/Box';

const ImageUploadModal = ({ isCircular, selfData, handleEditFunct }) => {

    const [imgUrl, setImgUrl] = useState(isCircular ? selfData?.profilePic : selfData?.coverPic);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!imgUrl) return toast.error("Upload an image to proceed.");
        const obj = {...selfData,
            [isCircular?"profilePic":"coverPic"]: imgUrl
        };        
        handleEditFunct(obj);
    }

    const handleImgUpload = async (e) => {
        const files = e.target.files;
        const data = new FormData();//special JS object to send files to backend APIs
        data.append('file', files[0]);
        data.append('upload_preset', import.meta.env.VITE_PRESET_NAME);
        setLoading(true);
        try {
            const res = await axios.post(`http://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data);
            console.log(res);
            setImgUrl(res.data.url);
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='px-5 pt-5 relative flex flex-col items-center w-full h-full'>
            <div className='font-semibold mb-3'>Upload Image</div>
            {
                isCircular ? (<img className='w-20 h-20 rounded-full' src={imgUrl} />)
                    : (<img className='w-full h-40 object-cover rounded-xl' src={imgUrl} />)
            }
            <div className='absolute bottom-0 left-2 rounded-xl bg-violet-800 text-white px-3 py-2'>
                <label className='cursor-pointer' htmlFor="inputPhoto">Upload</label>
                <input onChange={handleImgUpload} type="file" className='hidden' id='inputPhoto' />
            </div>
            {
                loading ? <Box sx={{ display: 'flex' }}>
                    <CircularProgress aria-label="Loading…" />
                </Box> : <div onClick={handleSubmit} className='cursor-pointer absolute bottom-0 right-2 rounded-xl bg-violet-800 text-white px-3 py-2'>
                    Submit
                </div>
            }
            <ToastContainer />
        </div>
    )
}

export default ImageUploadModal

// 'https://i.pinimg.com/564x/a9/75/93/a975934bb378afc4ca8c133df451f56e.jpg'
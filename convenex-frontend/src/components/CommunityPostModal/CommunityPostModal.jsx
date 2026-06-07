import React, { useEffect, useState } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress'; //https://mui.com/material-ui/react-progress/#circular
import Box from '@mui/material/Box';

const CommunityPostModal = (props) => {
    const [imgUrl, setImgUrl] = useState(null);
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePost = async (event) => {
        try {
            if (desc.trim().length === 0 && !imgUrl) {
                return toast.error("Please enter any field.");
            }
            await axios.post(`http://localhost:4000/api/post/addCommunityPost/${props?.community?._id}`, { desc: desc, imageLink: imgUrl }, { withCredentials: true }).then(res => {
                window.location.reload();
            }).catch(err => {
                console.log(err);
            });
        } catch (err) {
            toast.error(err?.response?.data?.error);
        }
    };

    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const presetName = import.meta.env.VITE_PRESET_NAME;

    const handleImgUpload = async (e) => {
        const files = e.target.files;
        const data = new FormData();//creates a special JS object to send files to backend APIs
        data.append('file', files[0]);//key name 'file' should be same as cloudinary expects this key name
        data.append('upload_preset', presetName);
        setLoading(true);
        try {
            const response = await axios.post(`http://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);
            console.log(response);
            const imageUrl = response.data.url;
            setImgUrl(imageUrl);
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    // console.log(props);
    
    return (
        <div>
            {/* Post's Community Details */}
            <div className='flex items-center gap-2 py-3 px-3'>
                <div>
                    <img className='w-11 h-11 rounded-4xl' src={props.community?.logo} alt="profile-icon" />
                </div>
                <div className='font-semibold text-md'>{props.community?.name}</div>
            </div>

            {/* Write Content you wanna post */}
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} cols={50} placeholder='What do you wanna talk about?' className='text-sm px-10 outline-hidden' />

            {/* Post image you selected*/}
                <div className='p-3 h-16 w-114'>
                    {
                        imgUrl && <img className='w-10 h-10 rounded-lg' src={imgUrl} alt="post-img" />
                    }
                </div>

            {/* Upload Photo Icon and Send Post button */}
            <div className="flex justify-between items-center px-3">
                <div>
                    <label htmlFor="inputFile" className='cursor-pointer'><InsertPhotoIcon /></label>
                    <input onChange={handleImgUpload} type="file" className='hidden' id='inputFile' />
                </div>
                {
                    loading ? <Box sx={{ display: 'flex' }}>
                        <CircularProgress aria-label="Loading…" />
                    </Box> : <div onClick={handlePost} className='bg-violet-800 cursor-pointer text-white text-sm rounded-4xl py-1 px-4'>Post</div>
                }
            </div>
            <ToastContainer />
        </div>
    );
}

export default CommunityPostModal;
import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import {toast} from 'react-toastify'
import axios from 'axios'

const MessageModal = ({userData,ownData}) => {
    const [msg,setMsg]=useState("");
    const handleSendMsg = async()=>{
        await axios.post("http://localhost:4000/api/conversation/add-conversation",{receiverId:userData?._id,message:msg},{withCredentials:true}).then((res)=>{
            window.location.reload();
        }).catch((err)=>{
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }
    return (
        <div className='relative w-full h-73 flex flex-col gap-3 p-5'>
            <div className='w-full'>Send Message</div>
            <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} className='w-full border rounded-md p-3' placeholder='Enter message' rows={8} cols={10}></textarea>
            <div onClick={handleSendMsg} className='rounded-2xl w-fit px-3 py-1 mb-3 bg-violet-800 text-white cursor-pointer'>Send</div>
        </div>
    );
}

export default MessageModal
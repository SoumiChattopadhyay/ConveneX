import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

const Conversation = ({item,ownData,selectedConvoId,handleSelectedConvo}) => {
    // console.log(item);
    const [memberData,setMemberData] = useState(null);
    useEffect(()=>{
        let member = item?.members?.find((it)=>it._id!==ownData._id);
        setMemberData(member);
    },[]);
    return (
        <div onClick={()=>handleSelectedConvo(item?._id,memberData)} className={`${item?._id === selectedConvoId ? 'bg-violet-100' : ''}  p-5 flex gap-2 items-center border-b-2 hover:bg-violet-100 border-gray-300 cursor-pointer`}>
            <div>
                <img className='h-11 w-11 rounded-full' src={memberData?.profilePic} alt="" />
            </div>
            <div className='shrink-0'>
                <div className='font-semibold text-md'>{memberData?.f_name}</div>
                <div className='text-gray-400 text-xs'>{memberData?.headline}</div>
            </div>
        </div>
    );
};

export default Conversation;
import React, { useEffect, useState } from 'react'
import { useLocation, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';

const Navbar3 = () => {
    const location = useLocation();
    const {communityId} = useParams();
    const [community, setCommunity] = useState({});
    const fetchCommunity = async () => {
        await axios.get(`http://localhost:4000/api/community/getCommunity/${communityId}`, { withCredentials: true }).then((res) => {
            console.log(res);
            setCommunity(res?.data?.community);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }
    useEffect(() => {
        if(communityId)
            fetchCommunity();
    }, [communityId]);
    return (
        <div className='top-40 bg-white flex gap-40 items-center w-full h-13 px-10 my-2'>
            <div className='md:flex items-center hidden gap-4 mt-2'>
                <div className='text-sm text-gray-500 mr-30'>{community?.name}</div>
                <Link to={`/community/${communityId}`} className="cursor-pointer px-4 py-2 hover:bg-gray-200 hover:rounded-md">
                    <div className={`text-sm border-b-4  ${location.pathname === `/community/${communityId}` ? "border-violet-800" : "border-transparent text-gray-500"}`}>Home</div>
                </Link>
                <Link to={`/community/${communityId}/events`} className='cursor-pointer px-4 py-2 hover:bg-gray-200 hover:rounded-md'>
                    <div className={`text-sm border-b-4 ${location.pathname===`/community/${communityId}/events`?"border-violet-800":"border-transparent text-gray-500"} `}>Events</div>
                </Link>
                <Link to={`/community/${communityId}/members`} className="cursor-pointer px-4 py-2 hover:bg-gray-200 hover:rounded-md">
                    <div className={`text-sm border-b-4 ${location.pathname === `/community/${communityId}/members` ? "border-violet-800" : "border-transparent text-gray-500"}`}>Members</div>
                </Link>
                <Link to={`/community/${communityId}/posts`} className="cursor-pointer px-4 py-2 hover:bg-gray-200 hover:rounded-md">
                    <div className={`text-sm border-b-4 ${location.pathname === `/community/${communityId}/posts` ? "border-violet-800" : "border-transparent text-gray-500"}`}>Posts</div>
                </Link>
                <Link to={`/community/${communityId}/communityChat`} className="cursor-pointer px-4 py-2 hover:bg-gray-200 hover:rounded-md">
                    <div className={`text-sm border-b-4 ${location.pathname === `/community/${communityId}/communityChat` ? "border-violet-800" : "border-transparent text-gray-500"}`}>Community Chat</div>
                </Link>
                <Link to={`/community/${communityId}/faq`} className="cursor-pointer px-4 py-2 hover:bg-gray-200 hover:rounded-md">
                    <div className={`text-sm border-b-4 ${location.pathname === `/community/${communityId}/faq` ? "border-violet-800" : "border-transparent text-gray-500"}`}>FAQ</div>
                </Link>
            </div>
        </div>
    )
}

export default Navbar3
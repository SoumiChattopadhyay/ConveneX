import React from 'react'
import Navbar3 from '../../components/NavbarV3/Navbar3'
import Conversation from '../../components/Conversation/Conversation'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import Advertisement from '../../components/Advertisement/Advertisement'
import Card from '../../components/Card/Card'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress'; //https://mui.com/material-ui/react-progress/#circular
import Box from '@mui/material/Box';
import CommunityCard from '../../components/CommunityCard/CommunityCard.jsx';
import socket from '../../../socket';

const CommunityChat = () => {
    const { communityId } = useParams();
    const [userData, setUserData] = useState(null);
    const [community, setCommunity] = useState({});
    const [conv, setConv] = useState(null);
    const [msgInp, setMsgInp] = useState("");
    const [msgs, setMsgs] = useState([]);
    const [imgInp, setImgInp] = useState(null);
    const [loading, setLoading] = useState(false);

    const ref = useRef();
    useEffect(()=>{
        ref?.current?.scrollIntoView({behavior:"smooth"});
    },[msgs]);

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
        setUserData(JSON.parse(localStorage.getItem('userInfo')));
        fetchCommunity();
    }, []);

    const fetchConversationOnLoad = async () => {
        await axios.get(`http://localhost:4000/api/conversation/communityConvo/${communityId}`, { withCredentials: true }).then((res) => {
            console.log(res);
            setConv(res?.data?.conversation);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }

    useEffect(() => {
        fetchConversationOnLoad()
    }, [communityId]);

    const showAllMessages = async () => {
        await axios.get(`http://localhost:4000/api/message/${conv?._id}`, { withCredentials: true }).then((res) => {
            console.log(res);
            setMsgs(res?.data?.messages);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }
    useEffect(() => {
        if (conv?._id) {
            showAllMessages();//coz this may run even when conversation isnt loaded so only when conversation is loaded run this
            socket.emit("joinCommunityConversation", conv?._id);//whenever conversation loads join the room from frontend
        }
    }, [conv]);

    const handleSendMessage = async () => {
        await axios.post(`http://localhost:4000/api/message`, { conversation: conv?._id, message: msgInp, picture: imgInp }, { withCredentials: true }).then((res) => {
            console.log(res);
            window.location.reload();
            socket.emit('sendMessage', conv?._id, res?.data);
            setMsgInp("");
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }
    useEffect(() => {
        socket.on('receiveMessage', (response) => {
            console.log(response);
            setMsgs([...msgs, response]);
        });
    }, [msgs]);
    const handleImgUpload = async (e) => {
        let files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', import.meta.env.VITE_PRESET_NAME);
        setLoading(true);
        try {
            const res = await axios.post(`http://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data);
            setImgInp(res.data.url);
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    }

    const isMember = community?.members?.some((member) => (member?._id.toString() === userData?._id.toString()));
    return (
        <>
            <Navbar3 />
            {!isMember && <div className='absolute top-70 left-100 z-50'>
                <div className='text-2xl font-semibold'>
                    Join the Community to view its chats
                </div>
            </div>}
            <div className={`${!isMember ? "blur-3xl" : ""} px-5 py-5 xl:px-50 flex justify-end gap-5 w-full bg-[#f5f2f7] h-full`}>
                <div className='w-full sm:w-full rounded-lg'>
                    <Card padding={0}>

                        {/* top side */}
                        <div className='text-md font-bold py-2 px-5 border-b-2 border-gray-300'>Group Chat</div>

                        {/* chat section */}
                        <div className='w-full md:flex'>

                            {/* left side */}
                            <div className='h-150 w-full md:w-[40%] md:shrink-0 overflow-auto border-r-2 border-gray-300 overflow-y-auto'> {/* need to give height for scrollbar to work */}
                                <div className={`p-5 border-b-2 font-semibold text-center border-gray-300 cursor-pointer`}>Members</div>
                                {/* all members of this community */}
                                {
                                    community?.members?.map((item, index) => {
                                        return <div key={index} className={`p-5 flex gap-2 items-center border-b-2 hover:bg-violet-100 border-gray-300 cursor-pointer`}>
                                            <div>
                                                <img className='h-11 w-11 rounded-full' src={item?.profilePic} alt="" />
                                            </div>
                                            <div className='shrink-0'>
                                                <div className='font-semibold text-md'>{item?.f_name}</div>
                                                <div className='text-gray-400 text-xs'>{item?.headline}</div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>

                            {/* right side */}
                            <div className='w-full md:w-[60%]'>
                                <div className={`p-5 flex justify-between items-center border-b-2 border-gray-300 cursor-pointer`}>
                                    <div className='flex gap-6 items-center'>
                                        <div>
                                            <img className='h-11 w-11 rounded-full' src={community?.logo} alt="logo" />
                                        </div>
                                        <div className='shrink-0'>
                                            <div className='font-semibold text-md'>{community?.name}</div>
                                            <div className='text-xs text-gray-400'>{community?.tagline?.slice(0, 100)}...</div>
                                        </div>
                                    </div>
                                    <div><MoreHorizIcon /></div>
                                </div>

                                {/* scrollable div portion */}
                                <div className='h-90 w-full overflow-auto'>
                                    <div className='w-full border-b-2 border-gray-300 p-4 mb-2'>
                                        <img className='w-20 h-20 rounded-full' src={community?.logo} alt="logo" />
                                        <div className='my-2'>
                                            <div className='text-md'>{community?.name}</div>
                                            <div className='text-sm text-gray-500'>{community?.tagline}</div>
                                        </div>
                                    </div>
                                    {/* for each message */}
                                    {
                                        msgs?.map((item, index) => {
                                            const isOwnMessage = item?.sender?._id === userData?._id;
                                            return <div ref={ref} key={index} className={`w-full gap-3 cursor-pointer`}>
                                                <div className={`flex p-2 mb-4 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                                    <div className="shrink-0">
                                                        {!isOwnMessage && <img className='mr-2 w-8 h-8 rounded-4xl' src={item?.sender?.profilePic} alt="" />}
                                                    </div>
                                                    {
                                                        !item?.picture && item?.message && <div className={`${isOwnMessage ? "bg-violet-100" : "bg-[#f5f2f7]"} rounded-md flex gap-3`}>
                                                            <div>
                                                                <div className={`${isOwnMessage ? "mx-1 mt-1" : ""}text-sm font-semibold m-2`}>{item?.sender?._id === userData?._id ? "" : item?.sender?.f_name}</div>
                                                                <div className={`text-sm px-2 pb-2`}>{item?.message}</div>
                                                            </div>

                                                            {/* time */}
                                                            <span className="text-[11px] p-1 mt-auto text-gray-500 text-right">
                                                                {
                                                                    new Date(item?.createdAt)
                                                                        .toLocaleTimeString([], {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit"
                                                                        })
                                                                }

                                                            </span>
                                                        </div>
                                                    }
                                                    {
                                                        item?.picture && <div className={`${isOwnMessage ? "bg-violet-100" : "bg-[#f5f2f7]"} rounded-md flex flex-col`}>
                                                            <div>
                                                                <div className={`${isOwnMessage ? "mx-1 mt-1" : ""}text-sm font-semibold m-2`}>{item?.sender?._id === userData?._id ? "" : item?.sender?.f_name}</div>
                                                            </div>
                                                            <div>
                                                                <div className='p-1'><img className='w-60 h-45 rounded-md' src={item?.picture} alt="msg-pic" /></div>
                                                            </div>
                                                            {item?.message && <div>
                                                                <div className={`text-sm px-2`}>{item?.message}</div>
                                                            </div>}
                                                            {/* time */}
                                                            <span className="text-[11px] pb-1 pr-1 mt-auto text-gray-500 text-right">
                                                                {
                                                                    new Date(item?.createdAt)
                                                                        .toLocaleTimeString([], {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit"
                                                                        })
                                                                }

                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>

                                {/* Space for typing messages*/}
                                <div className='p-2 w-full border-b-2 border-gray-200'>
                                    <textarea value={msgInp} onChange={(e) => { setMsgInp(e.target.value) }} rows={4} className='bg-gray-200 rounded-xl outline-0 w-full p-3 text-sm' placeholder='Write a message' />
                                </div>
                                <div className="flex p-3 justify-between">
                                    <div>
                                        <label htmlFor="messageImage" className='cursor-pointer'><InsertPhotoIcon /></label>
                                        <input onChange={handleImgUpload} type="file" id="messageImage" className='hidden' />
                                    </div>
                                    {
                                        loading ? <Box sx={{ display: 'flex' }}>
                                            <CircularProgress aria-label="Loading…" />
                                        </Box> : <div onClick={handleSendMessage} className='bg-violet-800 text-white px-4 py-1 cursor-pointer rounded-2xl'>
                                            Send
                                        </div>
                                    }
                                </div>

                            </div>
                        </div>
                    </Card>
                </div>

                {/* Advertisement Card */}
                {/* <div className='w-[25%] h-85 hidden md:block sticky top-19'>
                    <CommunityCard item={community}/>
                </div> */}
                <ToastContainer />
            </div>
        </>
    )
}

export default CommunityChat
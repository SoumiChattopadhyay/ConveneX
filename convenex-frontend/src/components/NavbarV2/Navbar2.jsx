import React, { useEffect, useState } from 'react'
import './Navbar2.css'
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import socket from '../../../socket';

const Navbar2 = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        let userData = localStorage.getItem("userInfo");
        if (userData && userData != "undefined") {
            setUserData(JSON.parse(userData));
        } else {
            setUserData(null);
        }
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [searchUsers, setSearchUsers] = useState([]);

    useEffect(() => {
        const handler = setTimeout(() => {//handler is id not function
            setDebouncedTerm(searchTerm);
        }, 1000);
        return () => {
            clearTimeout(handler);
        }
    }, [searchTerm]);//everytime searchTerm changes useEffect runs its content - synchronous clearTimeout runs first and clears previous timer, then setTimeOut starts waiting for another 1 sec, then if user types again useEffect reruns clearTimeOut cleans the prev timer and again setTimeOut waits for 1s, but now if user doesnt type anything setTimeOut actually executes the callback and sets the final value as debouncedText's value

    useEffect(() => {
        if (debouncedTerm) {
            searchAPICall();
        }
    }, [debouncedTerm]);

    const searchAPICall = async () => {
        await axios.get(`http://localhost:4000/api/auth/findUser?query=${debouncedTerm}`, { withCredentials: true }).then((res) => {
            // console.log(res);
            setSearchUsers(res.data.user);
        }).catch((err) => {
            console.log(err);
            alert(err?.response?.data?.error);
        });
    }

    const location = useLocation();
    // console.log(location);//check in browser console

    const [activeNotifsCount, setActiveNotifsCount] = useState([]);
    const fetchActiveNotifsCount = async () => {
        await axios.get("http://localhost:4000/api/notification/activeNotifications", { withCredentials: true }).then((res) => {
            console.log(res);
            setActiveNotifsCount(res?.data?.count);
        }).catch((err) => {
            console.log(err);
            alert(err?.response?.data?.error);
        });
    }
    useEffect(() => {
        fetchActiveNotifsCount();
    }, []);

    useEffect(() => {
        const handler = () => {
            setActiveNotifsCount(prev => prev + 1);
        };
        socket.on("receiveCommentNotification", handler);//socket listener
        socket.on("receiveFriendReqNotification", handler);//socket listener
        socket.on("receiveAcceptReqNotification", handler);//socket listener
        return () => {
            socket.off("receiveCommentNotification", handler);//Otherwise multiple listeners can accumulate if Navbar remounts.
            socket.off("receiveFriendReqNotification", handler);//Otherwise multiple listeners can accumulate if Navbar remounts.
            socket.off("receiveAcceptReqNotification", handler);//Otherwise multiple listeners can accumulate if Navbar remounts.
        };
    }, []);

    const handleProfileViewers = async () => {
        try {
            setSearchTerm('');
            await axios.post(`http://localhost:4000/api/auth/user/profile-view/${item?.user?.id}`, {}, { withCredentials: true });
        } catch (err) {
            toast.error(err.message);
        }
    }
    return (
        <div className='flex items-center justify-between w-full h-13 px-10 my-2'>
            <div className='flex gap-4 items-center'>
                <Link to={"/feeds"}>
                    <img className='w-9 h-9 mr-5' src="/img/logo.png" alt="logo" />
                </Link>
                <div className='relative '>
                    <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} type="text" placeholder="Search" className='searchInp w-60 bg-gray-100 rounded-sm p-1 cursor-pointer' />
                    {/* Dropdown */}
                    {//Dont show dropdown if search input is empty(searchTerm.length===0) or no users found(searchUsers.length<0)  
                        searchUsers.length > 0 && searchTerm.length !== 0 && <div className="absolute">
                            {
                                searchUsers.map((item, index) => {
                                    return <Link onClick={handleProfileViewers} to={`/profile/${item?._id}`} key={index} className='border-b-2 border-gray-300 bg-gray-200 w-75 h-9 flex gap-2 items-center rounded-sm cursor-pointer'>
                                        <div className=' p-1 rounded-sm'><img className='w-7 h-7  rounded-full' src={item?.profilePic} alt="user-logo" /></div>
                                        <div className='px-1 text-gray-600'>{item?.f_name}</div>
                                    </Link>
                                })
                            }
                        </div>
                    }
                </div>
            </div>
            <div className='md:flex hidden gap-7'>
                <Link to={"/feeds"} className="flex flex-col items-center cursor-pointer">
                    <HomeFilledIcon sx={{ color: location.pathname === '/feeds' ? "#5f20a8" : "gray" }} />
                    <div className={`text-sm border-b-4 ${location.pathname === "/feeds" ? "border-violet-800" : "border-transparent text-gray-500"}`}>Home</div>
                </Link>
                <Link to={"/allCommunities"} className='flex flex-col items-center cursor-pointer'>
                    <BusinessIcon sx={{ color: location.pathname === "/allCommunities" ? "#5f20a8" : "gray" }} />
                    <div className={`text-sm border-b-4 ${location.pathname === "/allCommunities" ? "border-violet-800" : "border-transparent text-gray-500"} `}>All Communities</div>
                </Link>
                <Link to={"/myNetwork"} className="flex flex-col items-center cursor-pointer">
                    <PeopleIcon sx={{ color: location.pathname === '/myNetwork' ? "#5f20a8" : "gray" }} />
                    <div className={`text-sm border-b-4 ${location.pathname === "/myNetwork" ? "border-violet-800" : "border-transparent text-gray-500"}`}>My Network</div>
                </Link>
                <Link to={"/resume"} className="flex flex-col items-center cursor-pointer">
                    <WorkIcon sx={{ color: location.pathname === '/resume' ? "#5f20a8" : "gray" }} />
                    <div className={`text-sm border-b-4 ${location.pathname === "/resume" ? "border-violet-800" : "border-transparent text-gray-500"}`}>Resume</div>
                </Link>
                <Link to={"/messages"} className="flex flex-col items-center cursor-pointer">
                    <MessageIcon sx={{ color: location.pathname === '/messages' ? "#5f20a8" : "gray" }} />
                    <div className={`text-sm border-b-4 ${location.pathname === "/messages" ? "border-violet-800" : "border-transparent text-gray-500"}`}>Message</div>
                </Link>
                <Link to={"/notifications"} className="flex flex-col items-center cursor-pointer">
                    <div className='relative flex items-center'><NotificationsIcon sx={{ color: location.pathname === '/notifications' ? "#5f20a8" : "gray" }} /> {activeNotifsCount > 0 ? <span className='absolute -top-1 -right-2.5 text-[10px] font-semibold text-center w-4 h-4 text-sm rounded-full bg-red-700 text-white'>{activeNotifsCount}</span> : null}</div>
                    <div className={`text-sm border-b-4 ${location.pathname === "/notifications" ? "border-violet-800" : "border-transparent text-gray-500"}`}>Notification</div>
                </Link>
                <Link to={`/profile/${userData?._id}`} className="flex flex-col items-center cursor-pointer">
                    <img className='w-6 h-6 rounded-full' src={userData?.profilePic} alt="profile-icon" />
                    <div className={`border-b-4 text-sm ${location.pathname === `/profile/${userData?._id}` ? "border-violet-800" : "border-transparent text-gray-500"}`}>Me</div>
                </Link>
            </div>
        </div>
    )
}

export default Navbar2
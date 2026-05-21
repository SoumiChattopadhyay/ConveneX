import React from 'react'
import { Link, useParams } from 'react-router-dom';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import Navbar3 from '../../components/NavbarV3/Navbar3.jsx'
import EventCard from '../../components/EventCard/EventCard.jsx';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const SingleCommunity = () => {
    const { communityId } = useParams();
    const [community, setCommunity] = useState({});
    const [events, setEvents] = useState([]);
    const [upComingEvents, setUpComingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [activeTab, setActiveTab] = useState("upcoming");

    const fetchCommunity = async () => {
        await axios.get(`http://localhost:4000/api/community/getCommunity/${communityId}`, { withCredentials: true }).then((res) => {
            console.log(res);
            setCommunity(res?.data?.community);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }
    const fetchEventsOnLoad = async () => {
        await axios.get(`http://localhost:4000/api/community/${communityId}/getAllEvents`).then((res) => {
            setEvents(res?.data?.events);
            setUpComingEvents(res?.data?.events.filter(event=>event.type==="upcoming"));//use response data directly because setEvents() is asynchronous. So immediately after: setEvents(...) the events state is STILL old empty array.React updates state later. 
            setPastEvents(res?.data?.events.filter(event=>event.type==="past"));
        }).catch((err) => {
            console.log(err);
            return toast.error(err?.response?.data?.error);
        });
    }
    useEffect(() => {
        if (communityId) {
            fetchCommunity();
            fetchEventsOnLoad();
        }

    }, [communityId]);

    return (
        <>
            <Navbar3 />
            <div className='bg-[#f5f2f7] w-full relative'>
                <img className='w-full h-50' src={community?.bannerImage} alt="banner-img" />
                <div className=' absolute top-30 left-20 bg-white h-35 w-35 rounded-xl flex justify-center'>
                    <img className='h-full w-full rounded-xl' src={community?.logo} alt="logo" />
                </div>
                <div className='pt-20 mx-20'>
                    <div className='text-4xl mb-5 font-semibold text-purple-900'>{community?.name}</div>
                    <div className='mb-5'>
                        <div className='text-md mb-2 font-semibold text-gray-700'>About</div>
                        <div className='text-xs font-medium text-gray-500'>{community?.description}</div>
                    </div>
                    <div className='mb-5'>
                        <div className='text-md mb-2 font-semibold text-gray-700'>Tags</div>
                        <div className='flex gap-4'>
                            {
                                community?.tags?.map((item, index) => {
                                    return <div key={index} className='w-fit p-2 rounded-sm bg-gray-400 text-xs text-white font-medium hover:bg-gray-500 cursor-pointer'>{item}</div>
                                })
                            }
                        </div>
                    </div>

                    <div className='mb-5'>
                        <div className='text-md mb-3 font-semibold text-gray-700'>Contact</div>
                        <div className='flex gap-2'>
                            <EmailIcon fontSize="small" sx={{ color: 'gray', cursor: "pointer", "&:hover": { color: "black" } }} />
                            <div className='text-sm font-medium text-cyan-500 cursor-pointer hover:underline'>{community?.email}</div>
                        </div>
                    </div>

                    <div className='mb-5'>
                        <div className='text-md mb-1 font-semibold text-gray-700'>Social Links</div>
                        <div className='flex mb-3 gap-4'>
                            {
                                community?.socialLinks?.twitter !== "" ? <Link to={community?.socialLinks?.twitter}><XIcon fontSize="small" sx={{ color: 'gray', cursor: "pointer", "&:hover": { color: "black" } }} /></Link> : null
                            }
                            {
                                community?.socialLinks?.facebook !== "" ? <Link to={community?.socialLinks?.facebook}><FacebookIcon fontSize="small" sx={{ color: 'gray', cursor: "pointer", "&:hover": { color: "#1877F2" } }} /></Link> : null
                            }
                            {
                                community?.socialLinks?.instagram !== "" ? <Link to={community?.socialLinks?.instagram}><InstagramIcon fontSize="small" sx={{ color: 'gray', cursor: "pointer", "&:hover": { color: "purple" } }} /></Link> : null
                            }
                        </div>
                    </div>

                    {/* Create Event */}
                    <div className='flex justify-center mb-10'>
                        <Link to={`/community/${communityId}/createEvent`} className='w-[30%] text-white text-center cursor-pointer hover:bg-cyan-600 font-medium bg-cyan-500 px-5 py-3 rounded-md'>Create an Event</Link>
                    </div>

                    {/* Our Events Section */}
                    <div className='text-3xl text-center mb-5 font-semibold '>Our Events</div>
                    <div className='flex justify-center'>
                        <ul className='flex'>
                            <li onClick={()=>setActiveTab("upcoming")} className={`${activeTab==="upcoming"?"bg-gray-300":"bg-white"} cursor-pointer rounded-tl-md rounded-bl-md px-5 p-2`}>Upcoming Events</li>
                            <li onClick={()=>setActiveTab("past")} className={`${activeTab==="past"?"bg-gray-300":"bg-white"} cursor-pointer rounded-tr-md rounded-br-md px-5 p-2`}>Past Events</li>
                        </ul>
                    </div>
                    <div className=' bg-[#f5f2f7] p-10 w-full'>
                        <div className="flex gap-8 flex-wrap justify-evenly  w-full">
                            {
                                activeTab==="upcoming" && upComingEvents?.map((item, index) => {
                                    return <div key={index} className='w-[28%]'>
                                        <EventCard item={item} />
                                    </div>
                                })
                            }
                            {
                                activeTab==="past" && pastEvents?.map((item, index) => {
                                    return <div key={index} className='w-[28%]'>
                                        <EventCard item={item} />
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleCommunity
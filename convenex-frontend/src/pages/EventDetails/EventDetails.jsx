import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Navbar3 from '../../components/NavbarV3/Navbar3.jsx'
import ProfileCard from '../../components/ProfileCard/ProfileCard.jsx';

const EventDetails = () => {
    const { communityId, eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [community, setCommunity] = useState(null);
    const [regUsers, setRegUsers] = useState([]);
    const fetchEventsOnLoad = async () => {
        await axios.get(`http://localhost:4000/api/community/${communityId}/event/${eventId}`).then((res) => {
            setEvent(res?.data?.event);
            setRegUsers(res?.data?.event?.attendees);
        }).catch((err) => {
            console.log(err);
            return toast.error(err?.response?.data?.error);
        });
    }
    useEffect(() => {
        if (eventId) fetchEventsOnLoad();
    }, [eventId]);

    const fetchCommunity = async () => {
        await axios.get(`http://localhost:4000/api/community/getCommunity/${communityId}`, { withCredentials: true }).then((res) => {
            console.log(res);
            setCommunity(res?.data?.community);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }
    const [user, setUser] = useState(null);
    const fetchUser = async () => {
        await axios.get("http://localhost:4000/api/auth/self", { withCredentials: true }).then((res) => {
            setUser(res?.data?.user);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
        // setUser(localStorage.getItem("userInfo"));
    }
    useEffect(() => {
        if (communityId) {
            fetchCommunity();
            fetchUser();
        }
    }, [communityId]);
    return (
        <>
            <Navbar3 />
            <div className='relative w-full bg-[#f5f2f7]'>

                {/* HERO SECTION */}
                <div className='relative h-screen w-full'>

                    {/* Banner */}
                    <img
                        src={event?.bannerImage}
                        alt="banner"
                        className='w-full h-full object-cover'
                    />

                    {/* Overlay */}
                    <div className='absolute inset-0 bg-black/60'></div>

                    {/* Content */}
                    <div className='absolute inset-0 flex justify-between p-15 text-white'>

                        {/* LEFT */}
                        <div className='w-[55%]'>

                            <h1 className='text-5xl font-bold mb-8'>
                                {event?.name}
                            </h1>

                            <p className='text-xl text-gray-200 leading-relaxed mb-10'>
                                {event?.description}
                            </p>

                            {/* Community */}
                            <div className='flex items-center gap-4 mb-10'>

                                <img
                                    src={community?.logo}
                                    alt="logo"
                                    className='w-14 h-14 rounded-full border-2 border-white'
                                />

                                <div className='text-2xl font-medium'>
                                    {community?.name}
                                </div>

                            </div>

                            {/* CTA */}
                            {
                                event?.type === "upcoming" && !event?.attendees?.some((id) => id === user?._id) && <Link to={`/community/${communityId}/event/${eventId}/register`} className='bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl text-lg font-medium'>
                                    Go to Registration
                                </Link>
                            }
                            {
                                event?.attendees?.some((id) => id === user?._id) && event?.mode === "online" && <div><strong>Meeting Link: </strong><div>{event?.meetingLink}</div></div>
                            }
                            {
                                event?.attendees?.some((id) => id === user?._id) && event?.mode === "offline" && <div><strong>Address: </strong><div>{event?.location} </div></div>
                            }
                            {
                                event?.attendees?.some((id) => id === user?._id) && event?.mode === "hybrid" && <div><strong>Address: </strong><div>{event?.location}</div><div><strong>Meeting Link: </strong></div><div>{event?.meetingLink}</div></div>
                            }
                            {
                                event?.type === "past" && <div className='bg-gray-400 w-fit px-8 py-4 rounded-xl text-lg font-medium'>
                                    Event Ended!
                                </div>
                            }
                        </div>

                        {/* RIGHT */}
                        <div className='w-[30%] flex flex-col gap-8 pt-10'>

                            <div>
                                <div className='text-gray-300 text-sm mb-2'>
                                    MODE
                                </div>

                                <div className='text-2xl font-semibold'>
                                    {event?.mode?.toUpperCase()}
                                </div>
                            </div>

                            <div>
                                <div className='text-gray-300 text-sm mb-2'>
                                    DATE
                                </div>

                                <div className='text-2xl font-semibold'>
                                    {new Date(event?.startDateTime)
                                        .toLocaleDateString()}
                                </div>
                            </div>

                            <div>
                                <div className='text-gray-300 text-sm mb-2'>
                                    ENTRY FEE
                                </div>

                                <div className='text-2xl font-semibold'>
                                    ₹ {event?.entryFee || 0}
                                </div>
                            </div>

                            {
                                event?.location && (
                                    <div>

                                        <div className='text-gray-300 text-sm mb-2'>
                                            LOCATION
                                        </div>

                                        <div className='text-2xl font-semibold'>
                                            {event?.location}
                                        </div>

                                    </div>
                                )
                            }

                        </div>

                    </div>

                </div>

                {/* DETAILS SECTION */}
                <div className='px-20 py-16'>

                    {/* TAGS */}
                    <div className='mb-12'>

                        <h2 className='text-2xl font-semibold mb-5'>
                            Tags
                        </h2>

                        <div className='flex gap-4 flex-wrap'>

                            {
                                event?.tags?.map((tag, index) => (

                                    <div
                                        key={index}
                                        className='bg-cyan-500 text-white px-5 py-2 rounded-full text-sm font-medium'
                                    >
                                        {tag}
                                    </div>
                                ))
                            }

                        </div>

                    </div>

                    {/* ABOUT */}
                    <div className='mb-12'>

                        <h2 className='text-2xl font-semibold mb-5'>
                            About This Event
                        </h2>

                        <p className='text-gray-700 leading-relaxed text-lg'>
                            {event?.description}
                        </p>

                    </div>

                    {/* Registered Users */}
                    <div>
                        <div className='text-2xl font-semibold mb-5'>Registered Users</div>
                        <div className="flex gap-8 flex-wrap w-full">
                            {
                                regUsers?.map((item,index)=>{
                                    return <div key={index} className='w-[25%]'>
                                        <ProfileCard data={item}/>
                                    </div>
                                })
                            }
                        </div>
                    </div>

                </div>

                <ToastContainer />

            </div>
        </>
    )
}

export default EventDetails
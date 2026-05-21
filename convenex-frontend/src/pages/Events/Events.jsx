import React,{useState, useEffect} from 'react'
import Navbar3 from '../../components/NavbarV3/Navbar3.jsx'
import EventCard from '../../components/EventCard/EventCard.jsx';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Events = () => {
    const { communityId } = useParams();
    const [events, setEvents] = useState([]);
    const [upComingEvents,setUpComingEvents] = useState([]);
    const [pastEvents,setPastEvents] = useState([]);
    const [activeTab,setActiveTab] = useState("upcoming");
    
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
    useEffect(()=>{
        if(communityId) fetchEventsOnLoad();
    },[communityId]);
    return (
        <>
            <Navbar3 />
            <div className='bg-[#f5f2f7] p-5 w-full relative'>
                {/* Our Events Section */}
                <div className='text-3xl text-center mb-10 font-semibold bg-[#f5f2f7]'>Our Events</div>
                <div className='flex justify-center'>
                    <ul className='flex'>
                        <li onClick={()=>setActiveTab("upcoming")} className={`${activeTab==="upcoming"?"bg-gray-300":"bg-white"} cursor-pointer rounded-tl-md rounded-bl-md px-5 p-2`}>Upcoming Events</li>
                        <li onClick={()=>setActiveTab("past")} className={`${activeTab==="past"?"bg-gray-300":"bg-white"} cursor-pointer rounded-tr-md rounded-br-md px-5 p-2`}>Past Events</li>
                    </ul>
                </div>
                <div className=' bg-[#f5f2f7] p-10 w-full'>
                    <div className="flex gap-8 flex-wrap justify-evenly  w-full">
                        {
                            activeTab==="upcoming" && upComingEvents?.map((item, index)=>{
                            return <div className='w-[24%]'>
                                <EventCard item={item} />
                            </div>
                            })
                        }
                        {
                            activeTab==="past" && pastEvents?.map((item, index)=>{
                            return <div className='w-[24%]'>
                                <EventCard item={item} />
                            </div>
                            })
                        }
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </>
    )
}

export default Events
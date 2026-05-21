import Card from '../Card/Card.jsx'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

const EventCard = ({item}) => {
    const {communityId} = useParams();
    const formatEventDate=()=>{
        const startDateTime = item?.startDateTime;
        const endDateTime = item?.endDateTime;

        const startDate = new Date(startDateTime);
        const endDate = new Date(endDateTime);

        const month = startDate.toLocaleString("en-IN",{
            month:"short"
        });

        return `${startDate.getDate()} - ${endDate.getDate()} ${month}`;
    }
    return (
        <div className="relative bg-white w-full h-80 rounded-2xl cursor-pointer">
            <img className='absolute inset-0 w-full h-full rounded-2xl' src={item?.bannerImage} alt="" />
            <div className='absolute inset-0 w-full h-full bg-[#2c2f3c80] rounded-2xl'></div>
            <div className='absolute top-5 left-5 text-white'>{formatEventDate()}</div>
            <Link to={`/community/${communityId}/event/${item?._id}`} className='absolute top-30 left-5 rounded-sm text-white py-1 px-5 text-sm bg-[#39b7d8] hover:bg-[#2aa0be]'>VIEW EVENT</Link>
            <div className='absolute top-40 text-white py-1 px-5 text-lg font-medium'>{item?.name}</div>
            <img className='absolute bottom-10 left-5 w-10 h-10 rounded-full' src={item?.community?.logo} alt="comm-logo" />
            <div className='absolute bottom-12 left-17 text-white'>{item?.community?.name}</div>
        </div>
    )
}

export default EventCard
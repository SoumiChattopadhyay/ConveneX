import React from 'react'
import Card from '../Card/Card.jsx'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const CommunityCard = ({ item }) => {
  const [userData,setUserData] = useState(null);
  
  useEffect(()=>{
    setUserData(JSON.parse(localStorage.getItem('userInfo')));
  },[]);

  const isMember = item?.members?.some((itm)=>{
    return itm?.toString()===userData?._id?.toString()
  });

  const joinCommunity = async()=>{
    await axios.post(`http://localhost:4000/api/community/${item?._id}/addMember`,{},{withCredentials:true}).then((res)=>{
      window.location.reload();
    }).catch((err)=>{
      console.log(err);
      return toast.error(err?.response?.data?.error);
    })
  }
  return (
    <Link to={`/community/${item?._id}`}>
      <Card padding={0}>
        <div className='relative w-full h-85'>
          <div className='relative w-full h-40 rounded-md'>
            <img className='rounded-t-md w-full h-full cursor-pointer' src={item?.bannerImage} alt="banner-logo" />
          </div>
          <div className='absolute top-12 left-26'>
            <img className='w-25 h-25 cursor-pointer border-white rounded-full' src={item?.logo} alt="logo" />
          </div>
          <div className='px-4 pb-2'>
            <div className='text-xl font-semibold py-2'>{item?.name}</div>
            <div className='text-sm'>{item?.tagline}</div>
          </div>
          <div className='flex justify-center'>
            {
              !isMember ? <div onClick={(e)=>{e.preventDefault();e.stopPropagation();joinCommunity();}} className='w-[30%] bg-green-600 hover:bg-green-700 text-white px-1 py-2 rounded-md text-center cursor-pointer font-semibold absolute bottom-2'>Join</div> : <div className='w-[30%] bg-gray-400 text-white px-1 py-2 absolute bottom-2 rounded-md text-center cursor-pointer font-semibold'>Joined!</div>
            }
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default CommunityCard
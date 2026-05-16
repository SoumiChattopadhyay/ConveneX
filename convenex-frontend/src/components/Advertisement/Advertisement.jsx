import Card from '@mui/material/Card'
import React, { useState, useEffect } from 'react'

const Advertisement = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {//Whenever page reloads or component reloads we want the useEffect method to get called
        let userData = localStorage.getItem("userInfo");
        if(userData && userData!="undefined"){
            setUserData(JSON.parse(userData));
        }else{
            setUserData(null);
        }
    }, []);
    
    return (
        <div className='sticky top-18'>
            <Card padding={0}>
                <div className='relative'>
                    <div className='relative w-full h-22 rounded-md'>
                        <img className='w-full h-30 object-cover rounded-t-md cursor-pointer' src="/img/advCard.png" alt="adv-card" />
                    </div>
                    <div className='absolute top-22 left-29 z-10'>
                        <img className='w-16 h-16 cursor-pointer border-2 border-white rounded-4xl' src={userData?.profilePic} alt="profile-icon" />
                    </div>
                    <div className=' pt-12 pb-6 px-9 mt-5'>
                        <div className='text-md text-center font-semibold'>{userData?.f_name}</div>
                        <div className='text-sm my-2 text-center'>Get the latest job and industry news</div>
                        <div className='px-5 py-2 bg-violet-600 text-white text-sm text-center rounded-3xl hover:bg-violet-700 cursor-pointer font-semibold'>Explore</div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Advertisement
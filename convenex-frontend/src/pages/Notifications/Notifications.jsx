import React, { useState, useEffect } from 'react'
import Advertisement from '../../components/Advertisement/Advertisement'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import Card from '../../components/Card/Card'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
    const navigate = useNavigate();

    const [ownData, setOwnData] = useState(null);

    useEffect(() => {
        let selfData = localStorage.getItem('userInfo');
        setOwnData(selfData ? JSON.parse(selfData) : null);
    }, []);


    const [notifications, setNotifications] = useState([]);

    const fetchNotificationsOnLoad = async () => {
        await axios.get("http://localhost:4000/api/notification", { withCredentials: true }).then((res) => {
            console.log(res);
            setNotifications(res?.data?.notifications);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    };

    useEffect(() => {
        fetchNotificationsOnLoad();
    }, []);

    
    const handleOnclickNotification = async(item)=>{
        await axios.put("http://localhost:4000/api/notification/updateIsRead",{notificationId:item?._id},{withCredentials:true}).then((res)=>{
            if(item?.type==='friendRequest'){
                navigate('/myNetwork');
            }else{//if type is 'comment'
                navigate(`/profile/${ownData?._id}/activity/${item?.postId}`);
            }
            window.location.reload();
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }

    return (
        <div className='w-full flex justify-between gap-5 bg-[#f5f2f7] p-5'>
            {/* User Profile Card */}
            <div className='w-[19%] hidden sm:block sm:w-[23%] h-fit'>
                <ProfileCard data={ownData} />
            </div>

            {/* User Notifications */}
            <div className='w-full sm:w-[50%]'>
                <Card padding={0}>
                    <div className='w-full'>
                        {/* one notification */}
                        {
                            notifications?.map((item, index) => {
                                return <div onClick={()=>handleOnclickNotification(item)} key={index} className={`${item?.isRead?'':'bg-violet-100'} p-3 border-b border-gray-300 flex gap-4 items-center cursor-pointer`}>
                                    <img className='w-11 h-11 rounded-full' src={item?.sender?.profilePic} alt="profile-img" />
                                    {item?.content}
                                </div>
                            })
                        }
                    </div>
                </Card>
            </div>


            {/* User Advertisement Card */}
            <div className='top-19 sticky w-[25%] sm:hidden md:block h-fit'>
                <Advertisement />
            </div>
        </div>
    )
}

export default Notifications
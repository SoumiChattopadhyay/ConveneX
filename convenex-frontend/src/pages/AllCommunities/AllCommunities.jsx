import React from 'react'
import CommunityCard from '../../components/CommunityCard/CommunityCard'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const AllCommunities = () => {
    const [activeTab,setActiveTab] = useState("all");
    const [communities, setCommunities] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [otherCommunities, setOtherCommunities] = useState([]);

    const fetchCommunitiesOnLoad = async () => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        await axios.get("http://localhost:4000/api/community/getAllCommunities").then((res) => {
            console.log(res);
            setCommunities(res?.data?.communities);
            setMyCommunities(res?.data?.communities?.filter(
                (community) => community.members.some(
                    (member) => member?.toString() === user?._id.toString()
                )
            ));
            setOtherCommunities(res?.data?.communities?.filter(
                (community) => !community.members.some(
                    (member) => member?.toString() === user?._id?.toString()
                )
            ));
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    };
    useEffect(() => {
        fetchCommunitiesOnLoad();
    }, []);
    return (
        <div className=' bg-[#f5f2f7] p-5 w-full'>
            {/* <div className='text-3xl text-center mb-5 font-semibold '>All Communities</div> */}
            <div className='ml-full flex justify-end'>
                <Link to={"/createCommunity"} className='w-[20%] text-sm text-white text-center cursor-pointer hover:bg-cyan-600 font-medium bg-cyan-500 px-5 py-3 rounded-md'>Create your own Community</Link>
            </div>
            <div className='flex justify-center mb-10'>
                <ul className='flex'>
                    <li onClick={() => setActiveTab("all")} className={`${activeTab === "all" ? "bg-gray-300" : "bg-white"} cursor-pointer rounded-tl-md rounded-bl-md px-5 p-2`}>All Communities</li>
                    <li onClick={() => setActiveTab("self")} className={`${activeTab === "self" ? "bg-gray-300" : "bg-white"} cursor-pointer rounded-tr-md rounded-br-md px-5 p-2`}>Joined Communities</li>
                    <li onClick={() => setActiveTab("other")} className={`${activeTab === "other" ? "bg-gray-300" : "bg-white"} cursor-pointer rounded-tr-md rounded-br-md px-5 p-2`}>Other Communities</li>
                </ul>
            </div>
            
            <div className="flex gap-7 justify-evenly flex-wrap w-full">
                {
                    activeTab==="all" && communities?.map((item, index) => {
                        return <div key={index} className='w-[28%]'>
                            <CommunityCard item={item} />
                        </div>
                    })
                }
                {
                    activeTab==="self" && myCommunities?.map((item, index) => {
                        return <div key={index} className='w-[28%]'>
                            <CommunityCard item={item} />
                        </div>
                    })
                }
                {
                    activeTab==="other" && otherCommunities?.map((item, index) => {
                        return <div key={index} className='w-[28%]'>
                            <CommunityCard item={item} />
                        </div>
                    })
                }
            </div>
            <ToastContainer />
        </div>
    );
}

export default AllCommunities
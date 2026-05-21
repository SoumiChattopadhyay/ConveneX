import React, { useState, useEffect } from 'react'
import Navbar3 from '../../components/NavbarV3/Navbar3.jsx'
import ProfileCard from '../../components/ProfileCard/ProfileCard.jsx';
import { useParams } from 'react-router-dom';
import axios from "axios";

const Members = () => {
    const [members, setMembers] = useState(null);
    const { communityId } = useParams();
    const fetchCommunity = async () => {
        await axios.get(`http://localhost:4000/api/community/getCommunity/${communityId}`, { withCredentials: true }).then((res) => {
            // console.log(res);
            setMembers(res?.data?.community?.members);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }
    useEffect(() => {//Whenever page reloads or component reloads we want the useEffect method to get called
        fetchCommunity();
    }, []);
    return (
        <>
            <Navbar3 />
            <div className='bg-[#f5f2f7] p-5 w-full relative'>
                {/* Our Members Section */}
                <div className='text-3xl text-center font-semibold bg-[#f5f2f7]'>Our Members</div>
                <div className=' bg-[#f5f2f7] p-10 w-full'>
                    <div className="flex gap-8 flex-wrap justify-evenly w-full">
                        {
                            members?.map((item, index) => {
                                return <div key={index} className='w-[25%]'>
                                    <ProfileCard data={item} />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Members
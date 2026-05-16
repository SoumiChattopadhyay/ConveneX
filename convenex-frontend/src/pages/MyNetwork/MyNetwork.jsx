import React, { useEffect, useState } from 'react'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import axios from 'axios'

const MyNetwork = () => {
    const [text,setText] = useState("Catch Up with Friends");
    const [data,setData] = useState([]);
    const handleFriends = ()=>{
        setText("Catch Up with Friends");
    }
    const handlePending = ()=>{
        setText("Pending Requests");
    }
    const fetchFriendList = async()=>{
        await axios.get("http://localhost:4000/api/auth/friendList",{withCredentials:true}).then((res)=>{
            console.log(res);
            setData(res.data.friends);
        }).catch((err)=>{
            console.log(err);
            alert("Something went wrong");
        });
    }
    const fetchPendingReq = async()=>{
        await axios.get("http://localhost:4000/api/auth/pendingFriendsList",{withCredentials:true}).then((res)=>{
            console.log(res);
            setData(res.data.pendingFriends);
        }).catch((err)=>{
            console.log(err);
            alert("Something went wrong");
        });
    }
    useEffect(()=>{
        if(text==="Catch Up with Friends"){
            fetchFriendList();
        }else{
            fetchPendingReq();
        }
    },[text]);//runs whenever text changes

    return (
        <div className='px-40 py-5 xl:px-50 flex flex-col w-full bg-[#f5f2f7] h-screen'>
            <div className='border w-full bg-white rounded-lg p-3'>
                <div className='flex justify-between items-center'>
                    <div>{text}</div>
                    <div className='flex gap-2 w-[30%]'>
                        <div onClick={handleFriends} className={`${text==="Catch Up with Friends"?"bg-violet-700 text-white":""} border text-sm px-3 py-1 text-center rounded-md w-fit cursor-pointer`}>Friends</div>
                        <div onClick={handlePending} className={`${text==="Pending Requests"?"bg-violet-700 text-white":""} border text-sm px-3 py-1 text-center rounded-md w-fit cursor-pointer`}>Pending Requests</div>
                    </div>
                </div>
            </div>
            <div className='flex justify-evenly w-full gap-7 flex-wrap py-5'>
                {
                    data.map((item,index)=>{
                        return <div key={index} className='md:w-[30%] sm:w-full h-67.5'><ProfileCard data={item}/></div>
                    })
                }
                {
                    data?.length===0 ? text==="Catch Up with Friends" ? <div className='mt-10'>No Friends yet...</div> : <div className='mt-10'>No Pending Friend requests at the moment...</div> : null
                }
            </div>
        </div>
    )
}

export default MyNetwork
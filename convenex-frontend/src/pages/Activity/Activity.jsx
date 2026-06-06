import React, { useRef } from 'react'
import Advertisement from '../../components/Advertisement/Advertisement'
import Post from '../../components/Post/Post'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
const Activity = () => {

    const postRef = useRef();

    const {id, postId} = useParams();
    const [ownData, setOwnData] = useState(null);
    const [post,setPost]=useState(null);

    const fetchDataOnLoad = async()=>{
        await axios.get(`http://localhost:4000/api/post/getPostByPostId/${postId}`).then((res)=>{
            console.log(res);
            setPost(res.data.post);
        }).catch((err)=>{
            console.log(err);
            alert(err?.response?.data?.error);
        })
    };

    useEffect(()=>{
        fetchDataOnLoad();
        let selfData = localStorage.getItem('userInfo');
        setOwnData(selfData?JSON.parse(selfData):null);
    },[id]);

    useEffect(()=>{
    const observer = new IntersectionObserver(
      async([entry])=>{
        if(entry.isIntersecting){
          try{
            await axios.post(`http://localhost:4000/api/post/post-impression/${item?._id}`,{},{withCredentials:true});
            observer.unobserve(entry.target);
          }catch(err){
            console.log(err);
          }
        }
      },
      {threshold:0.5}
    );
    if(postRef.current){
      observer.observe(postRef.current);
    }
    return ()=>observer.disconnect();
  },[item?._id]);//Re-run this effect whenever the value of item._id changes. It does not mean "watch the URL".

    
    return (
        <div ref={postRef} className='w-full flex justify-between gap-5 bg-gray-200 p-5'>
            {/* User Profile Card */}
            <div className='w-[19%] hidden sm:block sm:w-[23%] h-fit'>
                <ProfileCard data={post?.user}/>
            </div>

            {/* User Single Post */}
            <div className='w-[50%]'>
                <div>
                    <Post item={post} personalData={ownData} fullHeight={0}/>
                </div>
            </div>

            {/* User Advertisement Card */}
            <div className='top-19 sticky w-[26%] sm:hidden md:block h-fit'>
                <Advertisement />
            </div>
        </div>
    )
}

export default Activity
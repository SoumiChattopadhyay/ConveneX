import React, { useState } from 'react'
import Card from '../../components/Card/Card'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import Advertisement from '../../components/Advertisement/Advertisement'
import Post from '../../components/Post/Post'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

const AllActivities = () => {

    const { id } = useParams();
    // console.log(id);

    const [ownData, setOwnData] = useState(null);
    const [posts, setPosts] = useState([]);

    const fetchDataOnLoad = async () => {
        await axios.get(`http://localhost:4000/api/post/getAllPostsofUser/${id}`).then((res) => {
            console.log(res);
            setPosts(res.data.post);
        }).catch((err) => {
            console.log(err);
            alert(err?.response?.data?.error);
        });
    };

    useEffect(() => {
        fetchDataOnLoad();//whenever id changes in url useEffect runs this funct
        let selfData = localStorage.getItem('userInfo');
        setOwnData(selfData ? JSON.parse(selfData) : null);
    }, [id]);

    return (
        <div className='w-full flex justify-between gap-3 bg-gray-200 p-5'>
            {/* User Profile Card */}
            <div className='w-[19%] hidden sm:block sm:w-[23%] h-fit'>
                <ProfileCard data={posts[0]?.user} />
            </div>

            {/* User Top 5 Posts */}
            <div className='w-[50%]'>
                <Card padding={1}>
                    <div className='font-semibold mb-3'>All Activities</div>
                    <div className='w-fit bg-green-800 text-white font-semibold text-xs px-2 py-1 rounded-2xl cursor-pointer mb-3'>Posts</div>
                    <div>
                        {
                            posts.map((item, index) => {
                                return <div>
                                    <Post item={item} personalData={ownData} fullHeight={0} />
                                </div>
                            })
                        }
                    </div>
                </Card>
            </div>

            {/* User Advertisement Card */}
            <div className='top-19 sticky w-[26%] sm:hidden md:block h-fit'>
                <Advertisement />
            </div>
        </div>
    )
}

export default AllActivities
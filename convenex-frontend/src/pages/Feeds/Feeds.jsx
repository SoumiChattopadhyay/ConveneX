import React, { useState, useEffect } from 'react'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import Card from '../../components/Card/Card'
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ArticleIcon from '@mui/icons-material/Article';
import Advertisement from '../../components/Advertisement/Advertisement';
import Post from '../../components/Post/Post';
import Modal from '../../components/Modal/Modal';
import PostModal from '../../components/PostModal/PostModal';
import Loader from '../../components/Loader/Loader';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Feeds = () => {
  const [personalData, setPersonalData] = useState(null);
  const [post, setPost] = useState([]);

  const fetchData = async () => {
    try {
      const [userData, postData] = await Promise.all([
        await axios.get("http://localhost:4000/api/auth/self", { withCredentials: true }),//authmiddleware comes after this req so we need to send the cookies so we write {withCredentials:true}
        await axios.get("http://localhost:4000/api/post/allPosts")
      ]);
      console.log(userData);
      // console.log(postData);//print the objects to know where the user object and posts array exist in userData object and postData object
      setPersonalData(userData.data.user);
      setPost(postData.data.posts);
      localStorage.setItem("userInfo", JSON.stringify(userData.data.user));//set it again becoz in the get req controller fetches user data directly from database so even if its updated later in Browser local storage you will see the up to date user details and you do not have to login again to store the updated user details in browser local storage as during login also we did this same step
    }catch(err){
      console.err(err);
      return toast.error(err?.response?.data?.error);
    }    
  }

  useEffect(() => {
    fetchData();
  }, []);

  const [closeModal, setCloseModal] = useState(false);
  const handleCloseModal = () => {
    setCloseModal(prev => !prev);
  }
  return (
    <div className='px-5 py-2 xl:px-50 flex gap-4 w-full bg-[#f5f2f7]'>
      
      {/* Left side */}
      <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
        <div className='h-fit'>
          <ProfileCard data={personalData} />
        </div>
        <div className='w-full my-5'>
          <Card padding={1}>
            <div className='w-full flex justify-between'>
              <div>Profile Viewers</div>
              <div className='text-violet-600'>23</div>
            </div>
            <div className='w-full flex justify-between'>
              <div>Post Impressions</div>
              <div className='text-violet-600'>90</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Middle Side */}
      <div className='w-full flex flex-col py-5 sm:w-[50%] '>
        <Card padding={1}>
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 w-full">
              <img className='w-11 h-11 rounded-4xl' src={personalData?.profilePic} alt="profile-icon" />
              <div onClick={() => setCloseModal(true)} className='w-full px-3 py-3 border rounded-3xl hover:bg-gray-200 cursor-pointer'>Start a post</div>
            </div>
            <div className="flex w-full justify-between">
              <div onClick={() => setCloseModal(true)} className="flex p-2 gap-1 justify-center w-[33%] rounded-3xl cursor-pointer hover:bg-gray-200">Video <VideoCameraBackIcon sx={{ color: "green" }} /></div>
              <div onClick={() => setCloseModal(true)} className="flex p-2 gap-1 justify-center w-[33%] rounded-3xl cursor-pointer hover:bg-gray-200">Photo <InsertPhotoIcon sx={{ color: "blue" }} /> </div>
              <div onClick={() => setCloseModal(true)} className="flex p-2 gap-1 justify-center w-[33%] rounded-3xl cursor-pointer hover:bg-gray-200">Article <ArticleIcon sx={{ color: "orange" }} /> </div>
            </div>
          </div>
        </Card>

        <div className='border-b border-gray-400 w-full mb-4' />

        <div className='w-full'>
          {
            post.map((item,index)=>{
              return <Post item={item} personalData={personalData} index={index} key={item._id} fullHeight={0}/>;
            })
          }
        </div>
      </div>

      {/* Right Side */}
      <div className='w-[26%] sm:hidden md:block py-5'>
        <div className='h-fit'>
          <Card padding={1}>
            <div className='flex flex-col'>
              <div className='text-lg text-violet-700'>ConveneX News</div>
              <div className='text-md text-gray-600'>Top Stories</div>
              <div className="my-1">
                <div>Buffett to remain Berkshire chair</div>
                <div className='text-xs text-gray-400'>2h ago</div>
              </div>
              <div className="mb-1">
                <div>Foreign investments surge again</div>
                <div className='text-xs text-gray-400'>3h ago</div>
              </div>
            </div>
          </Card>
        </div>
        <div className='sticky top-19 py-2'>
          <Advertisement />
        </div>
      </div>

      {closeModal &&
        <Modal closeModal={handleCloseModal}>
          <PostModal personalData={personalData}/>
        </Modal>}

      {/* <Loader/> */}
      {/* We will show this when our api call is happening and until it is not completed, when api call is successful we will show the content*/}
    <ToastContainer/>
    </div>
  )
}

export default Feeds
import React, { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import socket from '../../../socket';

const Post = ({ profile, index, item, personalData, fullHeight }) => {
  // console.log(item);
  const postRef = useRef();//creates a reference to the Post component's div

  const [seemore, setseemore] = useState(false);
  const desc = item?.desc;

  const [comment, setComment] = useState(false);
  const [noOfComments, setNoOfComments] = useState(item?.comments);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const [liked, setLiked] = useState(false);
  const [noOflikes, setNoOfLikes] = useState(item?.likes.length);//as we like, we have to update so we are using an extra state variable

  useEffect(() => {
    let selfId = personalData?._id;
    item?.likes?.map((itm) => {
      if (itm.toString() === selfId.toString()) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    });
  }, []);

  const handleLike = async () => {
    await axios.post("http://localhost:4000/api/post/likeDislike", { postId: item?._id }, { withCredentials: true }).then(res => {
      if (liked) {
        setNoOfLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        setNoOfLikes((prev) => prev + 1);
        setLiked(true);
      }
    }).catch(err => {
      console.log(err);
    });
  }
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await axios.post("http://localhost:4000/api/comment", { comment: commentInput.trim(), postId: item?._id }, { withCredentials: true }).then(res => {
      console.log(res);
      socket.emit("sendCommentNotification",{
        senderId: personalData._id,
        senderName: personalData.f_name,
        postId: item._id,
        postOwnerId: item.user._id
      });
      setCommentInput("");
      setComments((prev)=>[res.data.comment, ...prev]);
      setNoOfComments((prev)=>prev+1);
      setComment(true);
    }).catch(err => {
      console.log(err);
    });
  }
  const showComments = async () => {
    await axios.get(`http://localhost:4000/api/comment/getComments/${item?._id}`).then(res => {
      // console.log(res);
      setComments(res.data.comments);
      setComment((prev) => !prev);
    }).catch(err => {
      console.log(err);
    });
  }

  const copyToClipboard = async()=>{//whenever someone clicks share button on any post - it's link is copied to his clickboard
    try{
      let string = `http://localhost:5173/profile/${item?.user?._id}/activity/${item?._id}`;
      await navigator.clipboard.writeText(string);//navigator is default no need to import
      toast.success("Copied to clipboard!");
    }catch(err){
      toast.error("Failed to copy!",err);
    }
  }

  const handleProfileViewers = async()=>{
    try{
      await axios.post(`http://localhost:4000/api/auth/user/profile-view/${item?.user?._id}`,{},{withCredentials:true});
    }catch(err){
      toast.error(err.message);
    }
  }

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
    return ()=>observer.disconnect;
  },[item?._id]);//Re-run this effect whenever the value of item._id changes. It does not mean "watch the URL".

  return (
    <div ref={postRef} className={`flex flex-col ${fullHeight?"h-full":"min-h-fit"}`}>
      <Card padding={0}>

        {/* Post's User Details */}
        <div className='flex gap-2 py-3 px-3'>
          <Link onClick={handleProfileViewers} to={`/profile/${item?.user?._id}`}>
            <img className='w-11 h-11 rounded-4xl' src={item?.user?.profilePic} alt="profile-icon" />
          </Link>
          <div>
            <div className='font-semibold text-md'>{item?.user?.f_name}</div>
            <div className='text-xs text-gray-400'>{item?.user?.headline}</div>
          </div>
        </div>
        {/* Post Description */}
        {
          <div className={`text-md px-3 py-2 ${seemore?"h-auto":"h-10"}`}>
            {seemore ? desc : desc?.length>50 ?`${desc.slice(0, 50)}...` : `${desc}`}
            {desc?.length < 50 ? null : <span onClick={() => setseemore(prev => !prev)} className='text-xs text-gray-500 cursor-pointer'>{seemore ? "See Less" : "See More"}</span>}
          </div>
        }

        {/* Post Image */}
        {
          item?.imageLink && <div className='w-full py-4'>
            <img className='w-full' src={item?.imageLink} alt="post-img" />
          </div>
        }

        {/* Likes and Comments Count */}
        <div className='flex justify-between px-3 pb-5 mt-auto'>
          <div className='flex gap-2 items-center cursor-pointer'>
            <div><ThumbUpIcon sx={{ color: "gray", fontSize: "17px" }} /></div>
            <div className='text-xs text-gray-400'>{noOflikes} Likes</div>
          </div>
          <div className="flex gap-2 items-center cursor-pointer">
            <div><CommentIcon sx={{ color: "gray", fontSize: "17px" }} /></div>
            <div className='text-xs text-gray-400'>{noOfComments} Comments</div>
          </div>
        </div>

        {/* Like, Comment, Share buttons */}
        {
          !profile && <div className='flex justify-around px-2 pb-3'>
            <div onClick={handleLike} className="flex gap-2 items-center cursor-pointer px-4 py-2 hover:rounded-4xl hover:bg-gray-100">
              {liked ? <div><ThumbUpIcon sx={{ color: "blue" }} /></div> : <div><ThumbUpOffAltIcon /></div>}
              {liked ? <div className='text-sm'>Liked</div> : <div className='text-sm'>Like</div>}
            </div>
            <div onClick={showComments} className="flex gap-2 items-center cursor-pointer  px-4 py-2 hover:rounded-4xl hover:bg-gray-100">
              <div><CommentIcon /></div>
              <div className='text-sm'>Comment</div>
            </div>
            <div onClick={copyToClipboard} className="flex gap-2 items-center cursor-pointer px-4 py-2 hover:rounded-4xl hover:bg-gray-100">
              <div><SendIcon /></div>
              <div className='text-sm'>Share</div>
            </div>
          </div>
        }

        {/* Add Comment */}
        {!profile && comment && <div className="flex p-3 items-center gap-3 w-full h-20">
          <img className='w-10 h-10 rounded-4xl object-cover' src={personalData?.profilePic} alt="profile-icon" />
          <form onSubmit={handleSendComment} className='w-full flex gap-2'>
            <input value={commentInput} onChange={(e)=>setCommentInput(e.target.value)} type="text" placeholder='Add a comment' className='hover:bg-gray-100 border p-2 rounded-4xl w-[80%]' />
            <button className='bg-violet-600 text-white px-5 py-1 rounded-4xl cursor-pointer'>Send</button>
          </form>
        </div>
        }

        {/* Comment Section*/}
        {comment && comments.map((item) => (
          <div key={item?.user?._id}>
            <Link to={`/profile/${item.user._id}`} className='flex gap-2 py-3 px-4'>
              <div>
                <img className='w-8 h-8 rounded-4xl' src={item?.user?.profilePic} alt="profile-icon" />
              </div>
              <div>
                <div className='font-semibold text-sm'>{item?.user?.f_name}</div>
                <div className='text-xs font-semibold text-gray-400'>{item?.user?.headline}</div>
              </div>
            </Link>
            <div className='text-sm pb-3 pl-10'>
              {item?.comment}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

export default Post






// const Post = ({ profile }) => {
//   const [seemore, setseemore] = useState(false);
//   const desc = `Just came out of a 24-hour hackathon and it honestly felt like stepping into a time warp ⏳☕ Minimal sleep, constant problem-solving, and that weird moment when 3 AM feels like 3 PM. Somewhere between debugging loops and last-minute fixes, things started to click. What stood out the most wasn’t just building under pressure, but how quickly ideas evolve when you’re surrounded by people thinking at full speed. You adapt, rethink, simplify, and keep moving. The final demo rush hit different. Exhausted, slightly sleep-deprived, but proud of what we managed to pull off in such a short time. Hackathons really test more than just technical skills. They push your focus, teamwork, and decision-making in ways regular projects don’t. Still recovering, but already looking forward to the next one 🚀 #Hackathon #Learning #Growth #TechLife #BuildInPublic`
//   const handleSubmit = (e) => {
//     e.preventDefault();
//   }
//   const [comment, setComment] = useState(false);
//   return (
//     <div>
//       <Card padding={0}>

//         {/* Post's User Details */}
//         <div className='flex gap-2 py-3 px-3'>
//           <div>
//             <img className='w-11 h-11 rounded-4xl' src="https://i.pinimg.com/564x/a9/75/93/a975934bb378afc4ca8c133df451f56e.jpg" alt="profile-icon" />
//           </div>
//           <div>
//             <div className='font-semibold text-md'>Roselle Green</div>
//             <div className='text-xs text-gray-400'>SDE-2 Engineer @Google</div>
//           </div>
//         </div>

//         {/* Post Description */}
//         <div className='text-md px-3 py-2'>
//           {seemore ? desc : `${desc.slice(0, 50)}...`}
//           <span onClick={() => setseemore(prev => !prev)} className='text-xs text-gray-500 cursor-pointer'>{seemore ? "See Less" : "See More"}</span>
//         </div>

//         {/* Post Image */}
//         <div className='w-full h-[75] py-6'>
//           <img className='w-full h-full' src="https://cdn.prod.website-files.com/5d2ed51487801d2a4ca10119/5e9daba6e90ee73e8254fff8_tips%20-%20thumb%20what%20is.jpg" alt="post-img" />
//         </div>

//         {/* Likes and Comments Count */}
//         <div className='flex justify-between px-3 pb-5'>
//           <div className='flex gap-2 items-center cursor-pointer'>
//             <div><ThumbUpIcon sx={{ color: "gray", fontSize: "17px" }} /></div>
//             <div className='text-xs text-gray-400'>1 Likes</div>
//           </div>
//           <div className="flex gap-2 items-center cursor-pointer">
//             <div><CommentIcon sx={{ color: "gray", fontSize: "17px" }} /></div>
//             <div className='text-xs text-gray-400'>2 Comments</div>
//           </div>
//         </div>

//         {/* Like, Comment, Share buttons */}
//         {
//           !profile && <div className='flex justify-around px-2 pb-3'>
//             <div className="flex gap-2 items-center cursor-pointer px-4 py-2 hover:rounded-4xl hover:bg-gray-100">
//               <div><ThumbUpIcon sx={{ color: "blue" }} /></div>
//               <div className='text-sm'>Like</div>
//             </div>
//             <div onClick={() => setComment(true)} className="flex gap-2 items-center cursor-pointer  px-4 py-2 hover:rounded-4xl hover:bg-gray-100">
//               <div><CommentIcon /></div>
//               <div className='text-sm'>Comment</div>
//             </div>
//             <div className="flex gap-2 items-center cursor-pointer px-4 py-2 hover:rounded-4xl hover:bg-gray-100">
//               <div><SendIcon /></div>
//               <div className='text-sm'>Share</div>
//             </div>
//           </div>
//         }


//         {/* Add Comment */}
//         {!profile && comment && <div className="flex p-3 items-center gap-3 w-full h-20">
//           <img className='w-10 h-10 rounded-4xl object-cover' src="https://thumbs.dreamstime.com/b/user-woman-icon-lady-s-profile-female-web-sign-flat-art-object-black-white-silhouette-girl-business-suit-avatar-picture-173159996.jpg" alt="profile-icon" />
//           <form onSubmit={handleSubmit} className='w-full flex gap-2'>
//             <input type="text" placeholder='Add a comment' className='hover:bg-gray-100 border p-2 rounded-4xl w-[80%]' />
//             <button className='bg-blue-600 text-white px-5 py-1 rounded-4xl cursor-pointer'>Send</button>
//           </form>
//         </div>
//         }


//         {/* Comment Section*/}
//         {comment && <div>
//           <div className='flex gap-2 py-3 px-4'>
//             <div>
//               <img className='w-8 h-8 rounded-4xl' src="https://thumbs.dreamstime.com/b/user-woman-icon-lady-s-profile-female-web-sign-flat-art-object-black-white-silhouette-girl-business-suit-avatar-picture-173159996.jpg" alt="profile-icon" />
//             </div>
//             <div>
//               <div className='font-semibold text-sm'>Roselle Green</div>
//               <div className='text-xs text-gray-400'>SDE-2 Engineer @Google</div>
//             </div>
//           </div>
//           <div className='text-sm pb-3 pl-10'>
//             This was a wonderful experience!!
//           </div>
//         </div>}

//       </Card>
//     </div>
//   )
// }

// export default Post
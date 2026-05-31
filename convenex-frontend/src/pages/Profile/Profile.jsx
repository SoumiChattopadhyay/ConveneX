import React, { useState, useEffect } from 'react'
import Advertisement from '../../components/Advertisement/Advertisement.jsx'
import Card from '../../components/Card/Card.jsx'
import EditIcon from '@mui/icons-material/Edit';
import Post from '../../components/Post/Post.jsx';
import AddIcon from '@mui/icons-material/Add';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Modal from '../../components/Modal/Modal.jsx';
import ImageUploadModal from '../../components/ImageUploadModal/ImageUploadModal.jsx';
import InfoModal from '../../components/InfoModal/InfoModal.jsx';
import ExpModal from '../../components/ExpModal/ExpModal.jsx';
import AboutModal from '../../components/AboutModal/AboutModal.jsx';
import MessageModal from '../../components/MessageModal/MessageModal.jsx';
import SingleExpModal from '../../components/SingleExpModal/SingleExpModal.jsx';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify'
import socket from '../../../socket.js';


const Profile = () => {
    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [postData, setPostData] = useState([]);
    const [ownData, setOwnData] = useState(null);

    const fetchDataOnLoad = async () => {
        try {
            const [userData, postData, ownData] = await Promise.all([
                axios.get(`http://localhost:4000/api/auth/user/${id}`),
                axios.get(`http://localhost:4000/api/post/getTop5Posts/${id}`),
                axios.get(`http://localhost:4000/api/auth/self`, { withCredentials: true })
            ]);
            console.log(userData);
            console.log(postData);
            console.log(ownData);

            localStorage.setItem('userInfo', JSON.stringify(ownData.data.user));//the user whose profile someone has clicked that user info is stored in browser so that updated user obj is stored in browser console

            setUserData(userData.data.user);
            setPostData(postData.data.posts);
            setOwnData(ownData.data.user);
        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    }

    useEffect(() => {
        fetchDataOnLoad();
    }, [id]);//whenever id in url changes reload the states

    const [imgUpModal, setimgUpModal] = useState(false);
    const handleimgUpModalOpenClose = () => {
        setimgUpModal(prev => !prev);
    }

    const [circularImg, setCircularImg] = useState(false);
    const handleonBackgroundCover = () => {
        setCircularImg(false);
        setimgUpModal(prev => !prev);
    }
    const handleonUserDP = () => {
        setCircularImg(true);
        setimgUpModal(prev => !prev);
    }

    const [infoModal, setinfoModal] = useState(false);
    const handleinfoModalOpenClose = () => {
        setinfoModal(prev => !prev);
    }

    const [msgModal, setmsgModal] = useState(false);
    const handlemessageModalOpenClose = () => {
        setmsgModal(prev => !prev);
    }

    const [expModal, setexpModal] = useState(false);
    const handleexpModalOpenClose = () => {
        setexpModal(prev => !prev);
    }

    const [singleExpModal, setSingleExpModal] = useState(false);
    const [singleExpId, setSingleExpId] = useState(null);//will later assign integer
    const handleSingleExpModalOpenClose = (id) => {
        setSingleExpId(id);
        setSingleExpModal(prev => !prev);
    }

    const [aboutModal, setAboutModal] = useState(false);
    const handleaboutModalOpenClose = () => {
        setAboutModal(prev => !prev);
    }

    const handleEditFunct = async (data) => {
        await axios.put("http://localhost:4000/api/auth/update", { user: data }, { withCredentials: true }).then(res => {
            window.location.reload();
        }).catch(err => {
            console.log(err);
            alert("Something went wrong!");
        });
    }

    const amIfriend = () => {
        let arr = userData?.friends?.filter((item) => { return item === ownData?._id });//item itself is the id as friends array is an array of ids
        return arr?.length;
    }

    const amIInPendingList = () => {
        let arr = userData?.pending_friends?.filter(item => item === ownData?._id);
        return arr?.length;
    }

    const isInPendingList = () => {
        return ownData?.pending_friends?.some(item => item === userData?._id);
    }

    const checkFriendStatus = () => {
        if (amIfriend()) {
            return "Disconnect";
        }
        else if (amIInPendingList()) {
            return "Request Sent"
        }
        else if (isInPendingList()) {
            return "Approve Request";
        }
        else {
            return "Connect";
        }
    }

    const handleSendFriendReq = async () => {
        const status = checkFriendStatus();
        if (status === "Request Sent") return;
        else if (status === "Connect") {
            await axios.post("http://localhost:4000/api/auth/sendFriendReq", { receiver: userData?._id }, { withCredentials: true }).then((res) => {
                toast.success(res.data.message);
                socket.emit("sendFriendReqNotification", {
                    ownId: ownData._id,
                    userId: userData._id
                });
                fetchDataOnLoad();
                // setTimeout(() => {
                //     window.location.reload();    
                // }, 2000);
            }).catch((err) => {
                console.log(err);
                toast.error(err?.response?.data?.error);
            });
        }
        else if (status === "Approve Request") {
            await axios.post("http://localhost:4000/api/auth/acceptFriendReq", { friendId: userData?._id }, { withCredentials: true }).then((res) => {
                toast.success(res.data.message);
                socket.emit("sendAcceptReqNotification", {
                    ownId: ownData._id,
                    userId: userData._id
                });
                fetchDataOnLoad();
                // setTimeout(() => {
                //     window.location.reload();
                // }, 2000);
            }).catch((err) => {
                console.log(err);
                toast.error(err?.response?.data?.error);
            });
        }
        else {
            await axios.delete(`http://localhost:4000/api/auth/removeFromFriendList/${userData?._id}`, { withCredentials: true }).then((res) => {
                toast.success(res.data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }).catch((err) => {
                console.log(err);
                toast.error(err?.response?.data?.error);
            });
        }
    }

    const copyToClipboard = async () => {
        let string = `http://localhost:5173/profile/${id}`;
        await navigator.clipboard.writeText(string).then((res) => {
            toast.success("Copied to clipboard!");
        }).catch((err) => {
            console.error("Failed to copy!");
        });
    }

    const handleLogout = async () => {
        await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true }).then((res) => {
            localStorage.clear();
            window.location.reload();
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    }
    return (
        <div className='p-5 w-full bg-[#f5f2f7]'>
            <div className="flex justify-between gap-9">

                {/* Left side - Main section */}
                <div className='flex flex-col w-full md:w-[72%]'>

                    {/* User Information */}
                    <Card padding={0}>
                        <div className='relative w-full'>
                            <img className='w-full h-40 rounded-t-md' src={userData?.coverPic} alt="profile-background" />
                            {
                                userData?._id === ownData?._id && <div onClick={handleonBackgroundCover} className='flex items-center justify-center absolute right-4 top-3 bg-white rounded-full w-8.5 h-8.5 cursor-pointer'>
                                    <EditIcon />
                                </div>
                            }
                            <div className='absolute top-26 left-6 z-10'>
                                <img onClick={userData?._id === ownData?._id ? handleonUserDP : null} className='cursor-pointer w-20 h-20 rounded-full border-2 border-white' src={userData?.profilePic} alt="profile-icon" />
                            </div>
                            <div className="flex justify-between mr-5 my-2">
                                <div className='px-7 pt-7 pb-5 relative w-full'>
                                    <div className='text-lg font-semibold'>{userData?.f_name}</div>
                                    <div className='text-sm'>{userData?.headline}</div>
                                    <div className='text-xs text-gray-400'>{userData?.curr_location}</div>
                                    <div className='text-xs font-semibold text-violet-600 cursor-pointer hover:underline w-fit'>{userData?.friends?.length} Connections</div>
                                </div>
                                {
                                    userData?._id === ownData?._id && <div onClick={handleinfoModalOpenClose} className='cursor-pointer'><EditIcon /></div>
                                }
                            </div>

                            <div className="w-full md:flex justify-between px-4 pb-5">
                                <div className="flex gap-4">
                                    <div className='bg-violet-800 font-semibold text-center text-white text-sm px-3 py-2 rounded-md hover:bg-violet-900 cursor-pointer'>Open to</div>
                                    <div onClick={copyToClipboard} className='bg-violet-800 font-semibold text-center text-white text-sm px-3 py-2 rounded-md hover:bg-violet-900 cursor-pointer'>Share Profile</div>
                                    {
                                        userData?._id === ownData?._id && <div onClick={handleLogout} className='bg-violet-800 font-semibold text-center text-white text-sm px-3 py-2 rounded-md hover:bg-violet-900 cursor-pointer'>Logout</div>
                                    }
                                </div>
                                <div className="flex gap-4">
                                    {
                                        amIfriend() ? <div onClick={handlemessageModalOpenClose} className='bg-violet-800 font-semibold text-center text-white text-sm px-3 py-2 rounded-md hover:bg-violet-900 cursor-pointer'>Message</div> : null
                                    }{/* use ternary operator instead of && otherwise amIfriend() displays integers */}
                                    {
                                        userData?._id !== ownData?._id ? <div onClick={handleSendFriendReq} className='bg-violet-800 font-semibold text-center text-white text-sm px-3 py-2 rounded-md hover:bg-violet-900 cursor-pointer'>{checkFriendStatus()}</div> : null
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* User's About */}
                    <Card padding={1}>
                        <div className="flex justify-between w-full">
                            <div className='w-full'>
                                <div className='text-md font-semibold mb-1'>About</div>
                                <div className='text-xs w-[80%]'>{userData?.about}</div>
                            </div>
                            {
                                userData?._id === ownData?._id && <div onClick={handleaboutModalOpenClose} className='cursor-pointer'><EditIcon /></div>
                            }
                        </div>
                    </Card>

                    {/* User's Skills */}
                    <Card padding={1}>
                        <div>
                            <div className='text-md font-semibold mb-2'>Skills</div>
                            <div className="flex flex-wrap gap-3">
                                {
                                    userData?.skills?.map((item, index) => {
                                        return <div key={index} className='bg-violet-800 font-semibold text-center text-white text-sm px-3 py-2 rounded-md cursor-pointer'>{item}</div>
                                    })
                                }
                            </div>
                        </div>
                    </Card>

                    {/* Top 5 Posts of User */}
                    <Card padding={1}>
                        <div className='text-md font-semibold mb-2'>Activity</div>

                        <div className='bg-green-700 font-semibold text-center text-white text-sm w-fit px-3 py-1 rounded-2xl cursor-pointer'>Posts</div>

                        <div className='flex overflow-x-auto overflow-y-hidden gap-2 mt-4'>

                            {/* multiple posts */}
                            {/* specify height in each div otherwise if one div has profile={0} then it streches */}
                            {
                                postData?.map((item, index) => {
                                    return (
                                        <Link key={index} to={`/profile/${id}/activity/${item?._id}`} className='shrink-0 w-90 min-h-105 rounded-md'>
                                            <Post profile={1} item={item} personalData={ownData} fullHeight={1} />
                                            {/* when we call Post in feeds we dont pass profile argument so profile would be undefined and undefined means false */}
                                        </Link>
                                    );
                                })
                            }
                        </div>
                        {
                            postData?.length > 0 && <div className='w-full flex items-center justify-center mt-3'>
                                <Link to={`/profile/${id}/activities`} className='text-black! no-underline! hover:no-underline! p-2 rounded-xl hover:bg-gray-300 cursor-pointer'>Show all posts<ArrowRightAltIcon sx={{ color: "black" }} /></Link>
                            </div>
                        }

                    </Card>

                    {/* User Experience */}
                    <Card padding={1}>
                        <div className='flex items-center justify-between'>
                            <div className='text-md font-semibold mb-3'>Experience</div>
                            {
                                userData?._id === ownData?._id && <div onClick={handleexpModalOpenClose} className='cursor-pointer'><AddIcon sx={{ fontSize: "20px" }} /></div>
                            }
                        </div>
                        <div className='mx-2'>
                            <div className='flex flex-col'>
                                {
                                    userData?.experience?.map((exp, index) => {
                                        return (
                                            <div key={index} className="flex flex-row mb-1" >
                                                <div className='flex flex-col w-[90%]'>
                                                    <div className='text-sm font-semibold'>{exp?.designation}</div>
                                                    <div className='text-xs font-semibold'>{exp?.company_name}</div>
                                                    <div className='text-xs text-gray-500'>{exp?.duration}</div>
                                                    <div className='text-xs text-gray-500'>{exp?.location}</div>
                                                    <div className='my-4 border-b border-gray-300'></div>
                                                </div>
                                                {
                                                    userData?._id === ownData?._id && <div onClick={() => handleSingleExpModalOpenClose(exp._id)} className='cursor-pointer'><EditIcon sx={{ fontSize: "15px" }} /></div>
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div>
                            </div>
                        </div>
                    </Card>

                </div>

                {/* Right side - Advertisement */}
                <div className='w-[25%] hidden md:block sticky top-19'>
                    <Advertisement />
                </div>
            </div>

            {/* Image Modal */}
            {
                imgUpModal && <Modal title="Upload Image" closeModal={handleimgUpModalOpenClose}>
                    <ImageUploadModal selfData={ownData} isCircular={circularImg} handleEditFunct={handleEditFunct} />
                </Modal>
            }
            {/* Info Modal */}
            {
                infoModal && <Modal title="Edit Info Modal" closeModal={handleinfoModalOpenClose}>
                    <InfoModal selfData={ownData} handleEditFunct={handleEditFunct} />
                </Modal>
            }
            {/* Message Modal */}
            {
                msgModal && <Modal title="Send Message Modal" closeModal={handlemessageModalOpenClose}>
                    <MessageModal ownData={ownData} userData={userData} />
                </Modal>
            }
            {/* Experience Modal */}
            {
                expModal && <Modal title="Edit Experience Modal" closeModal={handleexpModalOpenClose}>
                    <ExpModal handleEditFunct={handleEditFunct} selfData={ownData} />
                </Modal>
            }
            {/* Single Experience Modal */}
            {
                singleExpModal && <Modal title="Edit Single Experience Modal" closeModal={handleSingleExpModalOpenClose}>
                    <SingleExpModal expId={singleExpId} selfData={ownData} handleEditFunct={handleEditFunct} />
                </Modal>
            }
            {/* About Modal */}
            {
                aboutModal && <Modal title="Edit About Modal" closeModal={handleaboutModalOpenClose}>
                    <AboutModal selfData={ownData} handleEditFunct={handleEditFunct} />
                </Modal>
            }
            <ToastContainer />
        </div>
    )
}

export default Profile
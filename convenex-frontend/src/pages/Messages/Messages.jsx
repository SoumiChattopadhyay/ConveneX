import React from 'react'
import Advertisement from '../../components/Advertisement/Advertisement'
import Card from '../../components/Card/Card'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Conversation from '../../components/Conversation/Conversation';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress'; //https://mui.com/material-ui/react-progress/#circular
import Box from '@mui/material/Box';
import socket from '../../../socket';

const Messages = () => {
  const [convos, setConvos] = useState([]);
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [selectedConvoOtherMember, setSelectedConvoOtherMember] = useState(null);//stores details of other member in conversation with current logged in user
  const [msgs, setMsgs] = useState([]);
  const [ownData, setOwnData] = useState(null);
  const [msgInp, setMsgInp] = useState("");
  const [imgInp, setImgInp] = useState(null);
  const [loading, setLoading] = useState(false);

  const ref = useRef();
  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const fetchConvosOnLoad = async () => {//whenever all convs where current user is one member are loaded, user's first conversation is considered the default selected conversation and its messages are shown
    await axios.get("http://localhost:4000/api/conversation/get-conversations", { withCredentials: true }).then((res) => {
      console.log(res);
      setConvos(res?.data?.conversations);
      let member = res?.data?.conversations[0]?.members?.find((it) => it?._id !== ownData?._id);
      handleSelectedConvo(res?.data?.conversations[0]?._id, member);
      socket.emit("joinConversation", res?.data?.conversations[0]?._id);//whenever curr user opens his Messages page, immediately emit an event saying User has joined his first convo 
    }).catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.error);
    });
  }
  useEffect(() => {
    let selfData = localStorage.getItem('userInfo');
    setOwnData(selfData ? JSON.parse(selfData) : null);
    fetchConvosOnLoad();
  }, []);


  const handleSelectedConvo = (convoId, userData) => {//Then Whenever another conv is selected manually by the curr user, that convo becomes the selected convo
    setSelectedConvoId(convoId);
    setSelectedConvoOtherMember(userData);
    socket.emit("joinConversation", convoId);//whenever user selects another convo, immediately emit an event saying User has joined that particular convo
  }

  const handleShowMessages = async () => {
    await axios.get(`http://localhost:4000/api/message/${selectedConvoId}`, { withCredentials: true }).then((res) => {
      console.log(res);
      setMsgs(res?.data?.messages);
    }).catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.error);
    });
  }
  useEffect(() => {
    if (selectedConvoId) {
      handleShowMessages();
    }
  }, [selectedConvoId]);

  useEffect(() => {
    socket.on('receiveMessage', (response) => {
      console.log(response);
      setMsgs([...msgs, response]);
    });
  }, [msgs]);

  const handleSendMessage = async () => {
    await axios.post('http://localhost:4000/api/message', { conversation: selectedConvoId, message: msgInp, picture: imgInp }, { withCredentials: true }).then((res) => {
      console.log(res);
      socket.emit('sendMessage', selectedConvoId, res?.data);
      setMsgInp("");
    }).catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.error);
    });
  }
  const handleImgUpload = async (e) => {
    let files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', import.meta.env.VITE_PRESET_NAME);
    setLoading(true);
    try {
      const res = await axios.post(`http://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data);
      setImgInp(res.data.url);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='px-5 py-5 xl:px-50 flex gap-5 w-full bg-[#f5f2f7] h-full'>

      <div className='w-full sm:w-[75%] rounded-lg'>
        <Card padding={0}>

          {/* top side */}
          <div className='text-md font-bold py-2 px-5 border-b-2 border-gray-300'>Messaging</div>
          <div className='py-2 px-5 border-b-2 border-gray-300'>
            <div className='flex gap-2 items-center cursor-pointer text-xs font-semibold bg-green-700 hover:bg-green-800 text-white w-fit px-3 py-1 rounded-4xl text-center'>Focused <ArrowDropDownIcon /></div>
          </div>

          {/* chat section */}
          <div className='w-full md:flex'>

            {/* left side */}
            <div className='h-150 w-full md:w-[40%] md:shrink-0 overflow-auto border-r-2 border-gray-300 '> {/* need to give height for scrollbar to work */}
              {/* for each chat */}
              {
                convos.map((item, index) => {
                  return <div key={index}>
                    <Conversation item={item} ownData={ownData} handleSelectedConvo={handleSelectedConvo} selectedConvoId={selectedConvoId} />
                  </div>
                })
              }
            </div>

            {/* right side */}
            <div className='w-full md:w-[60%]'>

              <div className='flex items-center justify-between border-b-2 border-gray-300 px-3 py-1'>
                <div>
                  <div className='text-sm font-bold'>{selectedConvoOtherMember?.f_name}</div>
                  <div className='text-xs text-gray-400'>{selectedConvoOtherMember?.headline}</div>
                </div>
                <div><MoreHorizIcon /></div>
              </div>

              {/* scrollable div portion */}
              <div className='h-90 w-full overflow-auto'>
                <div className='w-full border-b-2 border-gray-300 p-4'>
                  <img className='w-20 h-20 rounded-full' src={selectedConvoOtherMember?.profilePic} alt="profile-pic" />
                  <div className='my-2'>
                    <div className='text-md'>{selectedConvoOtherMember?.f_name}</div>
                    <div className='text-sm text-gray-500'>{selectedConvoOtherMember?.headline}</div>
                  </div>
                </div>
                {/* for each message */}
                {
                  msgs?.map((item, index) => {
                    const isOwnMessage = item?.sender?._id === ownData?._id;
                    return <div ref={ref} key={index} className={`w-full px-3 py-1 cursor-pointer`}>
                      <div className={`flex mb-4 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                        <div className="shrink-0">
                          {!isOwnMessage && <img className='mr-2 w-8 h-8 rounded-4xl' src={item?.sender?.profilePic} alt="" />}
                        </div>
                        {
                          !item?.picture && item?.message && <div className={`${isOwnMessage ? "bg-violet-100" : "bg-[#f5f2f7]"} rounded-md flex gap-3`}>
                            <div>
                              <div className={`${isOwnMessage ? "mx-1 mt-1" : ""}text-sm font-semibold m-2`}>{item?.sender?._id === ownData?._id ? "" : item?.sender?.f_name}</div>
                              <div className={`text-sm px-2 pb-2`}>{item?.message}</div>
                            </div>

                            {/* time */}
                            <span className="text-[11px] p-1 mt-auto text-gray-500 text-right">
                              {
                                new Date(item?.createdAt)
                                  .toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })
                              }

                            </span>
                          </div>
                        }
                        {
                          item?.picture && <div className={`${isOwnMessage ? "bg-violet-100" : "bg-[#f5f2f7]"} rounded-md flex flex-col`}>
                            <div>
                              <div className={`${isOwnMessage ? "mx-1 mt-1" : ""}text-sm font-semibold m-2`}>{item?.sender?._id === ownData?._id ? "" : item?.sender?.f_name}</div>
                            </div>
                            <div className='w-60 m-auto'>
                              <div className='w-full p-1'><img className='w-full h-45 rounded-md' src={item?.picture} alt="msg-pic" /></div>
                            </div>
                            {item?.message && <div>
                              <div className={`text-sm px-2`}>{item?.message}</div>
                            </div>}
                            {/* time */}
                            <span className="text-[11px] pb-1 pr-1 mt-auto text-gray-500 text-right">
                              {
                                new Date(item?.createdAt)
                                  .toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })
                              }
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                  })
                }
              </div>

              {/* Space for typing messages*/}
              <div className='p-2 w-full border-b-2 border-gray-200'>
                <textarea value={msgInp} onChange={(e) => { setMsgInp(e.target.value) }} rows={4} className='bg-gray-200 rounded-xl outline-0 w-full p-3 text-sm' placeholder='Write a message' />
              </div>
              <div className="flex p-3 justify-between">
                <div>
                  <label htmlFor="messageImage" className='cursor-pointer'><InsertPhotoIcon /></label>
                  <input onChange={handleImgUpload} type="file" id="messageImage" className='hidden' />
                </div>
                {
                  loading ? <Box sx={{ display: 'flex' }}>
                    <CircularProgress aria-label="Loading…" />
                  </Box> : <div onClick={handleSendMessage} className='bg-violet-800 text-white px-4 py-1 cursor-pointer rounded-2xl'>
                    Send
                  </div>
                }
              </div>

            </div>
          </div>
        </Card>
      </div>

      {/* Advertisement Card */}
      <div className='w-[25%] hidden md:block sticky top-19'>
        <Advertisement />
      </div>
      <ToastContainer />
    </div>
  )
}

export default Messages
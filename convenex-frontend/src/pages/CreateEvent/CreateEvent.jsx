import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { communityId } = useParams();
    const [step, setStep] = useState(1);
    const [eventData, setEventData] = useState({
        name: "",
        description: "",
        bannerImage: "",
        registrationDeadline: "",
        meetingLink: "",
        startDateTime: "",
        endDateTime: "",
        mode: "online",
        location: "",
        category: "",
        entryFee: 0,
        venueDetails: {
            venueLink: "",
            fullAddress: ""
        }
    });
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [venueDetails, setVenueDetails] = useState({});
    const [fields, setFields] = useState([]);
    const addField = () => {
        setFields([
            ...fields,
            {
                fieldId: crypto.randomUUID(),
                label: "",
                type: "Text",
                required: false,
                options: [],
            },
        ]);
    };
    const updateField = (fieldId, key, value) => {
        setFields(
            fields.map((field) =>
                field.fieldId === fieldId
                    ? {
                        ...field,
                        [key]: value,
                    }
                    : field
            )
        );
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value
        });
    };
    const handleVenueDetails = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            venueDetails: {
                ...eventData.venueDetails,
                [name]: value
            }
        });
    };
    const handleNext = () => {
        if (!eventData.name.trim() || !eventData.description.trim() || !eventData.category.trim() || !eventData.mode.trim() || !eventData.startDateTime || !eventData.endDateTime || !eventData.bannerImage) {
            return toast.error("Please fill all required details!");
        }
        if (new Date(eventData.endDateTime)<=new Date(eventData.startDateTime)) {
            return toast.error("End time must be after start time");
        }
        setStep(2);
    };
    const addTag = () => {
        if (!tagInput.trim()) return;
        setTags([...tags, tagInput]);
        setTagInput("");
    }
    const handleCreateEvent = async () => {
        const invalidField = fields.some((field)=>!field.label.trim()||!field.type);
        if(fields.length===0 || invalidField || !eventData.registrationDeadline){
            return toast.error("Please complete all required fields.");
        }
        const payload = {
            ...eventData,
            tags
        };
        await axios.post(`http://localhost:4000/api/community/${communityId}/createEvent`, { payload, fields }, { withCredentials: true }).then((res) => {
            toast.success("Event created successfully!");
            setTimeout(() => {
                navigate(`/community/${communityId}/events`);
            }, 2000);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
    };
    const connectGoogleCalendar = ()=>{
        try{
            window.location.href = `http://localhost:4000/api/auth/google-calendar/connect?communityId=${communityId}`;
        }catch(err){
            toast.error(err?.response?.data?.error);
        }
    };
    const [user,setUser] = useState(null);
    const fetchUser = async()=>{
        await axios.get("http://localhost:4000/api/auth/self",{withCredentials:true}).then((res)=>{
            setUser(res?.data?.user);
        }).catch((err)=>{
            console.log(err);
            toast.error(err?.response?.data?.error);
        });
        // setUser(localStorage.getItem("userInfo"));
    }
    useEffect(()=>{
        fetchUser()
    },[]);
    // const showMeetingLink = async()=>{

    // }

    return (
        <>
            <div className='bg-[#f5f2f7] p-5 w-full relative'>
                <h1 className="text-4xl text-center font-medium text-purple-900 mb-8">Create Event</h1>
                {
                    step === 1 && <div className="flex flex-col items-center">
                        <div className='w-[60%] mb-6'>
                            <div className='w-full ml-2 mb-2'>Event Name:</div>
                            <input name="name" value={eventData.name} onChange={handleChange} type="text" placeholder="Enter Event Name" id="name" className="bg-white w-full border rounded-xl px-4 py-3" />
                        </div>
                        <div className='w-[60%] mb-6'>
                            <div className='w-full ml-2 mb-2'>Event Banner Image:</div>
                            <input name="bannerImage" value={eventData.bannerImage} onChange={handleChange} type="text" placeholder="Enter Image Link" id="name" className="bg-white w-full border rounded-xl px-4 py-3" />
                        </div>
                        <div className='w-[60%] mb-6'>
                            <div className='w-full ml-2 mb-2'>Event Description:</div>
                            <textarea name="description" value={eventData.description} onChange={handleChange} type="text" placeholder="Enter Event Description" id="desc" className="bg-white w-full border rounded-xl px-4 py-3" />
                        </div>
                        <div className='w-[60%] mb-6'>
                            <div className='w-full ml-2 mb-2'>Event Category:</div>
                            <input name="category" value={eventData.category} onChange={handleChange} type="text" placeholder="Enter Event Category" id="category" className="bg-white w-full border rounded-xl px-4 py-3" />
                        </div>
                        <div className='w-[60%] mb-6'>
                            <div className='w-full ml-2 mb-2'>Event Tag:</div>
                            <div className='flex gap-7'>
                                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} type="text" placeholder="Enter Event Tag" id="tag" className="bg-white w-full border rounded-xl px-4 py-3" />
                                <button onClick={addTag} className="bg-purple-700 text-white px-5 rounded-xl cursor-pointer">Add</button>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-3'>
                            {
                                tags?.map((item, index) => {
                                    return <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm" key={index}>{item}</div>
                                })
                            }
                        </div>
                        <div className='w-[60%] mb-6 flex gap-13'>
                            <div>
                                <div className='ml-2 mb-2'>Event Mode:</div>
                                <div className='ml-2 bg-white px-3 py-2 rounded-2xl border'>
                                    <select name="mode" value={eventData.mode} onChange={handleChange} id="mode">
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </div >
                            <div >
                                <div className='ml-2 mb-2'>Start Date & Start Time:</div>
                                <div className='ml-2 bg-white px-3 py-2 rounded-2xl border'> <input min={new Date().toISOString().slice(0, 16)} name="startDateTime" value={eventData.startDateTime} onChange={handleChange} type="datetime-local" id="start" /></div>
                            </div>
                            <div >
                                <div className='ml-2 mb-2'>End Date & End Time:</div>
                                <div className='ml-2 bg-white px-3 py-2 rounded-2xl border'> <input min={new Date().toISOString().slice(0, 16)} name="endDateTime" value={eventData.endDateTime} onChange={handleChange} type="datetime-local" id="end" /></div>
                            </div>
                        </div>
                        {
                            (eventData?.mode?.toLowerCase() !== "offline") && <div className='w-[60%] mb-6'>
                                <div className='w-full ml-2 mb-2'>For Meeting Link:</div>
                                {
                                    !user?.googleCalendarConnected && <div onClick={connectGoogleCalendar} className='py-2 px-4 w-fit cursor-pointer rounded-2xl bg-blue-100 text-blue-700 shadow-blue-400 shadow-2xs hover:bg-blue-200'>Connect with Google Calendar</div>
                                }
                                {
                                    user?.googleCalendarConnected && <div onClick={connectGoogleCalendar} className='py-2 px-4 w-fit cursor-pointer rounded-md bg-gray-200 '>Google Calendar Connected ✔️</div>
                                }
                                {/* <input name="meetingLink" value={eventData.meetingLink} onChange={handleChange} type="text" placeholder="Enter Meeting Link" id="meetingLink" className="bg-white w-full border rounded-xl px-4 py-3" /> */}
                            </div>
                        }
                        {
                            (eventData?.mode?.toLowerCase() === "offline" || eventData?.mode?.toLowerCase() === "hybrid") && <><div className='w-[60%] mb-6'>
                                <div className='w-full ml-2 mb-2'>Event Location:</div>
                                <input name="location" value={eventData.location} onChange={handleChange} type="text" placeholder="Enter Event Location" id="loc" className="bg-white w-full border rounded-xl px-4 py-3" />
                            </div>
                                <div className='w-[60%] mb-6'>
                                    <div className='w-full ml-2 mb-2'>Venue Details:</div>
                                    <div className='mb-2'><input name="venueLink" value={eventData.venueDetails.venueLink} onChange={handleVenueDetails} type="text" placeholder="Venue Link(Google Map Link)" id="mapLink" className="bg-white w-full border rounded-xl px-4 py-3" /></div>
                                    <div><input name="fullAddress" value={eventData.venueDetails.fullAddress} onChange={handleVenueDetails} type="text" placeholder="Full Address/Street/Building" id="address" className="bg-white w-full border rounded-xl px-4 py-3" /></div>
                                </div>
                            </>
                        }
                        <div className='w-[60%] mb-6'>
                            <div className='w-full ml-2 mb-2'>Entry Fee &#40;Optional&#41;:</div>
                            <input name="entryFee" value={eventData.entryFee} onChange={handleChange} type="text" placeholder="Enter Entry Fee" id="fee" className="bg-white w-full border rounded-xl px-4 py-3" />
                        </div>
                        <button onClick={handleNext} className="bg-purple-700 text-white px-20 py-2 rounded-md font-medium cursor-pointer">Next</button>
                    </div>
                }
                {
                    step === 2 && <>
                        <div className="flex flex-col items-center">
                            <div className='w-[60%] mb-6'>
                                <div className='w-full ml-2 mb-2 font-semibold text-xl'>Registration Form Builder:</div>
                                <button onClick={addField} className="cursor-pointer ml-2 bg-purple-700 text-white px-5 py-2 rounded-xl">+ Add Field</button>
                                {
                                    fields.map((field, index) => {
                                        return <div key={field.fieldId} className="my-3 border rounded-2xl p-5 bg-gray-50">
                                            <div>Field Label:</div>
                                            <input value={field.label} onChange={(e) => updateField(field.fieldId, "label", e.target.value)} type="text" placeholder="Enter Field Label" className="w-full border rounded-xl px-4 py-3 mb-4" />
                                            <div>Field Type:</div>
                                            <select value={field.type} onChange={(e) => updateField(field.fieldId, "type", e.target.value)} type="text" placeholder="Field Type" className="w-full border rounded-xl px-4 py-3 mb-4">
                                                <option value="Text">Text</option>
                                                <option value="Textarea">Textarea</option>
                                                <option value="Email">Email</option>
                                                <option value="Number">Number</option>
                                                <option value="Select">Select</option>
                                            </select>
                                            {field.type === "Select" && (
                                                <input
                                                    type="text"
                                                    placeholder="Comma separated options"
                                                    onChange={(e) =>
                                                        updateField(
                                                            field.fieldId,
                                                            "options",
                                                            e.target.value.split(",")
                                                        )
                                                    }
                                                    className="w-full border rounded-xl px-4 py-3 mb-4"
                                                />
                                            )}
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={field.required}
                                                    onChange={(e) =>
                                                        updateField(
                                                            field.fieldId,
                                                            "required",
                                                            e.target.checked
                                                        )
                                                    }
                                                />

                                                Is it a Required Field ?
                                            </label>
                                        </div>

                                    })
                                }
                                <div className='w-[60%] mb-6'>
                                    <div className='w-full ml-2 mb-2'>Registration Deadline:</div>
                                    <input min={new Date().toISOString().slice(0, 16)} name="registrationDeadline" value={eventData.registrationDeadline} onChange={handleChange} type="datetime-local" id="registrationDeadline" className="bg-white w-full border rounded-xl px-4 py-3" />
                                </div>
                            </div>

                        </div>
                        <button onClick={handleCreateEvent} className="mt-8 ml-60 bg-green-600 text-white px-8 py-2 rounded-xl cursor-pointer">Publish Event</button>
                    </>
                }
                <ToastContainer />
            </div>
        </>
    )
}

export default CreateEvent
import Card from '../Card/Card.jsx'
import React from 'react'
import { Link } from 'react-router-dom'

const ProfileCard = (props) => {
    // console.log(props);
    return (
        <Card padding={0}>
            <Link to={`/profile/${props?.data?._id}`} className='relative'>
                <div className='relative w-full h-26 rounded-md'>
                    <img className='w-full h-full rounded-t-md cursor-pointer' src={props?.data?.coverPic} alt="banner-logo" />
                </div>
                <div className='absolute top-14 left-6 z-10'>
                    <img className='w-16 h-16 cursor-pointer border-2 border-white rounded-4xl' src={props?.data?.profilePic} alt="" />
                </div>
                <div className='py-9 px-6'>
                    <div className='text-md font-semibold'>{props?.data?.f_name}</div>
                    <div className='text-sm my-1'>{props?.data?.headline}</div>
                    <div className='text-sm my-1'>{props?.data?.curr_location}</div>
                    <div className='text-sm my-1'>{props?.data?.curr_company}</div>
                </div>
            </Link>
        </Card>
    )
}

export default ProfileCard

// const ProfileCard = (props) => {
//     return (
//         <Card padding={0}>
//             <div className='relative'>
//                 <div className='relative w-full h-22 rounded-md'>
//                     <img className='rounded-t-md cursor-pointer' src="https://wallpapers.com/images/hd/technology-linkedin-background-dce01jsbpnn0z2ej.jpg" alt="banner-logo" />
//                 </div>
//                 <div className='absolute top-14 left-6 z-10'>
//                     <img className='w-16 h-16 cursor-pointer border-2 border-white rounded-4xl' src="https://i.pinimg.com/564x/a9/75/93/a975934bb378afc4ca8c133df451f56e.jpg" alt="" />
//                 </div>
//                 <div className='py-9 px-6'>
//                     <div className='text-md font-semibold'>Roselle Green</div>
//                     <div className='text-sm my-1'>@Google Software Eng</div>
//                     <div className='text-sm my-1'>Bangalore, India</div>
//                     <div className='text-sm my-1'>Google</div>
//                 </div>
//             </div>
//         </Card>
//     )
// }

// export default ProfileCard
import React from 'react'

const Footer = () => {
    return (
        <div className="bg-[#dfdae6] py-2.5 flex flex-col items-center">
            <div className='flex gap-1 items-center'>
                <div className='text-violet-800 font-semibold'>ConveneX</div>
                <img className='w-4 h-4' src="/img/logo.png" alt="linked-logo" />
            </div>
            <div className='text-sm'>@Copyright 2025</div>
        </div>
    )
}

export default Footer
import React from 'react'
import {Link} from 'react-router-dom'

function Navbar1() {
    return (
        <div>
            <nav className='w-full bg-gray-100 md:px-10 px-5 flex justify-between py-4 box-border'>
                <Link to={"/"} className="flex gap-1 cursor-pointer items-center">
                    <h3 className='text-3xl font-bold text-[#6f25be]'>ConveneX</h3>
                    <img className='w-7 h-7' src="/img/logo.png" alt="logo" />
                </Link>
                <div className="flex gap-2 items-center">
                    <Link to={"/signup"} className='md:px-4 md:py-2 text-xl rounded-3xl hover:bg-gray-200 cursor-pointer'>Join now</Link>
                    <Link to={"/login"} className='md:px-4 md:py-2 text-xl rounded-3xl text-violet-800 border border-violet-800  hover:bg-violet-50 cursor-pointer'>Sign in</Link>
                </div>
            </nav>
        </div>
    )
}

export default Navbar1
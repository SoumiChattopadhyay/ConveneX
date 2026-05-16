import React from 'react'
import { Link } from 'react-router-dom'
import GoogleLoginComp from '../../components/GoogleLogin/GoogleLoginComp'

const LandingPage = (props) => {
    return (
        <div className='my-4 pt-12.5 px-5 md:pl-10 md:flex justify-between'>
            <div className='md:w-[50%]'>
                <div className='mx-auto text-4xl text-gray-500'>Welcome To Your Professional Community</div>
                {/* <div className='flex gap-2 justify-center items-center hover:bg-gray-100 mx-auto mt-10 py-2 px-2 w-[70%] border cursor-pointer'>
                    <img className='w-4.5 h-4.5' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/960px-Google_%22G%22_logo.svg.png" alt="google-logo" />
                    <div>Sign in with Google</div>
                </div> */}
                <div className='mt-10 mx-auto w-[70%]'>
                    <GoogleLoginComp changeLoginValue={props.changeLoginValue}/>
                </div>
                <Link to={"/login"} className='flex items-center justify-center hover:bg-gray-100 mx-auto my-4 py-2 px-2 border-2 w-[70%] rounded-3xl cursor-pointer'>Sign in with email</Link>
                <div className='mx-auto mb-5 text-sm w-[70%] mt-8 cursor-pointer'>By clicking Continue to join or sign in, you agree to <span className='text-violet-800 hover:underline cursor-pointer'>ConveneX's User Agreement</span>, <span className='text-violet-800 hover:underline cursor-pointer'>Privacy Policy</span> and <span className='text-violet-800 hover:underline cursor-pointer'>Cookie Policy</span>.</div>
                <div className='text-center text-xl py-2'>New to ConveneX? <Link to={"/signup"} className='text-violet-800 hover:underline cursor-pointer'>Join now</Link></div>
            </div>
            <div className='md:w-[50%] h-120'>
                <img className='w-full' src="https://static.vecteezy.com/system/resources/previews/003/216/584/non_2x/business-team-working-together-in-office-with-financial-icons-free-vector.jpg" alt="landing-page-logo" />
            </div>
        </div>
    )
}

export default LandingPage
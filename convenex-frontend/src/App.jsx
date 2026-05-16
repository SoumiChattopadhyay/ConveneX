import './App.css'
import Footer from './components/Footer/Footer.jsx'
import Navbar1 from './components/NavbarV1/Navbar1.jsx'
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import { Navigate, Routes, Route } from 'react-router-dom'
import Signup from './pages/SignUp/Signup.jsx'
import Login from './pages/LogIn/Login.jsx'
import Navbar2 from './components/NavbarV2/Navbar2.jsx'
import Feeds from './pages/Feeds/Feeds.jsx'
import MyNetwork from './pages/MyNetwork/MyNetwork.jsx'
import Resume from './pages/Resume/Resume.jsx'
import Messages from './pages/Messages/Messages.jsx'
import Profile from './pages/Profile/Profile.jsx'
import AllActivities from './pages/AllActivities/AllActivities.jsx'
import Activity from './pages/Activity/Activity.jsx'
import Notifications from './pages/Notifications/Notifications.jsx'
import { useEffect, useState } from 'react'

function App() {
  const [isLogin,setIsLogin] = useState(localStorage.getItem('isLogin'));
  const changeLoginValue = (val)=>{
    setIsLogin(val);
  };
  return (
    <div className='min-h-screen flex flex-col'>
      {isLogin?<Navbar2/>:<Navbar1 />}
      {/* Main Content */}
      <div className="grow">
        <Routes>
          <Route path="/" element={isLogin?<Navigate to={"/feeds"}/>:<LandingPage changeLoginValue={changeLoginValue} />} />
          <Route path="/signup" element={isLogin?<Navigate to={"/feeds"}/>:<Signup changeLoginValue={changeLoginValue} />} />
          <Route path="/login" element={isLogin?<Navigate to={"/feeds"}/>:<Login changeLoginValue={changeLoginValue} />} /> {/* passing the function changeLoginValue as props to child component*/}
          <Route path="/feeds" element={isLogin?<Feeds/>:<Navigate to={"/login"}/>} />
          <Route path='/myNetwork' element={isLogin?<MyNetwork/>:<Navigate to={"/login"}/>}/>
          <Route path='/resume' element={isLogin?<Resume/>:<Navigate to={"/login"}/>}/>
          <Route path='/messages' element={isLogin?<Messages/>:<Navigate to={"/login"}/>}/>
          <Route path='/profile/:id' element={isLogin?<Profile/>:<Navigate to={"/login"}/>}/>
          <Route path='/profile/:id/activities' element={isLogin?<AllActivities/>:<Navigate to={"/login"}/>}/>
          <Route path='/profile/:id/activity/:postId' element={isLogin?<Activity/>:<Navigate to={"/login"}/>}/>
          <Route path='/notifications' element={isLogin?<Notifications/>:<Navigate to={"/login"}/>}/>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App

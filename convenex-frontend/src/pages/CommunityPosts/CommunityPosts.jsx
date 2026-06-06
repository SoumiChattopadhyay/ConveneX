import React from 'react'

const CommunityPosts = () => {
  return (
    <div className='px-5 py-2 xl:px-50 flex gap-4 w-full bg-[#f5f2f7]'>
      
      {/* Left side */}
      <div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
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

export default CommunityPosts
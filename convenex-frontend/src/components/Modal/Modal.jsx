import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';

const Modal = (props) => {
  return (
    <div className='bg-black/50 flex justify-center items-center fixed inset-0 w-full h-full z-20'>
      <div className='relative bg-white w-120 h-80 overflow-y-auto rounded-lg p-3'>
          <div onClick={()=>props.closeModal()} className='absolute right-2 z-50 cursor-pointer'><CloseIcon/></div>
          {props.children}
      </div>
    </div>
  )
}

export default Modal
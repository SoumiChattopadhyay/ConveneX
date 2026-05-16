import React from 'react'

const Card = (props) => {
  return (
    <div className={`${props.padding?"p-5":"p-0"} w-full h-full mb-5 bg-white flex flex-col border border-gray-300 rounded-md`}>
        {props.children}
    </div>
  )
}

export default Card
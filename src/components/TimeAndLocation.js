import React from 'react'

const TimeAndLocation = ({time,name,country}) => {
  console.log(name,country)
  return (
    <div className='borde'>
        <div className='flex  items-center justify-center '>
            <p className='text-xl font-extralight'>{time}</p>
        </div>
        <div className='flex  items-center justify-center my-3'>
            <p className='text-3xl font-medium'> {name} , {country}</p> 
        </div>
    </div>
  )
}

export default TimeAndLocation
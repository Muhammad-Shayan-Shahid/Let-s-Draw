import React from 'react'


const Nav = () => {
  return (
    <div className='bg-neutral-800 h-20 flex items-center justify-around text-2xl'>
        <div className='text-white rounded-2xl bg-green-700 px-4 py-3'>Write</div>
        <div className='text-white rounded-2xl bg-green-700 px-4 py-3'>Shapes</div>
        <div className='text-white rounded-2xl bg-green-700 px-4 py-3'>Freedraw</div>
    </div>
  )
}

export default Nav
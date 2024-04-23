import React from 'react'
import {Link} from 'react-router-dom'
import { useAuthContext } from '../Hooks/useAuthContext'
function Home() {
  const {user} = useAuthContext()
  return (
    <>
    <div className='min-h-screen flex flex-col justify-center items-center bg-HomeBg'>
    <section>
      <div className='flex flex-col justify-center items-center text-white'>
        <h1 className='text-5xl font-semibold '>Organise your Work & Life</h1>
        <div className='text-center font-medium text-2xl mt-3'>
        <p>Become Focused, Organized and Calm with ToDo.</p>
        <p className='mt-2'>The World's #1 Task Manager</p>
        </div>
      </div>
    </section>
    {!user ? (<Link to="/signup">
    <button className='bg-orange-600 text-white px-3 py-2 rounded-lg mt-3 text-2xl hover:bg-orange-500'>Get Started</button>
    </Link>): 
    (<Link to="/create">
    <button className='bg-orange-600 text-white px-3 py-2 rounded-lg mt-3 text-2xl hover:bg-orange-500'>Add a ToDo</button>
    </Link>)
    }
    </div>
    </>
  )
}

export default Home
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns';
import Button from "../components/Button"
import { FaHome,FaUserAlt } from "react-icons/fa";

const Profile = () => {

  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate();

  return (
    <section className='flex flex-col gap-y-3 mt-9 shadow-lg shadow-blue-300 border p-10 rounded-lg  bg-opacity-90 backdrop-blur-lg'>
      <h1 className='text-2xl md:text-4xl text-black font-light' >My Profile</h1>
      <div className='w-full  py-5 px-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-base md:text-xl  border rounded-lg'>
        <h2>Username : <span className='font-bold'>{user.username}</span></h2>
        <p>Email : <span className='font-bold'>{user.email}</span></p>
        <p>Account active since : <span className='font-bold'>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) }</span></p>
        <p>Joined on: <span className='font-bold'>{Date(user.createdAt)}</span></p>
        <p>Role : <span className='font-bold'>{user.role}</span></p>
      </div>

      <div className='w-full min-h-[50vh] grid place-content-center justify-center items-center flex'>
          
          <Button onClick={() => navigate('/')} className='w-max flex gap-3 items-center py-2'>
            <FaHome /> Return to Home
          </Button>
          <Button onClick={() => navigate('/dashboard/userlookup')} className='w-max flex gap-3 items-centerpy-2 mt-5' > <FaUserAlt />User Lookup</Button>
          {user.role==="admin"?(
            <div>
            <Button onClick={() => navigate('/dashboard/usermanagemnt')} className='w-max flex gap-3 items-centerpy-2 mt-5' > <FaUserAlt />User Management</Button>
           
            </div>
          ):
          null}
      </div>
      


    </section>
  )
}

export default Profile
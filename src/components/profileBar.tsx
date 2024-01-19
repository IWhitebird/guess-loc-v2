import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmailLogout } from '../supabase/Auth';
import { IoMdArrowDropdown } from "react-icons/io";

const Dashboard = () => {
  const location = useNavigate()
  const [dropdown, setDropdown] = useState(false);
  const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');

  const dropdownHandle = () => {
    setDropdown(!dropdown);
  }

  const handelLogout = () => {
    EmailLogout();
    location('/')
  }

  return (
    <div className='pt-5 transition-all duration-300 ease-in-out relative'>
      <div className='flex gap-3 bg-[#ffffffa3] p-1 px-2 h-1/2 rounded-2xl z-50 cursor-pointer' onClick={dropdownHandle}>
        <img
          className='rounded-full'
          src={loggedIN?.user?.user_metadata?.avatar_url ? loggedIN?.user?.user_metadata?.avatar_url : `https://api.dicebear.com/6.x/personas/svg?seed=${loggedIN?.user?.user_metadata?.full_name}`}
          alt="profile"
        />
        <div className='flex items-center justify-center'>
          <p className='text-2xl font-bold'>{loggedIN.user.user_metadata.full_name.split(' ')[0]}</p>
          <IoMdArrowDropdown className={`duration-200 text-3xl mt-1`}
            style={{ transform: dropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </div>
      <div className={`transition-all ease-in-out duration-300 z-0 ${dropdown ? 'top-32 z-50' : 'top-9 invisible opacity-0'}
     absolute p-4 right-0 w-full rounded-lg shadow-lg bg-[rgba(255,255,255,0.8)] backdrop-blur-lg`} >
        <div className='p-2 flex flex-col gap-5'>
          <p className='text-2xl'>Max: </p>
          <Link to='/mode'>
            <p className='text-2xl'>Select Mode</p>
          </Link>
          <p className='text-2xl'>Profile</p>
          <p className='text-2xl'>Settings</p>
          <hr className='my-2 border-gray-500' />
          <p
            className='text-2xl px-1 cursor-pointer text-red-400'
            onClick={handelLogout}
          >
            Logout
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
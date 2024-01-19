import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmailLogout } from '../supabase/Auth';

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
    <div className='absolute top-3 right-1 transition-all duration-300 ease-in-out z-50'>
      <div className='bg-[#ffffffa3] w-[100px] h-[100px] rounded-full scale-[0.65]'>

        <div>
          <input type='checkbox' onClick={dropdownHandle} className='absolute cursor-pointer rounded-full opacity-0 w-[100px] h-[100px]' />
          <img
            className='rounded-full'
            src={loggedIN?.user?.user_metadata?.avatar_url ? loggedIN?.user?.user_metadata?.avatar_url : `https://api.dicebear.com/6.x/personas/svg?seed=${loggedIN?.user?.user_metadata?.full_name}`}
            alt="profile"
            width="100"
            height="100"
          />
        </div>

        <div
          className={`${dropdown ? 'block' : 'hidden'
            } absolute p-4 right-0 mt-2 w-[300px] rounded-md shadow-lg bg-white`} >
          <div className='p-4'>
            <div className='flex justify-between items-center'>
              <p className='text-4xl font-bold'>{loggedIN.user.user_metadata.full_name}</p>
              <p className="text-4xl cursor-pointer transition-all ease-in-out hover:scale-125 mb-2" onClick={dropdownHandle}>X</p>
            </div>
            <hr className='my-2' />
            <p className='text-4xl mt-10 mb-10'>Max: </p>
            <Link to='/mode'>
              <p className='text-4xl mb-10'>Select Mode</p>
            </Link>
            <p className='text-4xl mb-10'>Profile</p>
            <p className='text-4xl mb-10'>Settings</p>
            <hr className='my-2' />
            <p
              className='text-4xl px-1 cursor-pointer text-red-400'
              onClick={handelLogout}
            >
              Logout
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
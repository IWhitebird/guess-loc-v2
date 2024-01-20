import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmailLogout } from '../supabase/Auth';
import { IoMdArrowDropdown } from "react-icons/io";
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useNavigate()
  const location2 = useLocation()
  const [dropdown, setDropdown] = useState(false);
  const [modal, setModal] = useState(false);

  const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');
  const [profileURL] = useState<string>(loggedIN?.user?.user_metadata?.avatar_url ? loggedIN?.user?.user_metadata?.avatar_url : `https://api.dicebear.com/6.x/personas/svg?seed=${loggedIN?.user?.user_metadata?.full_name}`);


  const dropdownHandle = () => {
    setDropdown(!dropdown);
  }

  const handelLogout = () => {
    EmailLogout();
    location('/')
  }

  const style = 'flex gap-3 relative bg-[rgba(168,85,247,0.3)] hover:bg-[rgba(168,85,247,0.4)] duration-300 border-2 border-purple-500 text-white p-1 px-2 rounded-2xl z-50'

  return (
    <div className=''>
      <div className={`absolute duration-300 ${location2.pathname === '/spGame' && modal ? 'opacity-100' : 'opacity-0 invisible'} z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md '}`}>
        <div className={`bg-[rgba(30,30,30,0.5)] text-2xl duration-300 text-white border border-gray-700 p-5 rounded-xl ${modal ? 'scale-100 opacity-100' : 'scale-50 opacity-0 invisible'}`}>
          Are you sure you want to return to main menu?<br />
          Your progress will be lost.
          <div className='flex justify-end gap-3'>
            <button className='bg-purple-900 hover:bg-purple-950 duration-300 text-white px-3 py-1 rounded-lg' onClick={() => window.location.href = "/mode"}>Yes</button>
            <button className='bg-purple-900 hover:bg-purple-950 duration-300 text-white px-3 py-1 rounded-lg' onClick={() => setModal(!modal)}>No</button>
          </div>
        </div>
      </div>

      <div className='absolute right-0 flex justify-end p-5 transition-all z-50 duration-300 ease-in-out'>
        <div className={style} onClick={dropdownHandle}>
          <img
            className='rounded-full'
            src={profileURL}
            alt="profile"
            width="60"
          />
          <div className='flex items-center justify-center'>
            <p className='text-xl font-bold'>{loggedIN.user.user_metadata.full_name.split(' ')[0]}</p>
            <IoMdArrowDropdown className={`duration-200 text-3xl mt-1`}
              style={{ transform: dropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>
          <div className={`transition-all bg-[rgba(30,30,30,0.3)] border-gray-500 border backdrop-blur-3xl ease-in-out duration-300 z-0 ${dropdown ? 'top-20 z-50' : 'top-0 invisible opacity-0'}
     absolute p-2 right-0 w-full rounded-lg shadow-lg text-white`} >
            <div className='flex flex-col gap-3 p-2 text-xl'>
              <div className='cursor-pointer'>
                {location2.pathname === "/spGame" ? <p onClick={() => setModal(true)}>Main Menu</p> : <p onClick={() => location('/mode')}>Main Menu</p>}
              </div>
              <p className='cursor-pointer' onClick={() => location('/profile')}>Profile</p>
              <p className=''>Settings</p>
              <hr className=' border-gray-200' />
              <p
                className=' text-red-400 cursor-pointer'
                onClick={handelLogout}>
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
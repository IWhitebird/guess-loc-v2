import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailLogout } from '../supabase/Auth';
import { IoMdArrowDropdown, IoMdNotifications } from "react-icons/io";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { IoNotificationsCircleOutline, IoNotificationsSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { BiNotification } from 'react-icons/bi';
import { CgNotifications } from 'react-icons/cg';

interface Props {
  setFriendModal: (visible: boolean) => void;
  visible: boolean;
  audioSettings: boolean;
  setAudioSettings: (audioSettings: boolean) => void;
  setNotifModal: (visible: boolean) => void;
  receivedNotif: boolean
  setReceivedNotif: (receivedNotif: boolean) => void
}

const Dashboard = ({ setFriendModal, visible, audioSettings, setAudioSettings, setNotifModal, receivedNotif, setReceivedNotif }: Props) => {
  const location = useNavigate()
  const location2 = useLocation()
  const { user_name, user_profile_pic } = useSelector((state: RootState) => state.user)
  const [dropdown, setDropdown] = useState(false);
  const [modal, setModal] = useState(false);
  const menubar = useRef<HTMLDivElement>(null);

  const dropdownHandle = () => {
    setDropdown(!dropdown);
  }

  const handelLogout = async () => {
    const logout = await EmailLogout();
    if (logout) {
      localStorage.removeItem('sb-pdnogztwriouxeskllgm-auth-token');
      localStorage.removeItem('custom_room_details')
      window.location.href = "/";
    }
  }

  function handleYes() {
    setModal(false);
    setDropdown(false);
    location('/mode')
  }

  function handleClick() {
    setNotifModal(true)
    setReceivedNotif(false)
  }

  useEffect(() => {
    const handleOutsideClick = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdown(false);
      }
    }
    window.addEventListener('keydown', handleOutsideClick);

    return () => {
      window.removeEventListener('keydown', handleOutsideClick);
    };
  }, [])

  const style = 'flex gap-3 cursor-pointer relative bg-gradient-to-r from-purple-950 to-fuchsia-800 duration-300 border-2 border-purple-800 hover:border-purple-500 text-white p-1 px-2 rounded-2xl z-50'

  return (
    <div className=''>
      <div className={`fixed duration-300 ${location2.pathname === '/spGame' && modal ? 'opacity-100' : 'opacity-0 invisible'} z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md '}`}>
        <div className={`bg-[rgba(30,30,30,0.5)] text-2xl duration-300 text-white border border-gray-700 p-5 rounded-xl ${modal ? 'scale-100 opacity-100' : 'scale-50 opacity-0 invisible'}`}>
          Are you sure you want to return to main menu?<br />
          Your progress will be lost.
          <div className='flex justify-end gap-3'>
            <button className='px-3 py-1 text-white duration-300 bg-purple-900 rounded-lg hover:bg-purple-950' onClick={() => handleYes()}>Yes</button>
            <button className='px-3 py-1 text-white duration-300 bg-purple-900 rounded-lg hover:bg-purple-950' onClick={() => setModal(!modal)}>No</button>
          </div>
        </div>
      </div>

      <p className='fixed bottom-5 left-5 z-50 text-white p-2'>
        <IoSettings className='cursor-pointer duration-500 hover:rotate-180 hover:bg-[rgba(30,30,30,0.2)] z-50 border-2 border-gray-600 w-12 h-12 p-2 text-white backdrop-blur-sm rounded-full' onClick={() => setAudioSettings(!audioSettings)} />
      </p>

      <div className='absolute flex items-center right-0 z-50 p-5 transition-all duration-300 ease-in-out' ref={menubar}>
        <div className='flex relative gap-1'>
          <button id='fn_button' className='relative z-50' style={{ padding: '0rem 0.75rem', border: 'none', backgroundColor: 'rgba(50,50,50,0.5)' }} onClick={() => setFriendModal(!visible)}>
            <FaUserFriends className='text-4xl' />
          </button>
          <button id='fn_button' className='relative z-50' style={{ padding: '0.3rem 0.75rem', border: 'none', backgroundColor: 'rgba(50,50,50,0.5)' }} onClick={() => handleClick()}>
            <IoMdNotifications className='text-4xl' />
          </button>
          <p className={`absolute right-3 z-50 px-2 text-sm shadow-xl text-white ${receivedNotif ? 'opacity-100' : 'opacity-0 invisible'} 
          cursor-pointer bg-[rgba(255,0,0,0.8)] animate-pulse rounded-full`}
            onClick={handleClick}>{receivedNotif ? '!' : ''}</p>
        </div>

        <div className='flex items-center justify-center mr-6'>
        </div>
        <div className={style} onClick={dropdownHandle}>
          <img
            className='rounded-full'
            src={user_profile_pic}
            alt="profile"
            width="60"
          />
          <div className='flex items-center justify-center'>
            <p className='text-xl font-bold'>{user_name.length > 15 ? (user_name.split(' ')[0]).slice(0, 10) + '...' : user_name.split(' ')[0]}</p>
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
              <p className='cursor-pointer' onClick={() => setAudioSettings(!audioSettings)}>Settings</p>
              <hr className='border-gray-200 ' />
              <p
                className='text-red-400 cursor-pointer '
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
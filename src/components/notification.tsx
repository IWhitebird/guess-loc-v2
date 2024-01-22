import { IoNotifications, IoSearchOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { getIncomingFriendRequests } from '../supabase/Routes/FriendRoutes';
import { FaChevronCircleRight } from "react-icons/fa";
import { useState } from 'react';
import Loader from "./Loader";

const Notification = () => {
  const { user_id } = useSelector((state: RootState) => state.user)
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState([]);

  const handleNotifiy = async () => {
    setVisible(true);
    const data = await getIncomingFriendRequests(user_id)
    setNotification(data);
    console.log(data);
  }
  return (
    <div>
      <IoNotifications className=' bg-[rgba(168,85,247,0.3)] hover:bg-[rgba(168,85,247,0.4)] border-2 border-purple-500 w-16 h-16 p-2 text-white backdrop-blur-sm rounded-lg' onClick={handleNotifiy} />
      <div className={`fixed duration-300 text-white shadow-3xl ease-in-out top-0 right-0 flex text-2xl h-screen w-[550px] z-50 items-center backdrop-blur-3xl bg-[rgba(0,0,0,0.5)] ${visible ? 'opacity-100' : 'opacity-0 invisible right-[-500px]'}`}>
        <div className='flex absolute px-7 py-9 justify-between items-center w-full top-0 z-50 bg-[rgba(176,80,255,0.1)] backdrop-blur-3xl '>
          <p className='text-3xl'>Notifications</p>
          <div className='absolute flex items-center gap-3 right-52'>
            <button className='w-[20px] h-[20px]' id='fn_button'
              style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }} onClick={() => setVisible(false)}
            ><p><FaChevronCircleRight /></p><span id='fnButtonSpan'></span></button>
          </div>
        </div>
        <div className='flex flex-col w-full h-full p-6 pt-32 pb-0 pr-6 overflow-y-auto'>
          {loading && <Loader />}
          {notification.map((item, index) => (
            <div key={index}>
        
              <div className='relative flex items-center gap-3 '>
                <img className='rounded-full' src={item?.user_pfp ? item?.user_pfp : `https://api.dicebear.com/6.x/personas/svg?seed=${item.user_name}`} alt='avatar' width='60' height='60' />
                <div className='flex flex-col'>
                  <h1>{item.user_name}</h1>
                  <p className='text-sm text-gray-400'>Sent you a friend request</p>
                </div>
              </div>
              <hr className="w-full my-4"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notification;
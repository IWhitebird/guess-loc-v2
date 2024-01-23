import { IoNotificationsCircleOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { getIncomingFriendRequests } from '../supabase/Routes/FriendRoutes';
import { FaChevronCircleRight } from "react-icons/fa";
import { useState, useEffect } from 'react';
import Loader from "./Loader";
import supabase from "../supabase/init"

interface props {
  handleState: string
  setHandleState: (handleState: string) => void
  friendModal: boolean
  setFriendModal: (friendModal: boolean) => void
  visible: boolean
  setVisible: (visible: boolean) => void
  receivedNotif: boolean
  setReceivedNotif: (receivedNotif: boolean) => void
}

const Notification = ({ visible, setHandleState, setVisible, setFriendModal, receivedNotif, setReceivedNotif }: props) => {
  const { user_id } = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setVisible(false);
      }
    })

  }, [])

  function setRedirect() {
    setHandleState('requests');
    setFriendModal(true);
    setVisible(false);
  }

  supabase.channel(`notif_${user_id}`).on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'users',
      filter: `id=eq.${user_id}`
    },
    payload => {
      console.log(payload)
      getNotifications();
    }
  ).subscribe()

  useEffect(() => {
    getNotifications();
  }, [])

  const getNotifications = async () => {
    setLoading(true);
    const data = await getIncomingFriendRequests(user_id)
    setReceivedNotif(data.length > 0 ? true : false);
    setNotification(data);
    setLoading(false);
  }

  return (
    <div>
      <div className={`fixed duration-300 text-white shadow-3xl ease-in-out top-0 right-0 flex text-2xl h-screen w-[550px] z-50 items-center backdrop-blur-3xl bg-[rgba(0,0,0,0.5)] ${visible ? 'opacity-100' : 'opacity-0 invisible right-[-500px]'}`} >
        <p className='fixed flex items-center justify-end w-full text-base text-gray-500 bottom-2 right-3'>Press <span className='border text-base border-gray-500 rounded-lg p-0.5 mx-1'>Esc</span> to close</p>
        <div className='flex absolute px-7 py-9 justify-between items-center w-full top-0 bg-[rgba(176,80,255,0.1)] backdrop-blur-3xl '>
          <p className='text-3xl'>Notifications</p>
          <div className='flex items-center gap-3'>
            <button className='w-[20px] h-[20px]' id='fn_button'
              style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }} onClick={() => setVisible(false)}
            ><p><FaChevronCircleRight /></p><span id='fnButtonSpan'></span></button>
          </div>
        </div>
        <div className='flex flex-col w-full h-full p-6 pt-32 pb-0 pr-6 overflow-y-auto'>
          {loading ? <Loader /> : notification.length > 0 ? notification.map((item: any, index: any) => (
            <>
              <div className="flex justify-between w-full items-center" key={index}>
                <div className='relative flex items-center gap-3 '>
                  <img className='rounded-full' src={item?.user_pfp ? item?.user_pfp : `https://api.dicebear.com/6.x/personas/svg?seed=${item.user_name}`} alt='avatar' width='60' height='60' />
                  <div className='flex flex-col'>
                    <h1>{item.user_name}</h1>
                    <p className='text-sm text-gray-400'>Sent you a friend request</p>
                  </div>
                </div>
                <button className='w-[20px] h-[20px]' id='fn_button'
                  style={{ fontSize: '1.3rem', padding: '1.3rem 2.8rem' }} onClick={() => setRedirect()}>View</button>
              </div>
              <hr className="w-full my-4" />
            </>
          )) : <p className='flex flex-col w-full h-full items-center justify-center text-2xl'>No notifications</p>}
        </div>
      </div>
    </div>
  )
}

export default Notification;
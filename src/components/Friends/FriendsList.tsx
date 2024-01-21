import { useState, useEffect } from 'react';
import FriendSearch from './FriendSearch';
import { IoSearchOutline } from "react-icons/io5";
import { FaChevronCircleRight, FaChevronCircleDown } from "react-icons/fa";
import { getFriends,acceptFriendRequest,sendFriendRequest } from '../../supabase/Routes/FriendRoutes'
import { useLocation } from 'react-router-dom';
import Loader from '../Loader';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export default function FriendsList({ visible, setVisible }: Props) {
    const location = useLocation();
    const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');
    const [searchModal, setSearchModal] = useState<boolean>(false);
    const [menu, setMenu] = useState({ visible: false, id: '' });
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const hanldeCloseModalBoth = () => {
        setVisible(false);
        setSearchModal(false);
    }

    const fetchFriends = async () => {
        setLoading(true);
        const data = await getFriends(loggedIN.user.id);
        setFriends(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchFriends();
    }, [])

    useEffect(() => {
        addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hanldeCloseModalBoth();
            }
        })
    }, [])

    return (
        <>
            {/* Search modal for searching friends */}
            <FriendSearch visible={searchModal} setVisible={setSearchModal} />

            <div className={`fixed duration-300 text-white shadow-3xl ease-in-out top-0 right-0 flex text-2xl h-screen w-[500px] z-50 items-center backdrop-blur-3xl bg-[rgba(0,0,0,0.5)] ${visible ? 'opacity-100' : 'opacity-0 invisible right-[-500px]'}`}>
                <div className='flex absolute px-7 pb-4 pt-5 justify-between items-center w-full top-0 z-50 bg-[rgba(176,80,255,0.1)] backdrop-blur-3xl '>
                    <p className='text-3xl'>Friend list</p>
                    <div className='flex items-center gap-3'>
                        <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => setSearchModal(true)}
                            style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }}
                        ><p><IoSearchOutline /></p><span id='fnButtonSpan'></span></button>
                        <button className='w-[20px] h-[20px]' id='fn_button' onClick={hanldeCloseModalBoth}
                            style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }}
                        ><p><FaChevronCircleRight /></p><span id='fnButtonSpan'></span></button>
                    </div>
                </div>

                <div className='flex flex-col w-full h-full p-6 pt-24 pb-0 pr-0 overflow-y-auto'>
                    {loading && <Loader />}
                    {friends.length > 0 ? friends.map((friend, index) => (
                        <ul className='flex flex-col gap-5 pb-5' id='style-3' key={index}>
                            <li className='flex items-center justify-between w-full'>
                                <div className='relative flex items-center gap-3'>
                                    <img className='rounded-full' src={friend?.user_pfp ? friend?.user_pfp : `https://api.dicebear.com/6.x/personas/svg?seed=${friend.user_name}`} alt='avatar' width='60' height='60' />
                                    <div className='absolute bottom-0 w-5 h-5 bg-green-500 border border-white rounded-full left-5'></div> {/* online change left to left-10 */}
                                    <div className='absolute bottom-0 w-5 h-5 bg-gray-700 border border-white rounded-full left-10'></div> {/* offline indicator */}
                                    <div className='flex flex-col'>
                                        <p>{friend.user_name}</p>
                                        <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                                    </div>
                                </div>

                                {/* dropdown */}
                                <div className={`flex items-center gap-3 pr-8 relative`}>
                                    <p
                                        className={`cursor-pointer duration-300 ${menu.visible && menu.id === friend.id && 'rotate-180'}`}
                                        onClick={() => setMenu(prevMenu => ({ visible: !prevMenu.visible || prevMenu.id !== friend.id, id: prevMenu.visible ? null : friend.id }))}>
                                        <FaChevronCircleDown />
                                    </p>
                                    <div className={`absolute overflow-hidden ease-in-out duration-300 ${menu.id === friend.id ? 'opacity-100 h-[150px] w-[160px] ' : 'opacity-0 invisible h-0 w-0'} flex z-50 justify-center items-center top-8 right-8 bg-[rgba(0,0,0,0.1)] backdrop-blur-lg p-5 rounded-2xl`}>
                                        <ul className={`flex flex-col cursor-pointer duration-300 gap-3 ${menu.id === friend.id && menu.visible ? 'opacity-100' : 'opacity-0 invisible'}`}>
                                            <li className={`duration-300 hover:text-gray-500 ${location.pathname.startsWith('/customroom/') ? 'cursor-pointer' : 'cursor-not-allowed text-gray-500'}`}>Invite</li>
                                            <li className='duration-300 hover:text-gray-500'>Messaage</li>
                                            <li className='duration-300 hover:text-gray-500'>Remove</li>
                                        </ul>
                                    </div>
                                </div>

                            </li>
                            <hr className='mr-5 border' />
                        </ul>
                    )) : <p className='flex items-center justify-center w-full h-full text-gray-400'>{loading ? '' : 'No friends found'}</p>}
                </div>
            </div>
        </>
    )
}

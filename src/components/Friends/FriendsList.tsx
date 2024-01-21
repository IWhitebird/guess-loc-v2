import { useState, useEffect, useRef } from 'react';
import FriendSearch from './FriendSearch';
import { IoSearchOutline } from "react-icons/io5";
import { FaChevronCircleRight, FaChevronCircleDown } from "react-icons/fa";
import { getFriends, removeFriend } from '../../supabase/Routes/FriendRoutes'
import { useLocation } from 'react-router-dom';
import Loader from '../Loader';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export default function FriendsList({ visible, setVisible }: Props) {
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const { user_id } = useSelector((state: RootState) => state.user)
    const [searchModal, setSearchModal] = useState<boolean>(false);
    const [menu, setMenu] = useState({ visible: false, id: '' });
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, setModal] = useState({ visible: false, id: '' });

    const hanldeCloseModalBoth = () => {
        setVisible(false);
        setSearchModal(false);
        setMenu({ visible: false, id: '' });
        setModal({ visible: false, id: '' });
    }

    const fetchFriends = async () => {
        const data = await getFriends(user_id);
        setFriends(data);
    }

    const loadingFetchFriends = async () => {
        setLoading(true);
        await fetchFriends();
        setLoading(false);
    }

    useEffect(() => {
        addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hanldeCloseModalBoth();
            }
        })
    }, [])

    useEffect(() => {
        loadingFetchFriends

        const setIntervals = setInterval(() => {
            fetchFriends();
        }, 1000)

        return () => {
            clearInterval(setIntervals);
        }
    }, [])

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMenu(prevMenu => ({ visible: false, id: prevMenu.id }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const removeFriendClick = async (user_id: string, friend_id: string) => {
        console.log(friend_id)
        await removeFriend(user_id, friend_id);
        setModal({ visible: false, id: '' });
        setMenu(prevMenu => ({ visible: prevMenu.visible, id: '' }));
        await loadingFetchFriends();
    }

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
                    <div className={` ${loading === false && 'invisible'} bg-[rgba(100,100,100,0.1)] backdrop-blur-3xl flex w-full h-full absolute top-20 left-0 z-50}`}>
                        {loading && <Loader />}
                    </div>
                    {!loading && friends.length > 0 ? friends.map((friend, index) => (
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
                                <div className={`flex items-center gap-3 pr-8 relative`} ref={dropdownRef}>
                                    <p
                                        className={`cursor-pointer duration-300 ${menu.visible && menu.id === friend.id && 'rotate-180'}`}
                                        onClick={() => setMenu(prevMenu => ({ visible: !prevMenu.visible, id: friend.id }))}>
                                        <FaChevronCircleDown />
                                    </p>
                                    <div className={`absolute overflow-hidden ease-in-out duration-300 ${menu.id === friend.id && menu.visible ? 'opacity-100 h-[110px] w-[150px] ' : 'opacity-0 invisible h-0 w-0'} flex z-50 justify-center items-center top-8 right-8 bg-[rgba(0,0,0,0.1)] backdrop-blur-lg p-5 rounded-2xl`}>
                                        <ul className={`flex flex-col cursor-pointer duration-300 gap-3 ${menu.id === friend.id && menu.visible ? 'opacity-100' : 'opacity-0 invisible'}`}>
                                            <li className={`duration-300 hover:text-gray-500 ${location.pathname.startsWith('/customroom/') ? 'cursor-pointer' : 'cursor-not-allowed text-gray-500'}`}>Invite</li>
                                            {/* <li className='duration-300 hover:text-gray-500'>Messaage</li> */}
                                            <li className='duration-300 hover:text-gray-500' onClick={() => setModal({ visible: true, id: friend.id })}>Remove</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Confirm Modal */}
                                <div className={`fixed top-0 left-0 duration-300 ${modal.id === friend.id ? 'opacity-100' : 'opacity-0 invisible'} px-10 z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.6)] '}`}>
                                    <div className={`text-xl bg-[rgba(0,0,0,0.2)] backdrop-blur-lg duration-300 text-white border border-gray-700 p-5 rounded-xl ${modal.id === friend.id ? 'scale-100 opacity-100' : 'scale-50 opacity-0 invisible'}`}>
                                        Are you sure you want to remove <span className='underline'>{friend.user_name}</span> from your friend list?
                                        <br />
                                        This action cannot be undone.
                                        <div className='flex justify-end gap-3 mt-5'>
                                            <button className='px-3 py-1 text-white duration-300 bg-purple-900 rounded-lg hover:bg-purple-950' onClick={() => removeFriendClick(user_id, friend.id)}>Yes</button>
                                            <button className='px-3 py-1 text-white duration-300 bg-purple-900 rounded-lg hover:bg-purple-950' onClick={() => setModal({ visible: false, id: '' })}>No</button>
                                        </div>
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

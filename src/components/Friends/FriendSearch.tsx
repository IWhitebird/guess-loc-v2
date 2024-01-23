import React, { useState, useRef, useEffect } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { FaChevronCircleRight } from "react-icons/fa";
import { searchFriends, sendFriendRequest, getFriends, removeFriend } from '../../supabase/Routes/FriendRoutes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import Loader from '../Loader';
import { ImSpinner2 } from 'react-icons/im';
import toast from 'react-hot-toast';

interface FriendSearchProps {
    visible: boolean
    setVisible: (visible: boolean) => void
}

function FriendSearch({ visible, setVisible }: FriendSearchProps) {
    const [friends, setFriends] = useState<any[]>([]);
    const [search, setSearch] = useState('')
    const { user_id } = useSelector((state: RootState) => state.user)
    const [alreadyFriends, setAlreadyFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const listenKey = useRef<any>(null)
    let frsent: any = null;

    async function handlesearch() {
        if (!search.trim()) return
        setLoading2(true);
        const data = await searchFriends(search);
        if (data) {
            getFriendss();
            setFriends(data);
            setLoading2(false);
            return data;
        }
    }

    const getFriendss = async () => {
        setLoading(true);
        const data = await getFriends(user_id);
        if (data) {
            setAlreadyFriends(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        getFriendss();
    }, [])

    useEffect(() => {
        if (visible === false) {
            setSearch('');
            setFriends([]);
            setAlreadyFriends([]);
        }
    }, [visible])

    async function removeFr(friend_id: string) {
        if (!friend_id || friend_id === undefined) return
        setLoading(true);
        await removeFriend(user_id, friend_id);
        setFriends(friends.filter((friend) => friend.id !== friend_id))
        setLoading(false);
    }

    // useEffect(() => {
    //     const handleKeyPress = async (e: KeyboardEvent) => {
    //         if (e.key === 'Enter' && !search.trim()) {
    //             e.preventDefault();
    //             handlesearch();
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyPress);

    //     return () => {
    //         window.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, []);

    async function SendFr(friend_id: string) {
        if (!friend_id || friend_id === undefined) return;
        setLoading(true);
        const frsentResult = await sendFriendRequest(user_id, friend_id);
        if (frsentResult) {
            frsent = frsentResult;
            toast.error("You've already sent a friend request to this person!");
            setLoading(false);
        } else {
            toast.success("Friend request sent!");
            setLoading(false);
        }
    }

    return (
        <div className={`fixed duration-300 ${visible ? 'opacity-100 ' : 'opacity-0 invisible'} backdrop-blur-3xl top-0 right-0 z-50 items-start flex w-[951px] h-full  '}`}>
            <div className={`transition-all ease-in-out duration-300 absolute bg-[rgba(0,0,0,0.5)] text-white p-5 ${visible ? ' opacity-100 right-[31.2rem]' : 'opacity-0 right-0 invisible'}`}>
                {/* <p className='absolute bottom-[6.5rem] right-5 text-sm text-gray-500'>You can use <span className='border rounded-lg border-gray-500 p-1'>↵ Enter</span> to search.</p> */}
                <div className='flex items-center'>
                    <input type="text" placeholder='Search using name or email'
                        className='bg-[rgba(30,30,30,0.5)] relative duration-300 mr-1 w-[260px] text-white border border-purple-800 p-2 pl-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                    <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => handlesearch()} ref={listenKey}
                        style={{ fontSize: '1.5rem', padding: '1.2rem 2rem', margin: '0rem 0.5rem' }}
                    ><p><IoSearchOutline /></p><span id='fnButtonSpan'></span></button>
                    <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => setVisible(false)}
                        style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }}
                    ><p><FaChevronCircleRight /></p><span id='fnButtonSpan'></span></button>
                </div>
                <ul className='flex flex-col h-screen gap-3 pb-24 mt-3 overflow-y-auto text-xl' id='style-3'>
                    {!loading2 ? friends.map((friend, index) => (
                        <React.Fragment key={index}>
                            <li className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <img src={friend.user_pfp ? friend?.user_pfp : `https://api.dicebear.com/6.x/personas/svg?seed=${friend.user_name}`} alt="" className='w-[50px] h-[50px] rounded-full' />
                                    <div className='flex flex-col'>
                                        <p className='text-lg font-semibold'>{friend.user_name}</p>
                                        <p className='text-sm text-gray-400'>View Profile</p>
                                    </div>
                                </div>
                                <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => { alreadyFriends.some((existingFriend) => existingFriend.id === friend.id) ? removeFr(friend.id) : SendFr(friend.id) }}
                                    style={{ fontSize: '1.1rem', padding: `${alreadyFriends.some((existingFriend) => existingFriend.id === friend.id) ? '1.2rem 3.2rem' : '1.2rem 2.5rem'}` }}
                                    disabled={loading}
                                >
                                    <p> {!loading ? alreadyFriends.some((existingFriend) => existingFriend.id === friend.id) ? 'Remove' : 'Add' : <span><ImSpinner2 className='animate-spin text-2xl' /></span>}</p><span id='fnButtonSpan'></span>
                                </button>
                            </li>
                            <hr className='w-full border-white' />
                        </React.Fragment>
                    )) : <Loader />}
                </ul>
            </div>
        </div>
    )
}

export default FriendSearch
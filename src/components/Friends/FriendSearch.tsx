import { useState, useRef, useEffect } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { FaChevronCircleRight } from "react-icons/fa";
import { searchFriends, sendFriendRequest } from '../../supabase/Routes/FriendRoutes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';

interface FriendSearchProps {
    visible: boolean
    setVisible: (visible: boolean) => void
}

function FriendSearch({ visible, setVisible }: FriendSearchProps) {
    const [friends, setFriends] = useState<any[]>([]);
    const [search, setSearch] = useState('')
    const { user_id } = useSelector((state: RootState) => state.user)
    const listenKey = useRef<any>(null)

    async function handlesearch() {
        if (friends) {
            setFriends([])
        }
        const data = await searchFriends(search);
        if (data) {
            setFriends(data);
            setSearch('')
        }
    }

    useEffect(() => {
        if (search !== '' && search !== undefined) {

            const handleKeyPress = async (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    await handlesearch();
                }
            };

            window.addEventListener('keydown', handleKeyPress);
            
            return () => {
                window.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, [search]);

    async function SendFr(friend_id: string) {
        if (!friend_id || friend_id === undefined) return
        await sendFriendRequest(user_id, friend_id);
    }

    return (
        <div className={`fixed duration-300 overflow-hidden ${visible ? 'opacity-100 ' : 'opacity-0 invisible'} top-0 justify-start z-50 items-start flex w-full h-full  '}`}>
            <div className={`backdrop-blur-3xl fixed bg-[rgba(0,0,0,0.5)] duration-300 text-white p-5 rounded-tl-lg rounded-bl-lg${visible ? ' opacity-100 right-[31.2rem]' : 'opacity-0 right-0 invisible'}`}>
                <p className='absolute bottom-[6.5rem] right-5 text-sm text-gray-500'>You can use <span className='border rounded-lg border-gray-500 p-1'>↵ Enter</span> to search.</p>
                <div className='flex items-center'>
                    <input type="text" placeholder='Search using name or email'
                        className='bg-[rgba(30,30,30,0.5)] relative duration-300 mr-1 w-[260px] text-white border border-purple-800 p-2 pl-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                    <button className='w-[20px] h-[20px]' id='fn_button' onClick={handlesearch} ref={listenKey}
                        style={{ fontSize: '1.5rem', padding: '1.2rem 2rem', margin: '0rem 0.5rem' }}
                    ><p><IoSearchOutline /></p><span id='fnButtonSpan'></span></button>
                    <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => setVisible(false)}
                        style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }}
                    ><p><FaChevronCircleRight /></p><span id='fnButtonSpan'></span></button>
                </div>
                <ul className='flex flex-col h-screen gap-3 pb-24 mt-3 overflow-y-auto text-xl' id='style-3'>
                    {friends.map((friend, index) => (
                        <>
                            <li key={index} className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <img src={friend.user_pfp ? friend?.user_pfp : `https://api.dicebear.com/6.x/personas/svg?seed=${friend.user_name}`} alt="" className='w-[50px] h-[50px] rounded-full' />
                                    <div className='flex flex-col'>
                                        <p className='text-lg font-semibold'>{friend.user_name}</p>
                                        <p className='text-sm text-gray-400'>View Profile</p>
                                    </div>
                                </div>
                                <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => SendFr(friend.id)}
                                    style={{ fontSize: '1.1rem', padding: '1.2rem 2.3rem' }}
                                ><p>Add</p><span id='fnButtonSpan'></span></button>
                            </li>
                            <hr className='w-full border-white' />
                        </>
                    ))}

                </ul>
            </div>
        </div>
    )
}

export default FriendSearch
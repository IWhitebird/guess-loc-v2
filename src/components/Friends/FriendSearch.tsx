import { useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { FaChevronCircleRight } from "react-icons/fa";
import { searchFriends } from '../../supabase/Routes/FriendRoutes';

interface FriendSearchProps {
    visible: boolean
    setVisible: (visible: boolean) => void
}

function FriendSearch({ visible, setVisible }: FriendSearchProps) {
    const[friends, setFriends] = useState<any[]>([]);
    const [search, setSearch] = useState('')
    async function handlesearch () {
        const data = await searchFriends(search);
        console.log('data',data);
    }
    

    return (
        <div className={`fixed duration-300 overflow-hidden ${visible ? 'opacity-100 ' : 'opacity-0 invisible'} top-0 justify-start z-50 items-start flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md  '}`}>
            <div className={`backdrop-blur-3xl bg-[rgba(0,0,0,0.5)] fixed duration-300 text-white p-5 rounded-tl-lg rounded-bl-lg${visible ? ' opacity-100 right-[31.2rem]' : 'opacity-0 right-0 invisible'}`}>
                <div className='flex items-center'>
                    <input type="text" placeholder='Search using name or email'
                        className='bg-[rgba(30,30,30,0.5)] relative duration-300 mr-1 w-[260px] text-white border border-purple-800 p-2 pl-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} /> 
                        <button className='w-[20px] h-[20px]' id='fn_button' onClick={handlesearch}
                            style={{ fontSize: '1.5rem', padding: '1.2rem 2rem', margin: '0rem 0.5rem' }}
                        ><p><IoSearchOutline/></p><span id='fnButtonSpan'></span></button>
                        <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => setVisible(false)}
                            style={{ fontSize: '1.5rem', padding: '1.2rem 2rem'}}
                        ><p><FaChevronCircleRight/></p><span id='fnButtonSpan'></span></button>
                </div>
                <ul className='flex flex-col h-screen gap-3 pb-24 mt-3 overflow-y-auto text-xl' id='style-3'>
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' /> <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>John Doe</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                    <li className='flex items-center gap-3'>
                        <img src="https://i.pravatar.cc/150?img=3" alt="" className='w-[50px] h-[50px] rounded-full' />
                        <div className='flex flex-col'>
                            <p className='text-lg font-semibold'>Johnoikadiosahud</p>
                            <p className='text-sm text-gray-400'>View Profile</p>
                        </div>
                    </li>
                    <hr className='w-full border-white' />
                </ul>
            </div>
        </div>
    )
}

export default FriendSearch
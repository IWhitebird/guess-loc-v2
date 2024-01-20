import { useState, useEffect } from 'react';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export default function FriendsList({ visible, setVisible }: Props) {
    const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');
    const [friends, setFriends] = useState<any[]>([]);

    return (
        <div className={`fixed duration-300 text-white shadow-3xl ease-in-out top-0 right-0 flex text-2xl h-screen w-[500px] z-50 items-center backdrop-blur-3xl bg-[rgba(0,0,0,0.5)] ${visible ? 'opacity-100' : 'opacity-0 invisible right-[-500px]'}`}>
            <div className='flex absolute p-10 pt-5 justify-between w-full top-0 z-50'>
                <p className='text-3xl'>Friend list</p>
                <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => setVisible(false)}
                    style={{ fontSize: '1rem', padding: '1.2rem 3rem' }}
                >Close<span id='fnButtonSpan'></span></button>
            </div>

            <div className='flex flex-col p-6 pr-0 pb-0 h-full pt-20 w-full'>
                <ul className='flex flex-col gap-5 overflow-y-auto pb-5' id='style-3'>
                    {/* {friends.map((friend, index) => (
                        <li key={index} className='flex items-center justify-between gap-3'>
                            <div className='flex items-center gap-3'>
                                <img className='rounded-full' src={friend.avatar} alt="avatar" width="60" />
                                <p>{friend.name}</p>
                            </div>
                            <div className='flex items-center gap-3'>
                                <button className='bg-purple-900 hover:bg-purple-950 duration-300 text-white px-3 py-1 rounded-lg'>Challenge</button>
                                <button className='bg-purple-900 hover:bg-purple-950 duration-300 text-white px-3 py-1 rounded-lg'>Remove</button>
                            </div>
                        </li>
                    ))} */}
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />  <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                    <li>
                        <div className='flex items-center relative gap-3'>
                            <img className='rounded-full' src={loggedIN.user.user_metadata.avatar_url} alt="avatar" width="60" />
                            <div className='bg-green-500 rounded-full w-5 h-5 absolute bottom-0 left-5 border-white border'></div> {/* online change left to left-10 */}
                            <div className='bg-gray-700 rounded-full w-5 h-5 absolute bottom-0 left-10 border-white border'></div> {/* offline indicator */}
                            <div className='flex flex-col'>
                                <p>{loggedIN.user.user_metadata.full_name}</p>
                                <p className='text-base text-gray-400'>Playing/Online/Offline</p>
                            </div>
                        </div>
                    </li>
                    <hr className='border mr-5' />
                </ul>
            </div>
        </div>
    )
}

import { useState, useEffect, useRef } from 'react';
import FriendSearch from './FriendSearch';
import { IoSearch } from "react-icons/io5";
import { FaChevronCircleRight, FaChevronCircleDown } from "react-icons/fa";
import { getFriends, removeFriend, getIncomingFriendRequests } from '../../supabase/Routes/FriendRoutes'
import { setOnline } from '../../supabase/Routes/MainRoutes';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { RiUserAddFill } from "react-icons/ri";
import { ImSpinner2 } from 'react-icons/im'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import IncomingAccordion from './IncomingAccordion';
import supabase from '../../supabase/init';
import FrListSearchModal from './FrListSearchModal';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    handleState: string
    setHandleState: (handleState: string) => void
}

export default function FriendsList({ visible, setVisible, handleState, setHandleState }: Props) {
    const location = useLocation();
    const nav = useNavigate();
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const { user_id } = useSelector((state: RootState) => state.user)
    const [searchModal, setSearchModal] = useState<boolean>(false);
    const [menu, setMenu] = useState({ visible: false, id: '' });
    const [friends, setFriends] = useState<any[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, setModal] = useState({ visible: false, id: '' })
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [interSearch, setInterSearch] = useState<boolean>(false);

    supabase.channel(`user_${user_id}`).on('postgres_changes',
        {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${user_id}`
        },
        payload => {
            if (payload) {
                loadingFetchFriends()
            }
        }
    ).subscribe()

    async function setOnlines(id: any, status: string) {
        if (id) await setOnline(id, status)
    }

    useEffect(() => {
        const onlineChannel = supabase.channel(`online_users_geoQuizv2`);
        let onlineStatus: string;

        onlineChannel.on('presence', { event: 'sync' }, () => {
            const newState = onlineChannel.presenceState();

            for (const key in newState) {
                const user = newState[key];
                for (const key in user) {
                    //@ts-ignore
                    onlineStatus = user[key].user_id;
                    if (onlineStatus === user_id) {
                        setOnlines(onlineStatus, 'online')
                    }
                }
            }
        }).subscribe(async (status) => {
            if (status !== 'SUBSCRIBED') return;
            await onlineChannel.track({ user_id, online_at: new Date().toISOString() });
        });

        const cleanup = () => {
            onlineChannel.unsubscribe();
            setOnlines(user_id, 'offline')
        }

        window.addEventListener('beforeunload', cleanup);

        return () => {
            window.removeEventListener('beforeunload', cleanup);
        }
    }, [user_id,]);

    const hanldeCloseModalBoth = () => {
        setVisible(false);
        setSearchModal(false);
        setMenu({ visible: false, id: '' });
        setModal({ visible: false, id: '' });
        setInterSearch(false);
    }

    const loadingFetchFriends = async () => {
        setLoading(true);
        await getFriends(user_id).then(data => setFriends(data))
        await getIncomingFriendRequests(user_id).then(data => setIncomingRequests(data))
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
        loadingFetchFriends()
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
        setLoading(true);
        await removeFriend(user_id, friend_id);
        setModal({ visible: false, id: '' });
        setMenu(prevMenu => ({ visible: prevMenu.visible, id: '' }));
        await loadingFetchFriends();
    }

    const filteredFriends = friends.filter((friend) =>
        friend.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hanldeInterSearch = () => {
        if(handleState === 'requests'){
            setInterSearch(false);
        }else{
            setInterSearch(true);
        }
    }

    useEffect(() => {
        if(handleState === 'requests'){
            setInterSearch(false);
        }
    }, [handleState])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            {/* Search modal for searching friends */}
            <FriendSearch visible={searchModal} setVisible={setSearchModal} />

            <div className={`fixed duration-300 text-white shadow-3xl ease-in-out top-0 right-0 flex flex-col text-xl h-screen w-[500px] z-50 items-center backdrop-blur-3xl bg-[rgba(0,0,0,0.5)] ${visible ? 'opacity-100' : 'opacity-0 invisible right-[-500px]'}`}>
                <p className='fixed flex items-center justify-end w-full text-base text-gray-500 bottom-2 right-3'>Press <span className='border text-base border-gray-500 rounded-lg p-0.5 mx-1'>Esc</span> to close</p>
                <div className='flex absolute px-7 py-4 justify-between items-center w-full top-0 z-50 bg-[rgba(176,80,255,0.1)] backdrop-blur-3xl '>
                    <p className='text-3xl'>Friend list</p>
                    <div className='flex items-center gap-3'>
                        <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => setSearchModal(true)}
                            style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }}
                        ><p><RiUserAddFill /></p><span id='fnButtonSpan'></span></button>
                        <button className='w-[20px] h-[20px]' id='fn_button' onClick={hanldeInterSearch}
                            style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }}
                        ><p><IoSearch /></p><span id='fnButtonSpan'></span></button>
                        <FrListSearchModal visible={interSearch} setVisible={setInterSearch} searchTerm={searchTerm} handleSearch={handleSearch} />
                        <button className='w-[20px] h-[20px]' id='fn_button' onClick={hanldeCloseModalBoth}
                            style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }}
                        ><p><FaChevronCircleRight /></p><span id='fnButtonSpan'></span></button>
                    </div>
                </div>

                <div className='flex relative items-start justify-evenly cursor-pointer w-full pt-[4.7rem] mb-3'>
                    <p className={`text-2xl`} onClick={() => setHandleState('list')}>Friends</p>
                    <p className={`text-2xl`} onClick={() => setHandleState('requests')}>Requests</p>
                    <div className={`absolute duration-[400ms] ease-in-out bottom-[-0.3rem] ${handleState === 'requests' ? 'left-[285px] w-[120px]' : 'w-[100px] left-[5.9rem]'} h-[2px] bg-white rounded-lg`} />
                </div>
                <div className='flex flex-col w-full h-full p-6 pt-0 pb-[2.3rem] pr-0 overflow-y-auto' id='style-3'>
                    <div className={` ${loading === false && 'invisible'} bg-[rgba(100,100,100,0.1)] backdrop-blur-3xl flex w-full h-full absolute top-20 left-0 z-50}`}>
                        {loading && <Loader />}
                    </div>
                    {/* Friends list */}
                    {!loading && handleState === 'list' ? filteredFriends.length > 0 ? filteredFriends.map((friend, index) => (
                        <ul className='flex flex-col gap-2 pt-0 pb-2' id='style-3' key={index}>
                            <li className='flex items-center justify-between w-full'>
                                <div className='relative flex items-center gap-3'>
                                    <img className='rounded-full bg-gray-700' src={friend?.user_pfp ? friend?.user_pfp : `https://api.dicebear.com/6.x/personas/svg?seed=${friend.user_name}`} alt='avatar' width='60' height='60' />
                                    {friend.online_status === 'online' ?
                                        <div className='absolute bottom-0 w-5 h-5 bg-green-500 border border-white rounded-full left-10'></div>
                                        :
                                        <div className='absolute bottom-0 w-5 h-5 bg-gray-700 border border-white rounded-full left-10'></div>
                                    }
                                    <div className='flex flex-col'>
                                        <p>{(friend.user_name).length > 10 ? (friend.user_name).slice(0, 25) + '...' : friend.user_name}</p>
                                        <p className='text-sm capitalize text-gray-400'>{friend.online_status}</p>
                                    </div>
                                </div>

                                {/* dropdown */}
                                <div className={`flex items-center gap pr-8 relative`} ref={dropdownRef}>
                                    <p
                                        className={`cursor-pointer text-2xl duration-300 ${menu.visible && menu.id === friend.id && 'rotate-180'}`}
                                        onClick={() => setMenu(prevMenu => ({ visible: !prevMenu.visible, id: friend.id }))}>
                                        <FaChevronCircleDown />
                                    </p>
                                    <div className={`absolute overflow-hidden ease-in-out duration-300 
                                                     ${menu.id === friend.id && menu.visible ? 'opacity-100 h-[130px] w-[120px] ' : 'opacity-0 invisible h-0 w-0'}
                                                     flex z-50 justify-center items-center top-8 right-8 bg-[rgba(30,30,30,1)] shadow-2xl p-5 rounded-2xl`}>
                                        <ul className={`flex flex-col cursor-pointer duration-300 gap-3 ${menu.id === friend.id && menu.visible ? 'opacity-100' : 'opacity-0 invisible'}`}>
                                            <li className={`duration-300 hover:text-gray-500 ${location.pathname.startsWith('/customroom/') ? 'cursor-pointer' : 'cursor-not-allowed text-gray-500'}`}>Invite</li>
                                            <li className='duration-300 hover:text-gray-500' onClick={() => nav(`/profile/${friend.id}`)}>Profile</li>
                                            <li className='duration-300 hover:text-red-700' onClick={() => setModal({ visible: true, id: friend.id })}>Remove</li>
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
                                            <button className='px-3 py-1 text-white duration-300 bg-purple-900 rounded-lg hover:bg-purple-950' disabled={loading} onClick={() => removeFriendClick(user_id, friend.id)}>
                                                {loading ? <p className='flex items-center'>
                                                    <span className='animate-spin '><ImSpinner2 /></span>
                                                    Wait..
                                                </p>
                                                    : 'Yes'}

                                            </button>
                                            <button className='px-3 py-1 text-white duration-300 bg-purple-900 rounded-lg hover:bg-purple-950' onClick={() => setModal({ visible: false, id: '' })}>No</button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <hr className='mr-5 border' />
                        </ul>
                    )) : <p className='flex items-center justify-center w-full h-full text-gray-400'>{loading ? '' : 'No friends found'}</p>
                        : <div className=''>
                            {/* Incoming requests */}
                            {incomingRequests.length > 0 && incomingRequests.length > 0 ? incomingRequests.map((request, index) => (
                                <div className=''>
                                    <IncomingAccordion request={request} index={index} loadingFetchFriends={loadingFetchFriends} setLoading={setLoading} loading={loading} />

                                </div>
                            )) : <p className='flex items-center justify-center w-full h-screen pb-52 text-gray-400'>{loading ? '' : 'No incoming requests'}</p>}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}


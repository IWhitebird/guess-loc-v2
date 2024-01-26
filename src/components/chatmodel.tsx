import { useState, useEffect, useRef } from 'react';
import supabase from '../supabase/init';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { IoSend } from "react-icons/io5";
import { sendMessage , updateRoom } from '../supabase/Routes/RoomRoutes';

const ChatModel: React.FC = () => {

    const { user_id, user_name, user_profile_pic } = useSelector((state: RootState) => state.user)
    const roomDetails = useSelector((state: RootState) => state.room)
    const containerRef = useRef<HTMLDivElement>(null);
    const enterRef = useRef<HTMLButtonElement>(null);
    const [newMessage, setNewMessage] = useState<string>('');
    const channel = supabase.channel(`${roomDetails.room_id}_chat`)
    const [curChat, setCurChat] = useState<any[]>(roomDetails.room_chat)

    async function SendMessage(myMsg: string) {
        setNewMessage('')

        if (!newMessage.trim()) {
            return;
        }

        setCurChat([...curChat, {
            chatter_id: user_id,
            chatter_name: user_name,
            chatter_image: user_profile_pic,
            chatter_message: myMsg,
            chatter_time: new Date().toLocaleTimeString()
        }])

        
        sendMessage(roomDetails.room_id as string, myMsg, user_id, user_name, user_profile_pic)    
        await updateRoom(roomDetails.room_id as string, myMsg, roomDetails, user_id, user_name, user_profile_pic)
        

        // channel.subscribe((status) => {
        //     if (status !== 'SUBSCRIBED') { return }
        //     channel.send({
        //         type: 'broadcast',
        //         event: 'room_chatting',
        //         payload: {
        //             chatter_id: user_id,
        //             chatter_name: user_name,
        //             chatter_image: user_profile_pic,
        //             chatter_message: myMsg,
        //             chatter_time: new Date().toLocaleTimeString()
        //         }
        //     })
        // })

        // await supabase.from('custom_room').update({
        //     room_chat: [...roomDetails.room_chat, {
        //         chatter_id: user_id,
        //         chatter_name: user_name,
        //         chatter_image: user_profile_pic,
        //         chatter_message: myMsg,
        //         chatter_time: new Date().toLocaleTimeString()
        //     }] as any
        // }).match({ room_id: roomDetails.room_id })

        scrollToBottom();
    }

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    // useEffect(() => {
    //     if (newMessage.trim()) return
    //     const handleKeyPress = async (e: KeyboardEvent) => {
    //         if (e.key === 'Enter') {
    //             e.preventDefault();
    //             SendMessage(newMessage);
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyPress);

    //     return () => {
    //         window.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, []);

    channel.on(
        'broadcast',
        { event: 'room_chatting' },
        ({ payload }) => {
            console.log("paylod", payload)
            setCurChat([...curChat, payload])
        }
    )

    useEffect(() => {
        scrollToBottom()
    }, [curChat]);

    console.log("ROOM DETAILS", roomDetails)
    console.log("Broad", curChat)

    return (
        <div className='w-[500px] h-full border bg-[#ffffff2c] border-black backdrop-blur-md rounded-xl flex justify-start flex-col '>
            <div className="flex flex-col items-start h-full gap-5 overflow-y-auto " id="style-3" ref={containerRef}>

                {curChat.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-5 m-3  ${chat.chatter_id === user_id ? 'self-end' : 'self-start'}`}
                    >
                        {
                            chat.chatter_id !== user_id &&
                            <img
                                className="w-8 h-8 rounded-full"
                                src={chat.chatter_image}
                                alt={`${chat.chatter_name} image`}
                            />
                        }

                        <div className={`flex flex-col w-full max-w-[420px] px-4 py-2 border-gray-200 bg-gray-100 rounded-lg dark:bg-gray-700 break-words`}>
                            <div className="flex items-center justify-between space-x-3 rtl:space-x-reverse">
                                <span className="text-base font-semibold text-gray-900 dark:text-white">
                                    {chat.chatter_name}
                                </span>
                            </div>
                            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                                {chat.chatter_message}
                            </p>
                            <span className="flex justify-end w-full text-sm font-normal text-gray-500 dark:text-gray-400">
                                {chat.chatter_time.split(':')[0] + ':' + chat.chatter_time.split(':')[1] + ' ' + chat.chatter_time.split(' ')[1]}
                            </span>
                        </div>
                        {
                            chat.chatter_id === user_id &&
                            <img
                                className="w-8 h-8 rounded-full"
                                src={chat.chatter_image}
                                alt={`${chat.chatter_name} image`}
                            />
                        }
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center p-4 border-t border-purple-700">
                <input
                    className="w-full p-2 mr-5 overflow-hidden duration-300 bg-transparent border border-purple-800 rounded-lg resize-y focus:outline-none focus:border-purple-400"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ resize: 'none' }}
                />
                <button
                    id='fn_button'
                    style={{ fontSize: '1.2rem', padding: '1rem 1rem 1rem 1.5rem' }}
                    onClick={() => { SendMessage(newMessage) }}
                    ref={enterRef}
                >
                    Send <IoSend className='ml-3' />
                    <span id='fnButtonSpan'></span>
                </button>
            </div>
        </div>
    );
};
export default ChatModel;
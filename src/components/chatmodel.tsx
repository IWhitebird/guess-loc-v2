import React, { useState } from 'react';

import supabase from '../supabase/init';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { IoSend } from "react-icons/io5";
import { configureStore } from '@reduxjs/toolkit'



const ChatModel: React.FC = () => {

    const { user_id, user_name, user_profile_pic } = useSelector((state: RootState) => state.user)
    const roomDetails = useSelector((state: RootState) => state.room)

    const [newMessage, setNewMessage] = useState<string>('');


    async function SendMessage() {
        // const channel = supabase.channel(`${roomDetails.room_id}`);
        // channel.send({
        //   type: 'broadcast',
        //   event: 'player-chat',
        //   payload: { 
        //     chatter_id: user_id,
        //     chatter_name: user_name,
        //     chatter_image: user_profile_pic,
        //     chatter_message: newMessage,
        //     chatter_time: new Date().toLocaleTimeString()
        //    },
        // });
        const d = await supabase.from('custom_room').update({
            room_chat: [...roomDetails.room_chat, {
                chatter_id: user_id,
                chatter_name: user_name,
                chatter_image: user_profile_pic,
                chatter_message: newMessage,
                chatter_time: new Date().toLocaleTimeString()
            }]
        }).match({ room_id: roomDetails.room_id }).select()
        console.log(d)
    }

    console.log("ROOM DETAILS", roomDetails)
    return (
        <div className='w-full h-full border bg-[#ffffff2c] border-black backdrop-blur-md rounded-xl flex justify-start flex-col '>
            <div className="flex flex-col items-start h-full gap-5 overflow-y-auto " id="style-3">

                {roomDetails.room_chat.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-5 m-3  ${chat.chatter_id === user_id ? 'self-end' : 'self-start'

                            }`}
                    >
                        {
                            chat.chatter_id !== user_id &&
                            <img
                                className="w-8 h-8 rounded-full"
                                src={chat.chatter_image}
                                alt={`${chat.chatter_name} image`}
                            />
                        }

                        <div className={`flex flex-col w-full max-w-[420px] p-2 border-gray-200 bg-gray-100 rounded-lg dark:bg-gray-700`}>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {chat.chatter_name}
                                </span>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    {chat.chatter_time}
                                </span>
                            </div>
                            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                                {chat.chatter_message}
                            </p>
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
                <textarea
                    className="w-full p-2 mx-auto mb-4 overflow-hidden duration-300 bg-transparent border border-purple-800 rounded-lg resize-y focus:outline-none focus:border-purple-400"
                    placeholder="Type your message..."
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    id='fn_button'
                    style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                    onClick={() => SendMessage()}
                >
                    Send<span id='fnButtonSpan'></span>
                </button>
            </div>
        </div>
    );
};
export default ChatModel;

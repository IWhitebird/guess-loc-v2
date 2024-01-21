import React, { useState } from 'react';
import { IoSend } from "react-icons/io5";

interface Chat {
    chatter_id: string;
    chatter_name: string;
    chatter_image: string;
    chatter_message: string;
    chatter_time: string;
}

interface ChatModelProps {
    chatData: Chat[];
}

const ChatModel: React.FC<ChatModelProps> = ({ chatData }) => {
    const token = localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token');
    const [newMessage, setNewMessage] = useState<string>('');

    if (token) {
        var userId = JSON.parse(token).user.id;
    }

    return (
        <div className='w-full h-full border bg-[#ffffff2c] border-black backdrop-blur-md rounded-xl flex justify-start flex-col '>
            <div className="flex flex-col items-start h-full gap-5 overflow-y-auto " id="style-3">
                {chatData.map((chat) => (
                    <div
                        key={chat.chatter_id}
                        className={`flex items-start gap-5 m-3  ${chat.chatter_id === userId ? 'self-end' : 'self-start'
                            }`}
                    >
                        {
                            chat.chatter_id !== userId &&
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
                            chat.chatter_id === userId &&
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
                    className="w-full p-2 overflow-hidden text-white duration-300 bg-transparent border border-purple-800 rounded-lg resize-y focus:outline-none focus:border-purple-400"
                    placeholder="Type your message..."
                    style={{resize:'none'}}
                />
                <div className='flex items-center gap-2 ml-4'>
                    <button
                        id='fn_button'
                        style={{ fontSize: '1.2rem', padding: '1rem 1rem 1rem 2rem' }}
                    >
                        Send<p className='ml-3 text-purple-700 '><IoSend /></p><span id='fnButtonSpan' ></span>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ChatModel;

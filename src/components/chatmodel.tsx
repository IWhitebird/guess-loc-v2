import React, { useState } from 'react';

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
        <div className='w-full h-full border bg-[#ffffff2c] border-black backdrop-blur-md rounded-xl '>
            <div className="flex flex-col items-start gap-5 h-full overflow-y-auto">
                {chatData.map((chat) => (
                    <div
                        key={chat.chatter_id}
                        className={`flex items-start gap-5 m-5 ${chat.chatter_id === userId ? 'self-end' : 'self-start'
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

                        <div className={`flex flex-col w-full h-full overflow-y-auto p-2 border-gray-200 bg-gray-100 rounded-lg dark:bg-gray-700`}>
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
                <div className=' h-1 bg-black w-[90%] mx-auto'>

                </div>
                <div className="w-[90%] mx-auto p-6 flex flex-row">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="w-full p-2 border rounded-md border-gray-300"
                    />

                    <button
                        className="w-[40px] p-2 mt-2 bg-white rounded-md text-black" // Changed text-white to text-black for better visibility
                        onClick={() => { }}
                    >
                        Send
                    </button>

                </div>
            </div>
        </div>

    );
};

export default ChatModel;

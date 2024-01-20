import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatModel from "../../components/chatmodel"

const Room = () => {

    const param = useParams<{id:string}>()

    const [roomId , setRoomId] = useState<string | undefined>(param.id)

    

    console.log(roomId)

    const fakeChatData = [
    {
        chatter_id: '52872fee-3e5c-4892-85ae-30738c47784d',
        chatter_name: 'Alice',
        chatter_image: '/path/to/alice-image.jpg',
        chatter_message: 'Hi there!',
        chatter_time: '12:30 PM',
    },
    {
        chatter_id: '2',
        chatter_name: 'Bob',
        chatter_image: '/path/to/bob-image.jpg',
        chatter_message: 'Hey Alice! How are you?',
        chatter_time: '12:32 PM',
    },
    {
        chatter_id: '1',
        chatter_name: 'Alice',
        chatter_image: '/path/to/alice-image.jpg',
        chatter_message: 'I\'m good, thanks! How about you?',
        chatter_time: '12:35 PM',
    },
    {
        chatter_id: '2',
        chatter_name: 'Bob',
        chatter_image: '/path/to/bob-image.jpg',
        chatter_message: 'I\'m doing well too. Any exciting plans for the day?',
        chatter_time: '12:40 PM',
    },
    ];




  return (
    <div className="bg-purple-950 w-full h-[100vh] ">
        <div className="flex justify-start items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">

            <div className="flex w-full h-full flex-row">
                {/* player INFo */}
                <div className="w-[50%]">

                </div>

                {/* chat model */}
                <div  className="w-[50%] ml-20 mt-16 p-10 flex justify-end">
                    <ChatModel chatData={fakeChatData} />
                </div>


            </div>

        </div>
    </div>
  )
}

export default Room
import { useEffect , useState } from "react"
import supabase from "../../supabase/init"
import {createRoom} from "../../supabase/SupaScoket"

const CustomGame = () => {

  const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');
  let channel: any;
  const [userId] = useState(loggedIN.user.id)
  const [roomId , setRoomId] = useState<string>('test')
  const [joinedRoom , setJoinedRoom] = useState(false)

  const [msg , setMsg] = useState<string>()


  async function SendMessage() {
    const channel = supabase.channel(`${roomId}`);
    channel.send({
      type: 'broadcast',
      event: 'player-chat',
      payload: { message: `Hello world! player ${userId}` },
    });
  }

  async function createR() {
    const data: any = await createRoom(userId, "helo");
    console.log(data);
    setJoinedRoom(true);
  }


  useEffect(() => {
    if(joinedRoom) {



      supabase
      .channel(`${roomId}`)
      .on('broadcast', { event: 'player-chat' }, payload => {
        console.log('New Message received!', payload)
      })
      .subscribe()

    }
  }, [joinedRoom]);
  
  async function joinRoom() {
    setJoinedRoom(true);
  }


  console.log(channel , "channel")
  console.log(roomId , "roomID")
  console.log(msg , "meesage");


  return (
    <div className="bg-purple-950 w-full h-[100vh] ">
       <div className="flex justify-start items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">

        <button onClick={createR} className="w-[200px] bg-white text-black">Create Room</button>

        <input type="text" 
         className="w-[200px] bg-white text-black"
         placeholder="Enter Room ID" 
         onChange={(e) => setRoomId(e.target.value)} 
        />

        <button 
        onClick={() => joinRoom()} 
        className="w-[200px] bg-white text-black">
        Join Room
        </button>

        <button 
        onClick={() => SendMessage() } 
        className="w-[200px] bg-white text-black">
        Send Msg Room
        </button>

      </div>
    </div>
  )
}

export default CustomGame
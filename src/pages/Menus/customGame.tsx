import { useEffect, useState } from "react"
import supabase from "../../supabase/init"
import { createRoom } from "../../supabase/SupaScoket"
import { Link } from "react-router-dom"
import logo from '../../assets/Untitled-1.png';
import toast from "react-hot-toast";  


interface IRoom {
  room_id?: string;
  owner?: string;
  name: string;
  game_rounds: number;
  room_password: string;
  round_duraion: number;
}

interface IJoinRoom {
  room_id: string;
  room_password: string;
}

const CustomGame = () => {

  const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');
  let channel: any;

  const [createRoomModal, setCreateRoomModal] = useState(false)
  const [roomDetails, setRoomDetails] = useState<IRoom>({
    name: "",
    game_rounds: 5,
    room_password: "",
    round_duraion: 60
  })

  const [joinRoomModal, setJoinRoomModal] = useState(false)
  const [joinRoomDetails, setJoinRoomDetails] = useState<IJoinRoom>({
    room_id: "",
    room_password: ""
  })

  const [userId] = useState(loggedIN.user.id)
  const [roomId, setRoomId] = useState<string>('test')
  const [joinedRoom, setJoinedRoom] = useState(false)
  const [msg, setMsg] = useState<string>()


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
    if (joinedRoom) {
      supabase
        .channel(`${roomId}`)
        .on('broadcast', { event: 'player-chat' }, payload => {
          console.log('New Message received!', payload)
        })
        .subscribe()

    }
  }, [joinedRoom]);


  async function joinRoomHandle() {
    const loader = toast.loading("Joining room...")
    try {
      const findRoom : any = await supabase
        .from('custom_room')
        .select()
        .eq('room_id', joinRoomDetails.room_id)
        .eq('room_pw', joinRoomDetails.room_password)

      if (findRoom.error) {
        toast.error("Room doesnt exist")
        return;
      }
      
      const updateRoom = await supabase
                    .from('custom_room')
                    .update({ 'room_participants': [...findRoom.data[0].room_participants , userId] } )
                    .eq('room_id', joinRoomDetails.room_id)
                    .eq('room_pw', joinRoomDetails.room_password)
                    .select()
      
      if (updateRoom.error) {
        toast.error("Error joining room")
        return;
      }

      toast.success("Room joined")
      console.log("Join Room handle data " ,updateRoom)
      localStorage.setItem('custom_game_details', updateRoom.data[0])
    }
    catch (error) {
      console.log(error)
    }
    finally {
      toast.dismiss(loader)
      setJoinRoomModal(false)
    }
  }

  async function createRoomHandle() {
    const loader = toast.loading("Creating room...")
    try {
      const { data, error } = await supabase
        .from('custom_room')
        .insert(
          { 
            room_name: roomDetails.name,
            room_pw: roomDetails.room_password,
            room_owner: userId,
            room_settings: {
              game_rounds: roomDetails.game_rounds,
              round_duration: roomDetails.round_duraion
            },
            room_participants: [userId],
            room_chat: [{
              user_id: userId,
              message: "Welcome to the room",
              timestamp: new Date().getTime()
            }]
          }
        ).select()

      if (error) {
        toast.error("Error creating room")
        return;
      }
      toast.success("Room created")
      console.log(data)
      localStorage.setItem('custom_game_details', data[0])
    } 
    catch (error) {
      console.log(error)
    }
    finally {
      toast.dismiss(loader)
      setCreateRoomModal(false)
    }
  }
  
  function changeCrateModel(e : any) {
    e.preventDefault();
    console.log(e)
    setRoomDetails({ ...roomDetails , [e.target.name] : e.target.value})
  }
  
  function changeJoinModel(e : any) {
    e.preventDefault();
    console.log(e)
    setJoinRoomDetails({ ...joinRoomDetails , [e.target.name] : e.target.value})
  }
  
  
  // console.log(roomDetails, "roomDetails")
  // console.log(channel, "channel")
  // console.log(roomId, "roomID")
  // console.log(msg, "meesage");
  
  
  return (
    <div className="bg-purple-950 w-full h-[100vh] ">
      {/* <div className="flex justify-start items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">

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

      </div> */}

      <div className="absolute top-0 flex justify-between w-full px-20 ">
        <img className="invert w-[200px] h-[200px]" src={logo} alt="Logo" />
      </div>


      <div className="flex justify-start items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
        <div className="flex items-center justify-between">
          <ul className="tracking-wider text-white uppercase ">
            <li onClick={() => setCreateRoomModal(true)} className="mb-8 text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-300">
              Create Room
            </li>
            <li onClick={() => setJoinRoomModal(true)} className="mb-8 text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-300">
              Join Room
            </li>
            <Link to="/mode">
              <li className="text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-300">
                Go Back
              </li>
            </Link>
          </ul>
        </div>
      </div>

      {createRoomModal && (

        <div className={`absolute duration-300 top-0 left-0 z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md '}`}>
          <div className="w-[500px] h-[500px] relative bg-white rounded-lg flex flex-col p-5">
            {/* Close button */}
            <button
              onClick={() => setCreateRoomModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Input boxes with labels */}
            <div className="flex flex-col">
              <label className="mx-auto w-[60%]  text-gray-600 mb-1">Room Name</label>
              <input
                type="text"
                placeholder="Enter room name"
                value={roomDetails.name}
                name="name"
                onChange={changeCrateModel}
                className="mx-auto w-[60%] rounded-lg border border-black p-2 mb-4 focus:outline-none focus:ring focus:border-purple-300"
              />

              <label className="mx-auto w-[60%] text-gray-600 mb-1">Room Password</label>
              <input
                type="number"
                placeholder="Enter round duration"
                value={roomDetails.room_password}
                name="room_password" 
                onChange={changeCrateModel}
                className=" mx-auto rounded-lg border border-black w-[60%] p-2 mb-4 focus:outline-none focus:ring focus:border-purple-300"
              />

              <label className="mx-auto w-[60%]  text-gray-600 mb-1">Number of Rounds</label>
              <input
                type="number"
                placeholder="Enter number of rounds"
                value={roomDetails.game_rounds}
                name="game_rounds"
                onChange={changeCrateModel}
                className="mx-auto w-[60%] rounded-lg border border-black p-2 mb-4 focus:outline-none focus:ring focus:border-purple-300"
              />

              <label className="mx-auto w-[60%] text-gray-600 mb-1">Round Duration (in seconds)</label>
              <input
                type="number"
                placeholder="Enter round duration"
                value={roomDetails.round_duraion}
                name="round_duraion" 
                onChange={changeCrateModel}
                className=" mx-auto rounded-lg border border-black w-[60%] p-2 mb-4 focus:outline-none focus:ring focus:border-purple-300"
              />

              <div className=" mx-auto flex justify-evenly mt-8 gap-6">
                <button
                  onClick={createRoomHandle}
                  className="transition-all duration-200 ease-in-out border
                  border-black text-black py-2 px-4 rounded w-[120px] hover:text-white
                   hover:bg-black focus:outline-none focus:ring focus:border-purple-300"
                >
                  Create
                </button>
              </div>

            </div>
          </div>
        </div>

      )}
      {
        joinRoomModal &&
        <div className={`absolute duration-300 top-0 left-0 z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md '}`}>
          <div className="w-[500px] h-[300px] relative bg-white rounded-lg flex flex-col p-5">
            {/* Close button */}
            <button
              onClick={() => setJoinRoomModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Input boxes with labels */}
            <div className="flex flex-col">
              <label className="mx-auto w-[60%]  text-gray-600 mb-1">Room Id</label>
              <input
                type="text"
                placeholder="Enter room name"
                value={joinRoomDetails.room_id}
                name="room_id"
                onChange={changeJoinModel}
                className="mx-auto w-[60%] rounded-lg border border-black p-2 mb-4 focus:outline-none focus:ring focus:border-purple-300"
              />

              <label className="mx-auto w-[60%]  text-gray-600 mb-1">Room Password</label>
              <input
                type="text"
                placeholder="Enter number of rounds"
                value={joinRoomDetails.room_password}
                name="room_password"
                onChange={changeJoinModel}
                className="mx-auto w-[60%] rounded-lg border border-black p-2 mb-4 focus:outline-none focus:ring focus:border-purple-300"
              />

              <div className=" mx-auto flex justify-evenly mt-8 gap-6">
                <button
                  onClick={joinRoomHandle}
                  className="transition-all duration-200 ease-in-out border
                            border-black text-black py-2 px-4 rounded w-[120px] hover:text-white
                              hover:bg-black focus:outline-none focus:ring focus:border-purple-300"
                >
                  Join
                </button>
              </div>

            </div>
          </div>
        </div>

      }


    </div>
  )
}

export default CustomGame
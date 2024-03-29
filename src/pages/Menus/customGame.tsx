import { useState } from "react"
import supabase from "../../supabase/init"
import { Link, useNavigate } from "react-router-dom"
import logo from '../../assets/Untitled-1.png';
import toast from "react-hot-toast";
import { RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setRoom } from "../../redux/slices/roomSlice";
import { sendMessage, updateRoomChat, joinRoomHandle } from "../../supabase/Routes/RoomRoutes";

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

  const location = useNavigate()
  const dispatch = useDispatch()

  const { user_id, user_name, user_profile_pic } = useSelector((state: RootState) => state.user)
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

  async function joinRoomHandleBtn() {
    const loader = toast.loading("Joining room...")
    try {
      let { data, error }: any = await supabase
        .from('custom_room')
        .select()
        .eq('room_id', joinRoomDetails.room_id)
        .eq('room_pw', joinRoomDetails.room_password)

      if (error || data[0].room_pw !== joinRoomDetails.room_password) {
        toast.error("Room doesnt exist")
        toast.dismiss(loader)
        return;
      }

      // Update Room Participants
      const updatedData = await joinRoomHandle(joinRoomDetails.room_id as string, data[0].room_participants, user_id, user_name, user_profile_pic)

      // Update Room Chat 
      await updateRoomChat(joinRoomDetails.room_id as string, user_id, user_name, `${user_name} joined the room`,)

      // Send Message on Websocket
      sendMessage(joinRoomDetails.room_id as string, `${user_name} joined the room`, user_id, user_name, user_profile_pic)

      toast.success("Room joined")
      localStorage.setItem('custom_room_details', JSON.stringify(joinRoomDetails.room_id))
      dispatch(setRoom(updatedData as any))
      location(`/customroom/Room/${joinRoomDetails.room_id}`)
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
    if (roomDetails.name === "") return toast.error("Room name is required")
    if (roomDetails.room_password === "") return toast.error("Room password is required")

    const loader = toast.loading("Creating room...")
    try {
      const { data, error } = await supabase
        .from('custom_room')
        .insert(
          {
            room_name: roomDetails.name,
            room_pw: roomDetails.room_password,
            room_owner: user_id,
            room_settings: {
              game_rounds: roomDetails.game_rounds,
              round_duration: roomDetails.round_duraion
            },
            room_participants: [{
              room_user_id: user_id,
              room_user_name: user_name,
              room_user_profile: user_profile_pic,
            }],
            room_chat: [{
              chatter_id: user_id,
              chatter_name: user_name,
              chatter_image: user_profile_pic,
              chatter_message: `${user_name} created the room`,
              chatter_time: new Date().toLocaleTimeString()
            }]
          }
        ).select()

      if (error) {
        toast.error("Error creating room")
        return;
      }

      await sendMessage(data[0].room_id as string, `${user_name} joined the room`, user_id, user_name, user_profile_pic)

      toast.success("Room created")
      console.log(data)
      localStorage.setItem('custom_room_details', JSON.stringify(data[0].room_id as string))
      dispatch(setRoom(data[0] as any))
      location(`/customroom/Room/${data[0].room_id}`)
    }
    catch (error) {
      console.log(error)
    }
    finally {
      toast.dismiss(loader)
      setCreateRoomModal(false)
    }
  }

  function changeCreateModel(e: any) {
    e.preventDefault();
    setRoomDetails({ ...roomDetails, [e.target.name]: e.target.value })
  }

  function changeJoinModel(e: any) {
    e.preventDefault();
    setJoinRoomDetails({ ...joinRoomDetails, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-purple-950 w-full h-[100vh] ">

      <div className="absolute top-0 flex justify-between w-full px-20 ">
        <img className="invert w-[200px] h-[200px]" src={logo} alt="Logo" />
      </div>


      <div className="flex justify-start items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
        <div className="flex items-center justify-between">
          <ul className="tracking-wider text-white uppercase ">
            <li onClick={() => setCreateRoomModal(true)} className="mb-8 text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-400">
              Create Room
            </li>
            <li onClick={() => setJoinRoomModal(true)} className="mb-8 text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-400">
              Join Room
            </li>
            <Link to="/mode">
              <li className="text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-400">
                Go Back
              </li>
            </Link>
          </ul>
        </div>
      </div>

      {/* Create Modal */}
      <div className={`absolute duration-200 top-0 left-0 ${createRoomModal ? 'opacity-100' : 'opacity-0 invisible'} z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-lg '}`}>
        <div className={`relative w-[400px] border duration-300 text-white border-purple-900 rounded-3xl flex flex-col px-6 py-8 ${createRoomModal ? 'scale-100 opacity-100' : 'opacity-0 scale-50 invisible'} `}>
          <div className="flex flex-col">
            <label className="mb-5 text-xl text-center">Join Room</label>
            <label className="w-full pl-2 mb-1 text-lg">Room Name</label>
            <input
              type="text"
              value={roomDetails.name}
              name="name"
              onChange={changeCreateModel}
              className="mx-auto w-full rounded-lg border border-purple-800 duration-300 bg-transparent p-2 mb-4 focus:outline-none focus:border-purple-400"
            />

            <label className="w-full pl-2 mb-1 text-lg">Room Passkey</label>
            <input
              type="number"
              placeholder="Enter desired passkey"
              value={roomDetails.room_password}
              name="room_password"
              onChange={changeCreateModel}
              className=" mx-auto rounded-lg border border-purple-800 bg-transparent duration-300 w-full p-2 mb-4 focus:outline-none focus:border-purple-400"
            />

            <label className="w-full pl-2 mb-1 text-lg">Number of Rounds</label>
            <input
              type="number"
              placeholder="Enter number of rounds"
              value={roomDetails.game_rounds}
              name="game_rounds"
              onChange={changeCreateModel}
              className="mx-auto w-full rounded-lg border border-purple-800 bg-transparent duration-300 p-2 mb-4 focus:outline-none focus:border-purple-400"
            />

            <label className="w-full pl-2 mb-1 text-lg">Round Duration (in seconds)</label>
            <input
              type="number"
              placeholder="Enter round duration"
              value={roomDetails.round_duraion}
              name="round_duraion"
              onChange={changeCreateModel}
              className=" mx-auto rounded-lg border border-purple-800 bg-transparent duration-300 w-full p-2 mb-4 focus:outline-none focus:border-purple-400"
            />

            <div className="flex flex-row-reverse justify-center gap-3 mt-5">
              <button
                onClick={createRoomHandle}
                id='fn_button'
                style={{ fontSize: '1.2rem', padding: '1rem 1.2rem' }}
              >
                Create<span id='fnButtonSpan'></span>
              </button>
              <button
                onClick={() => setCreateRoomModal(false)}
                id='fn_button'
                style={{ fontSize: '1.2rem', padding: '1rem 1.2rem' }}
              >
                Close<span id='fnButtonSpan'></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      <div className={`absolute duration-200 top-0 left-0 ${joinRoomModal ? 'opacity-100' : 'opacity-0 invisible'} z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-lg '}`}>
        <div className={`relative w-[400px] duration-300 border text-white border-purple-900 rounded-3xl flex flex-col px-6 py-8 ${joinRoomModal ? 'scale-100 opacity-100' : 'opacity-0 scale-50 invisible'} `}>
          <label className="mb-5 text-xl text-center">Join Room</label>
          <div className="flex flex-col">
            <label className="w-full pl-2 mb-1 text-lg">Room ID</label>
            <input
              type="text"
              placeholder="Enter room's ID"
              value={joinRoomDetails.room_id}
              name="room_id"
              onChange={changeJoinModel}
              className="w-full p-2 mx-auto mb-4 duration-300 bg-transparent border border-purple-800 rounded-lg focus:outline-none focus:border-purple-400"
            />

            <label className="w-full pl-2 mb-1 text-lg">Room Passkey</label>
            <input
              type="text"
              placeholder="Enter room's passkey"
              value={joinRoomDetails.room_password}
              name="room_password"
              onChange={changeJoinModel}
              className="w-full p-2 mx-auto mb-4 duration-300 bg-transparent border border-purple-800 rounded-lg focus:outline-none focus:border-purple-400"
            />

            <div className="flex flex-row-reverse justify-center gap-3 mt-5">
              <button
                onClick={joinRoomHandleBtn}
                id='fn_button'
                style={{ fontSize: '1.2rem', padding: '1rem 1.2rem' }}
              >
                Join<span id='fnButtonSpan'></span>
              </button>
              <button
                onClick={() => setJoinRoomModal(false)}
                id='fn_button'
                style={{ fontSize: '1.2rem', padding: '1rem 1.2rem' }}
              >
                Close<span id='fnButtonSpan'></span>
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  )

}

export default CustomGame
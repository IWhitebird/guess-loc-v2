import { useState } from "react";
import ChatModel from "../../components/chatmodel"
import supabase from "../../supabase/init";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setRoom, removeRoom } from "../../redux/slices/roomSlice";
import { useNavigate } from 'react-router-dom';
import { IoSettingsSharp } from "react-icons/io5";
import { RiDoorOpenFill } from "react-icons/ri";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { PiPlayFill } from "react-icons/pi";
import randomStreetView from "../../scripts/index";
import { IoGameController } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { updateRoomChat, sendMessage } from "../../supabase/Routes/RoomRoutes";

const Room = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()

  const { user_id, user_name } = useSelector((state: RootState) => state.user)
  const roomDetails = useSelector((state: RootState) => state.room)
  const [gameMode] = useState(false)

  const channel = supabase.channel(`${roomDetails.room_id}`)

  const [roomSettingsChange, setRoomSettingsChange] = useState({
    game_rounds: roomDetails?.room_settings?.game_rounds,
    round_duration: roomDetails?.room_settings?.round_duration
  })
  const [changeSettingsModal, setChangeSettingsModal] = useState(false)

  async function ChangeRoomSettings() {

    dispatch(setRoom({
      ...roomDetails,
      room_settings: roomSettingsChange
    }))

    await supabase
      .from('custom_room')
      .update({
        'room_settings': roomSettingsChange
      })
      .match({ 'room_id': roomDetails.room_id })

    setChangeSettingsModal(false)
  }

  async function LeaveRoom() {
    try {

      // Send Message on Websocket
      sendMessage(roomDetails.room_id as string, `${user_name} joined the room`, user_id, user_name)

      // Update Room Chat 
      await updateRoomChat(roomDetails.room_id as string, user_id, user_name, `${user_name} joined the room`,)

      localStorage.removeItem('custom_room_details')
      supabase.removeChannel(channel)
      dispatch(removeRoom())
      navigate('/customroom')
    } catch (error) {
      console.log(error)
    }
  }

  async function startGameHandle() {
    const startingGame = toast.loading("Starting Game...")

    const randomLatLng = await randomStreetView.getRandomLocations(roomDetails.room_settings.game_rounds);

    interface lat_lng {
      lat: string;
      lng: string;
    }

    const lat_lng_arr: lat_lng[] = [];

    for (let i = 0; i < randomLatLng.length; i++) {
      const temp: lat_lng = {
        lat: randomLatLng[i][0].toString(),
        lng: randomLatLng[i][1].toString()
      }
      lat_lng_arr.push(temp)
    }

    const { data, error }: any = await supabase.from('game').insert({
      game_type: gameMode,
      room_id: roomDetails.room_id,
      total_rounds: roomDetails.room_settings.game_rounds,
      round_duration: roomDetails.room_settings.round_duration,
      game_participants: roomDetails.room_participants,
      lat_lng_arr: lat_lng_arr,
      cur_round: 0,
      cur_round_start_time: null,
      round_details: null,
      game_winner: null,
    }).select()

    if (error) {
      toast.dismiss(startingGame)
      toast.error("Error in creating game")
      throw error
    }

    await supabase.from('custom_room')
      .update({ cur_game_id: data[0].game_id })
      .match({ room_id: roomDetails.room_id })

    dispatch(setRoom({
      ...roomDetails,
      cur_game_id: data[0].game_id
    }))
    toast.dismiss(startingGame)
    toast.success("Game Started")

    channel.send({
      type: 'broadcast',
      event: 'game_started',
      payload: {
        game_id: data[0].game_id,
        message: 'Game Started'
      }
    });

    // navigate(`/mpGame/${data[0].game_id}`)
    window.location.href = `/mpGame/${data[0].game_id}`
  }

  function changeSettingsInput(e: any) {
    e.preventDefault();
    setRoomSettingsChange({ ...roomSettingsChange, [e.target.name]: e.target.value })
  }


  channel.on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'custom_room',
      filter: `room_id=eq.${roomDetails.room_id}`
    },
    payload => {
      // console.log("payload", payload)
      dispatch(setRoom(payload.new as any))
    }
  ).subscribe()

  channel.on(
    'broadcast',
    { event: 'game_started' },
    ({ payload }) => {
      toast.success("Game Started")
      dispatch(setRoom({
        ...roomDetails,
        cur_game_id: payload.game_id
      }))
      navigate(`/mpGame/${payload.game_id}`)
    }
  )

  console.log("ruru", roomDetails)

  return (
    <div className="flex bg-purple-950  justify-start items-center p-6 h-screen w-full bg-gradient-to-r from-gray-950 to-transparent">
      <div className="flex w-full h-full">
        
        <div className="flex flex-col items-center justify-center w-full mt-40 h-20">
          <h1 className="text-2xl text-white">ROOM INFO</h1>
          <div className="flex flex-col items-center w-full h-20 mt-5 justify-left">
            <div className="text-lg text-white">Name : {roomDetails.room_name}</div>
            <div className="text-lg text-white">Game Rounds : {roomDetails.room_settings?.game_rounds}</div>
            <div className="text-lg text-white">Round Duratio : {roomDetails.room_settings?.round_duration}</div>
            <div className="mt-10">
              <div className="pt-4">
                <button id='fn_button' style={{ fontSize: '1.4rem', padding: '1.4rem 1.4rem 1.4rem 1.9rem' }} onClick={() => setChangeSettingsModal(true)}>
                  <IoGameController className="mr-2 text-2xl" /> Game Modes
                  <span id='fnButtonSpan'></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 absolute left-0 flex items-center">
          <button id='fn_button' style={{ fontSize: '1.1rem', padding: '1rem' }} onClick={LeaveRoom}>
            <RiDoorOpenFill className="mr-2 text-xl" />LEAVE ROOM
            <span id='fnButtonSpan'></span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-start w-full mt-10 p-10">
          <div className="">
            <button id='fn_button' style={{ fontSize: '1.1rem', padding: '1rem 1rem 1rem 1.5rem' }} onClick={() => setChangeSettingsModal(true)}>
              <IoSettingsSharp className="mr-2" /> CHANGE SETTINGS
              <span id='fnButtonSpan'></span>
            </button>
          </div>

          <div className="mt-5">
            <button onClick={startGameHandle} id='fn_button' style={{ fontSize: '1.5rem', padding: '2rem 2rem 2rem 2.5rem' }}>
              <PiPlayFill className="mr-4" /> START GAME
              <span id='fnButtonSpan'></span>
            </button>
          </div>
        </div>


        <div className="w-[600px] pt-20 flex justify-end  ">
          <div className="w-full bg-[#ffffff2c] backdrop-blur-md h-full flex rounded-xl">
            <div className="flex flex-col  h-full px-4 w-[400px] border-r">
              <h1 className="pt-6 pl-2 text-2xl text-white">Players</h1>
              {roomDetails?.room_participants?.map((participant, index: number) => (
                <div key={index}>
                  <div className="flex flex-row items-center justify-start w-full h-20">
                    <img className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.3)]" src={participant.room_user_profile ? participant.room_user_profile : `https://api.dicebear.com/6.x/personas/svg?seed=${participant.room_user_name}`} />
                    <div className="ml-2 text-md text-white">{participant.room_user_name.length > 15 ? `${participant.room_user_name.slice(0, 15)}...` : participant.room_user_name}</div>
                  </div>
                  <hr className="w-full" />
                </div>
              ))}
            </div>
            <div className="w-[600px]">
              <ChatModel />
            </div>
          </div>
        </div>

        <div className={`absolute duration-200 top-0 left-0
          ${changeSettingsModal ? 'opacity-100' : 'opacity-0 invisible'}
          z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-lg '}`}>
          <div className={`relative w-[400px] duration-300 border text-white border-purple-900 rounded-lg flex flex-col p-10 ${changeSettingsModal ? 'scale-100 opacity-100' : 'opacity-0 scale-50 invisible'} `}>

            <div className="flex flex-col items-center justify-center">
              <label className="w-full mx-auto mb-1">Game Rounds</label>
              <div className="flex items-center">
                <input
                  type='number'
                  value={roomSettingsChange?.game_rounds}
                  name="game_rounds"
                  placeholder="Choose Game Rounds (1-5)"
                  onChange={changeSettingsInput}
                  className="w-full p-2 duration-300 bg-transparent border border-purple-800 rounded-lg focus:outline-none focus:border-purple-400"
                />
                <div className="flex items-center justify-center gap-3 ml-5">
                  <button
                    onClick={() => setRoomSettingsChange({ ...roomSettingsChange, game_rounds: roomSettingsChange?.game_rounds + 1 })}
                    disabled={roomSettingsChange?.game_rounds >= 15}
                    id='fn_button'
                    className={`${roomSettingsChange.game_rounds >= 15 && 'cursor-not-allowed'}`}
                    style={{ fontSize: '1.4rem', padding: '0.6rem 1.5rem' }}
                  >
                    <FaPlusCircle /><span id='fnButtonSpan'></span>
                  </button>
                  <button
                    onClick={() => setRoomSettingsChange({ ...roomSettingsChange, game_rounds: roomSettingsChange?.game_rounds - 1 })}
                    id='fn_button'
                    disabled={roomSettingsChange?.game_rounds <= 1}
                    className={`${roomSettingsChange?.game_rounds <= 1 && 'cursor-not-allowed'}`}
                    style={{ fontSize: '1.4rem', padding: '0.6rem 1.5rem' }}
                  >
                    <FaMinusCircle /><span id='fnButtonSpan'></span>
                  </button>
                </div>
              </div>

              <label className="w-full mx-auto my-2">Round Duration</label>
              <input
                type="text"
                placeholder="Enter Round Duration"
                value={roomSettingsChange?.round_duration}
                name="round_duration"
                onChange={changeSettingsInput}
                className="w-full p-2 mx-auto mb-4 duration-300 bg-transparent border border-purple-800 rounded-lg focus:outline-none focus:border-purple-400"
              />



              <div className="flex flex-row-reverse justify-center gap-3 mt-5">
                <button
                  onClick={ChangeRoomSettings}
                  id='fn_button'
                  style={{ fontSize: '1.2rem', padding: '1rem 1.5rem' }}
                >
                  Done<span id='fnButtonSpan'></span>
                </button>
                <button
                  onClick={() => setChangeSettingsModal(false)}
                  id='fn_button'
                  style={{ fontSize: '1.2rem', padding: '1rem 1.5rem' }}
                >
                  Close<span id='fnButtonSpan'></span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Room

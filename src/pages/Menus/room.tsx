import { useState } from "react";
import ChatModel from "../../components/chatmodel"
import supabase from "../../supabase/init";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setRoom } from "../../redux/slices/roomSlice";

const Room = () => {
  const dispatch : AppDispatch = useDispatch()
  const roomDetails = useSelector((state: RootState) => state.room)
  const channel =   supabase.channel(`${roomDetails.room_id}`)

  const [roomSettingsChange , setRoomSettingsChange] = useState({
    game_rounds : 0,
    round_duration : 0
  })
  const [changeSettingsModal , setChangeSettingsModal] = useState(false)

  function ChangeRoomSettings() {

  }

  channel.on('postgres_changes', 
    { event: 'UPDATE', 
      schema: 'public', 
      table: 'custom_room', 
      filter: 'room_id=eq.'+roomDetails.room_id
    },
      payload => {
        dispatch(setRoom(payload.new as any))
      }
    )
    .subscribe()

    function changeSettingsInput(e: any) {
      e.preventDefault();
      setRoomSettingsChange({ ...roomSettingsChange, [e.target.name]: e.target.value })
    }
    
  return (
    <div className="bg-purple-950 w-full h-[100vh] ">
        <div className="flex justify-start items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
            <div className="flex w-full h-full flex-row">

                <div className="w-[50%]">
                  {
                    roomDetails?.room_participants?.map((participant : any , index) => {
                      return (
                        <div key={index} className="flex justify-start items-center h-20 w-full">
                          <div className="w-12 h-12 rounded-full bg-white mr-4"></div>
                          <div className="text-white text-lg">{participant.room_user_name}</div>
                          <img src={participant.room_user_image} />
                        </div>
                      )
                    })
                  }
                </div>

                <div>
                  <h1 className="text-white text-2xl">ROOM INFO</h1>
                  <div className="flex flex-row justify-center items-center h-20 w-full">
                    <div className="text-white text-lg">Name : {roomDetails.room_name}</div>
                    <div className="text-white text-lg">Game Rounds : {roomDetails.room_settings.game_rounds}</div>
                    <div className="text-white text-lg">Round Duratio : {roomDetails.room_settings.round_duration}</div>
                  </div>
                </div>

                <div  className="w-[50%] ml-20 mt-16 p-10 flex justify-end">
                    <ChatModel />
                </div>

            </div>

        </div>

        {
          changeSettingsModal && 
          <div className={`absolute duration-200 top-0 left-0 ${changeSettingsModal ? 'opacity-100' : 'opacity-0 invisible'} z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-lg '}`}>
          <div className={`relative w-[400px] duration-300 border text-white border-purple-900 rounded-lg flex flex-col p-10 ${changeSettingsModal ? 'scale-100 opacity-100' : 'opacity-0 scale-50 invisible'} `}>
  
            <div className="flex flex-col">
              <label className="w-full mx-auto mb-1">Game Rounds</label>
              <input
                type="text"
                placeholder="Enter room name"
                value={roomSettingsChange.game_rounds}
                name="game_rounds"
                onChange={changeSettingsInput}
                className="w-full p-2 mx-auto mb-4 duration-300 bg-transparent border border-purple-800 rounded-lg focus:outline-none focus:border-purple-400"
              />
  
              <label className="w-full mx-auto mb-1">Round Duration</label>
              <input
                type="text"
                placeholder="Enter number of rounds"
                value={roomSettingsChange.round_duration}
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
        }       
    </div>
  )
}

export default Room
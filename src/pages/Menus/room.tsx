import { useState , useEffect } from "react";
import ChatModel from "../../components/chatmodel"
import supabase from "../../supabase/init";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setRoom } from "../../redux/slices/roomSlice";

const Room = () => {

  const dispatch : AppDispatch = useDispatch()
  const roomDetails = useSelector((state: RootState) => state.room)

  useEffect(() => {
        supabase
          .channel(`${roomDetails.room_id}`)
          .on('postgres_changes', 
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
    }, []);
 
    
  return (
    <div className="bg-purple-950 w-full h-[100vh] ">
        <div className="flex justify-start items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
            <div className="flex w-full h-full flex-row">

                <div className="w-[50%]">

                </div>

                <div  className="w-[50%] ml-20 mt-16 p-10 flex justify-end">
                    <ChatModel />
                </div>

            </div>

        </div>
    </div>
  )
}

export default Room
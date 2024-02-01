import supabase from "../init";

export async function sendMessage(roomId : string , message : string , ...args : any[]) {
    let tempChanel = supabase.channel(`${roomId}_chat`) 
    tempChanel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') { return } 
      tempChanel.send({
          type: 'broadcast',
          event: 'room_chatting',
          payload : {
              chatter_id: args[0],
              chatter_name: args[1],
              chatter_image: args[2],
              chatter_message: message,
              chatter_time: new Date().toLocaleTimeString()
          }
        })
    })
}

export async function updateRoomChat(roomId : string , ...args : any[])  {

    const msg = {
        chatter_id: args[0],
        chatter_name: args[1],
        chatter_message: args[2],
        chatter_time: new Date().toLocaleTimeString()
    }

    await supabase.rpc('append_array_to_uuid_row_room_chat', {
        row_id : roomId,
        new_values : [msg]
    })
}

export async function updateRoomParticipants(roomId : string, existing_participants : any[] , ...args : any[])  {
    const new_usr = {
        room_user_id: args[0],
        room_user_name: args[1],
        room_user_profile: args[2]
    }
    if(!existing_participants.filter((usr) => usr.room_user_id === new_usr.room_user_id).length) {
        await supabase.rpc('append_array_to_uuid_row_room_participants', {
            row_id : roomId,
            new_values : [new_usr]
        })
    }
    
    const { data } : any = await supabase.from('custom_room').select().eq('room_id', roomId)
    return data[0]

}

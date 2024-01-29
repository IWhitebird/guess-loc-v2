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

export async function updateRoom(roomId : string , message : string , ...args : any[])  {

    const msg = {
        chatter_id: args[1],
        chatter_name: args[2],
        chatter_image: args[3],
        chatter_message: message,
        chatter_time: new Date().toLocaleTimeString()
    }

    // await supabase.from('custom_room').update({
    //     room_chat: [...args[0].room_chat, {
    //         chatter_id: args[1],
    //         chatter_name: args[2],
    //         chatter_image: args[3],
    //         chatter_message: message,
    //         chatter_time: new Date().toLocaleTimeString()
    //     }] as any
    // }).match({ room_id: roomId })

    const a = await supabase.rpc('append_array_to_uuid_row', {
        row_id : roomId,
        new_values : [msg]
    })
    console.log(a)

}

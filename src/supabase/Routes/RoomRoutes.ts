import supabase from "../init";

export async function sendMessage(channel_id : string , message : string , ...args : any[]) {
    await supabase.channel(channel_id).
    send({
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
}

export async function updateRoomChat(roomId : string , message : string , ...args : any[])  {

    const msg = {
        chatter_id: args[0],
        chatter_name: args[1],
        chatter_image: args[2],
        chatter_message: message,
        chatter_time: new Date().toLocaleTimeString()
    }

    await supabase.rpc('append_array_to_uuid_row_room_chat', {
        row_id : roomId,
        new_values : [msg]
    })
}

export async function joinRoomHandle(roomId : string, existing_participants : any[] , ...args : any[])  {
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

export async function leaveRoomHandle(roomId : string, existing_participants : any[] , ...args : any[])  {
    const remove_user = {
        room_user_id: args[0],
        room_user_name: args[1],
        room_user_profile: args[2]
    }
    if(existing_participants.filter((usr) => usr.room_user_id === remove_user.room_user_id).length) {
        await supabase.rpc('de_append_array_to_uuid_row_room_participants', {
            row_id : roomId,
            values_to_remove : [remove_user]
        })
    }
    
    const { data } : any = await supabase.from('custom_room').select().eq('room_id', roomId)
    return data[0]
}

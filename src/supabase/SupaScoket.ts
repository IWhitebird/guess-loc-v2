import supabase from './init.ts'


export async function createRoom(userId : string , roomPw : string) {
    
    const { data, error } = await supabase.from('custom_room').insert([
        { room_owner: userId , room_pw : roomPw },
    ]).select()
    if (error) {
        console.log(error)
        return
    }
    console.log(data)
    return data
   
}



async function joinRoom(userId : string, roomId : string) {
   
    const channel = supabase.channel(`${roomId}`)

    channel.on('broadcast', { event: 'cursor-pos' }, 
    payload => {
        console.log('Cursor position received!', payload)
      })
    .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
        channel.send({
        type: 'broadcast',
        event: 'player-chat',
        payload: { message: `Hello world! player ${userId}`},
        })
    }
    })

}

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import supabase from '../../supabase/init'

interface RoomSettings {
    game_rounds: number;
    round_duration: number;
}

interface RoomChat {
    chatter_id: string;
    chatter_name: string;
    chatter_image: string;
    chatter_message: string;
    chatter_time: string;
}

interface RoomUsers {
    room_user_id: string;
    room_user_name: string;
    room_user_image: string;
}

interface RoomState {
    room_id: string;
    room_owner: string;
    room_name: string;
    room_settings: RoomSettings;
    room_participants: RoomUsers[];
    room_chat: RoomChat[];
}


if (localStorage.getItem('custom_room_details') === null) {
    var iState : RoomState = {
        room_id: '',
        room_owner: '',
        room_name: '',
        room_settings: {
            game_rounds: 0,
            round_duration: 0
        },
        room_participants: [],
        room_chat: []  
    }
} else {
    const parsedToken = JSON.parse(localStorage.getItem('custom_room_details')!);
    
    const { data , error}  = await supabase.from('custom_room').select().eq('room_id', parsedToken.room_id) as any

    if (error) {
        var iState : RoomState = {
            room_id: parsedToken.room_id,
            room_owner: parsedToken.room_owner,
            room_name: parsedToken.room_name,
            room_settings: {
                game_rounds: parsedToken.room_settings.game_rounds,
                round_duration: parsedToken.room_settings.round_duration
            },
            room_participants: parsedToken.room_participants,
            room_chat: parsedToken.room_chat
        }
    } else {

        var iState : RoomState= {
            room_id: data[0].room_id!,
            room_owner: data[0].room_owner!,
            room_name: data[0].room_name!,
            room_settings: {
                game_rounds: data[0].room_settings.game_rounds,
                round_duration: data[0].room_settings.round_duration
            },
            room_participants: data[0].room_participants,
            room_chat: data[0].room_chat
        }
    }
}

export const roomSlice = createSlice({
  name: 'room',  

  initialState : iState,

  reducers: {

    setRoom: (state, action: PayloadAction<RoomState>) => {
        state.room_id = action.payload.room_id
        state.room_owner = action.payload.room_owner
        state.room_name = action.payload.room_name
        state.room_settings = action.payload.room_settings
        state.room_participants = action.payload.room_participants
        state.room_chat = action.payload.room_chat
    },

    updateChat : (state, action: PayloadAction<RoomChat>) => {
        state.room_chat = action.payload as any
    },

    updateSettings: (state, action: PayloadAction<RoomSettings>) => {
        state.room_settings.game_rounds = action.payload.game_rounds
        state.room_settings.round_duration = action.payload.round_duration
    },

    removeRoom: (state) => {
        state.room_id = ''
        state.room_owner = ''
        state.room_name = ''
        state.room_settings.game_rounds = 0
        state.room_settings.round_duration = 0
        state.room_participants = []
        state.room_chat = []
    },

  },

})


export const { setRoom , removeRoom ,updateChat} = roomSlice.actions

export default roomSlice.reducer 


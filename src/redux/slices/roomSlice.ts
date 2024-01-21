import { createSlice, PayloadAction } from '@reduxjs/toolkit'


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

interface RoomState {
    room_id: string;
    room_owner: string;
    room_name: string;
    room_settings: RoomSettings;
    room_participants: string[];
    room_chat: RoomChat[];
}

if (localStorage.getItem('custom_room_details') === null) {
    var initialState: RoomState = {
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
    var initialState: RoomState = {
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
}

export const roomSlice = createSlice({
  name: 'room',  

  initialState,

  reducers: {

    setRoom: (state, action: PayloadAction<RoomState>) => {
        state.room_id = action.payload.room_id
        state.room_owner = action.payload.room_owner
        state.room_name = action.payload.room_name
        state.room_settings.game_rounds = action.payload.room_settings.game_rounds
        state.room_settings.round_duration = action.payload.room_settings.round_duration
        state.room_participants = action.payload.room_participants
        state.room_chat = action.payload.room_chat
    },

    updateChat : (state, action: PayloadAction<RoomChat>) => {
        state.room_chat = action.payload as any
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
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import supabase from '../../supabase/init'
import { joinRoomHandle , leaveRoomHandle } from '../../supabase/Routes/RoomRoutes';

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
    room_user_profile: string;
}

interface RoomState {
    room_id: string;
    room_owner: string;
    room_name: string;
    room_settings: RoomSettings;
    room_participants: RoomUsers[];
    room_chat: RoomChat[];
    cur_game_id?: string;
}

let iState: RoomState = {
    room_id: '',
    room_owner: '',
    room_name: '',
    room_settings: {
        game_rounds: 0,
        round_duration: 0
    },
    room_participants: [],
    room_chat: [],
    cur_game_id: '',
};

if (localStorage.getItem('custom_room_details') === null) {
    iState = {
        room_id: '',
        room_owner: '',
        room_name: '',
        room_settings: {
            game_rounds: 0,
            round_duration: 0
        },
        room_participants: [],
        room_chat: [],
        cur_game_id: '',
    }
} else {
    const parsedToken = JSON.parse(localStorage.getItem('custom_room_details')!);

    const data: any = await updateRoom(parsedToken)
    console.log("DOOOTAAA" , data)
    if (data) {
        console.log("DOOOTAAA" , data)
        iState = {
            room_id: data[0].room_id!,
            room_owner: data[0].room_owner!,
            room_name: data[0].room_name!,
            room_settings: {
                game_rounds: data[0].room_settings.game_rounds,
                round_duration: data[0].room_settings.round_duration
            },
            room_participants: data[0].room_participants,
            room_chat: data[0].room_chat,
            cur_game_id: data[0].cur_game_id,
        }
    }
    else if (data === "error") {
        iState = {
            room_id: '',
            room_owner: '',
            room_name: '',
            room_settings: {
                game_rounds: 0,
                round_duration: 0
            },
            room_participants: [],
            room_chat: [],
            cur_game_id: '',
        }
    }
}

async function updateRoom(room_id: string) {
    const { data, error } = await supabase.
        from('custom_room').
        select().
        eq('room_id', room_id)

    if (error)
        return "error"
    else
        return data;
}

export const roomSlice = createSlice({
    name: 'room',

    initialState: iState,

    reducers: {

        setRoom: (state, action: PayloadAction<RoomState>) => {
            state.room_id = action.payload.room_id
            state.room_owner = action.payload.room_owner
            state.room_name = action.payload.room_name
            state.room_settings = action.payload.room_settings
            state.room_participants = action.payload.room_participants
            state.room_chat = action.payload.room_chat
            state.cur_game_id = action.payload.cur_game_id
        },

        updateChat: (state, action: PayloadAction<RoomChat>) => {
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

        setJoinedRoom: (state, action: PayloadAction<{ room_id: string, user_id: string , user_name : string , user_profile_pic : string }>) => {
            setRoom(joinRoomHandle(action.payload.room_id, state.room_participants, action.payload.user_id, action.payload.user_name, action.payload.user_profile_pic) as any)
        },

        setLeftRoom: (state, action: PayloadAction<{ room_id: string, user_id: string , user_name : string , user_profile_pic : string }>) => {
            setRoom(leaveRoomHandle(action.payload.room_id,state.room_participants, action.payload.user_id, action.payload.user_name, action.payload.user_profile_pic) as any)
            if(state.room_owner === action.payload.user_id) {
                for(let i = 0; i < state.room_participants.length; i++) {
                    if(state.room_participants[i].room_user_id !== action.payload.user_id) {
                        state.room_owner = state.room_participants[i].room_user_id
                        break;
                    }
                }
            }
        },
    },

})

export const { setRoom, removeRoom, updateChat, setJoinedRoom, setLeftRoom } = roomSlice.actions

export default roomSlice.reducer


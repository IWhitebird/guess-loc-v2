import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import supabase from '../../supabase/init'

interface lat_lng {
    lat: string;
    lng: string;
}

interface GameUsers {
    room_user_id: string;
    room_user_name: string;
    room_user_image: string;
}

interface RoundDetails {
    round_lat : string,
    round_lng : string,
    user_details : RoundUserDetails[]
}

interface RoundUserDetails {
    round_no : number,
    user_name: string,
    user_id: string,
    guessLat: string,
    guessLng: string,
    guessDistance: number,
    userPoints: number
}

interface GameState {
    game_id: string;
    room_id: string;
    game_type: string;
    total_rounds: number;
    round_duration: number;
    lat_lng_arr : lat_lng[];
    cur_round : number;
    game_winner : string | null;
    game_participants: GameUsers[],
    round_details : RoundDetails[],
    cur_round_start_time : Date | null,
}

let iState: GameState = {
    game_id: '',
    room_id: '',
    game_type: '',
    total_rounds: 0,
    round_duration: 0,
    lat_lng_arr : [],
    cur_round : 0,
    game_winner : null,
    game_participants: [],
    round_details : [],
    cur_round_start_time : null,
};

if (localStorage.getItem('custom_game_details') === null) {
    iState = {
        game_id: '',
        room_id: '',
        game_type: '',
        total_rounds: 0,
        round_duration: 0,
        lat_lng_arr : [],
        cur_round : 0,
        game_winner : null,
        game_participants: [],
        round_details : [],
        cur_round_start_time : null,
    }
} else {
    const parsedToken = JSON.parse(localStorage.getItem('custom_game_details')!);
    const data : any = await updateGame(parsedToken.game_id)

    iState = {
        game_id: data[0].game_id,
        room_id: data[0].room_id,
        game_type: data[0].game_type,
        total_rounds: data[0].total_rounds,
        round_duration: data[0].round_duration,
        lat_lng_arr : data[0].lat_lng_arr,
        cur_round : data[0].cur_round,
        game_winner : data[0].game_winner,
        game_participants: data[0].game_participants,
        round_details : data[0].round_details,
        cur_round_start_time : data[0].cur_round_start_time,
    }
}

async function updateGame(game_id : string) {
    const { data, error } = await supabase
        .from('game')
        .select()
        .eq('game_id', game_id)

    if (error || data.length === 0) {
        return "error"
    }
    else {
        return data
    }
}


export const gameSlice = createSlice({
    name: 'game',

    initialState: iState,

    reducers: {

        setGame: (state, action: PayloadAction<GameState>) => {
            state.game_id = action.payload.game_id
            state.room_id = action.payload.room_id
            state.game_type = action.payload.game_type
            state.total_rounds = action.payload.total_rounds
            state.round_duration = action.payload.round_duration
            state.lat_lng_arr = action.payload.lat_lng_arr
            state.cur_round = action.payload.cur_round
            state.game_winner = action.payload.game_winner
            state.game_participants = action.payload.game_participants
            state.round_details = action.payload.round_details ? action.payload.round_details : []
            state.cur_round_start_time = action.payload.cur_round_start_time
        },

        updateRoundDetails : (state, action : PayloadAction<RoundDetails[]>) => {
            state.round_details = action.payload
        },

        updateRoundStartTime : (state, action : PayloadAction<Date>) => {
            state.cur_round_start_time = action.payload
        },

        updateCurRound : (state , action : PayloadAction<number>) => {
            state.cur_round = action.payload
        },

        removeGame: (state) => {
            state.game_id = ''
            state.room_id = ''
            state.game_type = ''
            state.total_rounds = 0
            state.round_duration = 0
            state.lat_lng_arr = []
            state.cur_round = 0
            state.game_winner = null
            state.game_participants = []
            state.round_details = []
            state.cur_round_start_time = null   
        },

    },

})


export const { setGame, removeGame, updateRoundDetails, updateRoundStartTime, updateCurRound } = gameSlice.actions

export default gameSlice.reducer


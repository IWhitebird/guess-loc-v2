import { combineReducers } from '@reduxjs/toolkit';

import userReducer from '../slices/userSlice';
import roomReducer from '../slices/roomSlice';
import gameReducer from '../slices/gameSlice';

const rootReducer = combineReducers({
    user: userReducer,
    room: roomReducer,
    game: gameReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
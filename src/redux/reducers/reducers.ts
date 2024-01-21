import { combineReducers } from '@reduxjs/toolkit';

import userReducer from '../slices/userSlice';
import roomReducer from '../slices/roomSlice';

const rootReducer = combineReducers({
    user: userReducer,
    room: roomReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
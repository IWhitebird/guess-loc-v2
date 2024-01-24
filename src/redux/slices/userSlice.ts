import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    user_id: string;
    user_name: string;
    user_email: string;
    user_profile_pic: string;
}

if (localStorage.getItem('sb-pdnogztwriouxeskllgm-auth-token') === null) {
    var initialState: UserState = {
        user_id: '',
        user_name: '',
        user_email: '',
        user_profile_pic: '',
    }
} else {
    const parsedToken = JSON.parse(localStorage.getItem('sb-pdnogztwriouxeskllgm-auth-token')!);
    var initialState: UserState = {
        user_id: parsedToken.user.id,
        user_name: parsedToken.user.user_metadata.full_name,
        user_email: parsedToken.user.email,
        user_profile_pic: 
                parsedToken.user.user_metadata.avatar_url ?  parsedToken.user.user_metadata.avatar_url :
                `https://api.dicebear.com/6.x/personas/svg?seed=${parsedToken.user.user_metadata.full_name}`,
    }
}

export const userSlice = createSlice({
  name: 'user',  

  initialState,

  reducers: {

    setUser: (state, action: PayloadAction<UserState>) => {
      state.user_id = action.payload.user_id
      state.user_name = action.payload.user_name
      state.user_email = action.payload.user_email
      state.user_profile_pic = action.payload.user_profile_pic
    },

    removeUser: (state) => {
      state.user_id = ''
      state.user_name = ''
      state.user_email = ''
      state.user_profile_pic = ''
    },

  },

})

export const { setUser , removeUser } = userSlice.actions

export default userSlice.reducer
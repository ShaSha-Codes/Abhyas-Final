import {createSlice} from '@reduxjs/toolkit'

export const userSlice=createSlice({
    name:"user",
    initialState:{value:{email:'',profile:false}},
    reducers:{
        login:(state,action)=>{
            state.value={...state.value,...action.payload}
        },
    }
})

export const {login}=userSlice.actions

export default userSlice.reducer

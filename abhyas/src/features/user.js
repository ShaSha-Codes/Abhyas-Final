import {createSlice} from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
export const userSlice=createSlice({
    name:"user",
    initialState:{value:{email:'',profile:false}},
    reducers:{
        login:(state,action)=>{
            state.value={...state.value,...action.payload}
        },
        logout:(state)=>{
            state.value={email:'',profile:false}
        },
       
    }
})

export const {login,logout}=userSlice.actions

export default userSlice.reducer

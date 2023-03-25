import React from 'react'
import { useSelector,useDispatch } from 'react-redux'

import {doc,getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import { useNavigate } from 'react-router-dom'
const useLogout = () => {
    let user=useSelector(state=>state.user.value)
    let navigate=useNavigate()
    const checker=async (value,code)=>{
       console.log(value,code)
        if(user.email===''){
            navigate('/',{state:{error:"You are not logged in"}})
        }else if(value=="student"){
          
                let docRef=doc(db,'Classes',code)
                const docSnap=await getDoc(docRef)
               
                if(docSnap.exists()){
                    if(docSnap.data().students.includes(user.email)){
                        return true
                    }else{
                        navigate('/Classroom',{state:{error:"You are not a student of this class"}})
                    }
                }else{
                    navigate('/404')
                }
        }else if(value=="teacher"){
            let docRef=doc(db,'Classes',code)
            const docSnap=await getDoc(docRef)
            if(docSnap.exists()){
                if(docSnap.data().teacher===user.email){
                    return true
                }else{
                    navigate('/Classroom',{state:{error:"You are not a teacher of this class"}})
                }
            }else{
                navigate('/404')
            }
        }else if (value=="Notes" || value=="Assignments" || value=="Lectures" || value=="Quizzes"){

            let docRef=doc(db,value,code)
            const docSnap=await getDoc(docRef)
            console.log("teststsetewstestestes")
            if(docSnap.exists()){
                console.log("More testsetestsetse ig")
                let classCode=docSnap.data().classCode
                let docRef2=doc(db,'Classes',classCode)
                const docSnap2=await getDoc(docRef2)
                if(docSnap2.data().teacher===user.email || docSnap2.data().students.includes(user.email)){
                    return true
                }else{
                    navigate('/Classroom',{state:{error:"You are not a teacher or student of this class"}})
                }
            }else{
                navigate('/404')
            }

        }
        
    
}

    return checker
}

export default useLogout
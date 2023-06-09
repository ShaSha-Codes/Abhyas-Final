import React from 'react'
import ProfileEdit from '../components/ProfileEdit'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const CompleteProfile = () => {
  const user = useSelector(state => state.user.value)
  let navigate=useNavigate()
  console.log(user)
  React.useEffect(()=>{
    if(user?.profile){
      navigate('/Profile')
    }
  },[])


  return (
    <div>
    <div style={{display: 'flex', alignItems: 'center', flexDirection:'column'}}>
      <ProfileEdit/>  
      </div>
    </div>
  )
}

export default CompleteProfile
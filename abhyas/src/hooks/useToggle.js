import React, { useState } from 'react'

const useToggle = (defaultValue) => {
  const [isToggled,setIsToggled]=useState(defaultValue)
  const toggle=(value)=>{
    if(value){
      setIsToggled(value)
    }else{
      setIsToggled(prevValue=>!prevValue)
    }
  
  }
  return [isToggled,toggle]
}

export default useToggle
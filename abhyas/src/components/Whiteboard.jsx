import React from 'react'
import CanvasDraw from "react-canvas-draw";
import {db} from '../firebase'
import {collection,getDoc,doc,updateDoc,setDoc} from 'firebase/firestore'
import {useParams} from 'react-router-dom'



const whiteboardProps={
    brushRadius: 2,
    canvasWidth: 1920,
    canvasHeight:900,  
}



const Whiteboard = (props) => {
    const whiteboardRef=React.useRef();
    console.log(props)

    const {classCode}   = useParams();


React.useEffect(() => {
        const dataGatherer=async ()=>{
            const docRef=doc(db,'Whiteboard',classCode,"data",String(props.counter))
            const docSnap=await getDoc(docRef)

            if(docSnap.exists()){
                whiteboardRef.current.loadSaveData(docSnap.data().saveData,0) 
            }
            
            }
        dataGatherer()
    },[])




    
React.useEffect(() => {
    const intervalId = setInterval(() => {
        
        const data=whiteboardRef.current.getSaveData()
        const data2=whiteboardRef.current.getDataURL()
       
        const docRef=doc(db,'Whiteboard',classCode,"data",String(props.counter))
        const docRef2=doc(db,'Whiteboard',classCode,"photo",String(props.counter))
        setDoc(docRef,{saveData:data})
        setDoc(docRef2,{image:data2})
        console.log('saved')
      }, 1000);
      return () => clearInterval(intervalId);

},[])




  return (
        
            <div>
                <CanvasDraw ref={whiteboardRef}  {...whiteboardProps} />
     
            </div>
      
        
   
  )
}

export default Whiteboard
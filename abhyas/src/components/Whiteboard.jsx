import React from 'react'
import CanvasDraw from "react-canvas-draw";
import {db} from '../firebase'
import {collection,getDoc,doc,updateDoc,setDoc} from 'firebase/firestore'
import {useParams} from 'react-router-dom'
import CreateIcon from '@mui/icons-material/Create';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ClearIcon from '@mui/icons-material/Clear';
import EditOffIcon from '@mui/icons-material/EditOff';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';

const Whiteboard = (props) => {
    const whiteboardRef=React.useRef();
    console.log(props)
    const [whiteboardProps,setWhiteboardProps]=React.useState({
        brushRadius: 2,
        canvasWidth: 1920,
        canvasHeight:900,  
        brushColor: "#444",
    })
    
    const eraser=()=>{
        setWhiteboardProps({
            brushRadius: 10,
            canvasWidth: 1920,
            canvasHeight:900,  
            brushColor: "#fff",
        })
    }

    const pen=()=>{
        setWhiteboardProps({
            brushRadius: 2,
            canvasWidth: 1920,
            canvasHeight:900,  
            brushColor: "#444",
        })
    }

    const clear=()=>{
        whiteboardRef.current.clear()
    }

    const undo=()=>{
        whiteboardRef.current.undo()
    }

    const redo=()=>{
        whiteboardRef.current.redo()
    }

    

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
        
            <Stack alignItems={"center"} justifyContent={'center'}>
              
             
            

                <CanvasDraw ref={whiteboardRef}  {...whiteboardProps} />
                       
               <Stack  direction={'row'} spacing={5}>
                <Fab size="large" color="primary" aria-label="add" onClick={pen}>
                            <CreateIcon />
                        </Fab>
                        <Fab size="large" color="secondary" aria-label="add" onClick={eraser}>
                            <EditOffIcon />
                        </Fab>
                        <Fab size="large" color="info" aria-label="add" onClick={undo}>
                            <UndoIcon />
                        </Fab>
                        <Fab size="large" color="warning" aria-label="add" onClick={redo}>
                            <RedoIcon />
                        </Fab>
                        <Fab size="large" color="error" aria-label="add" onClick={clear}>
                            <ClearIcon />
                    </Fab>  
                </Stack>   
     
            </Stack>
      
        
   
  )
}

export default Whiteboard
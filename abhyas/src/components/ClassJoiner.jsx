import React from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import  Button  from '@mui/material/Button';
import { useDispatch,useSelector } from 'react-redux';
import {login} from '../features/user'
import {db} from '../firebase'
import {doc,setDoc,getDoc,arrayUnion,updateDoc} from 'firebase/firestore'
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';


const ClassJoiner = ({openStudent,setOpenStudent}) => {
    let user=useSelector(state=>state.user.value)
    let dispatch=useDispatch()
    

    const [classCode,setClassCode] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [message,setMessage] = React.useState("");

    const handleClassCodeChange = (e) => {
        setClassCode(e.target.value);
    }

    const handleSubmit = async() => {
        let docRef1=doc(db,"Classes",classCode)
        let docRef2=doc(db,"UserInfo",user.email)
        
        let checker=await getDoc(docRef1)
        if(checker.exists()===true){
            if(checker.data().students.includes(user.email)){
                setMessage("You are already a part of this class")
                setOpen(true)
            }else if(checker.data().teacher===user.email){
                setMessage("You are the teacher of this class")
                setOpen(true)
            }
            else{
   
                await updateDoc(docRef1,{students:arrayUnion(user.email)})
                await updateDoc(docRef2,{student:arrayUnion(classCode)})

                const docSnap = await getDoc(docRef2);
                dispatch(login(docSnap.data()))
                setOpenStudent(false)
                setClassCode("")
                setOpen(false)
            }
            
        }else{
            setMessage("Class does not exist")
            setOpen(true)
        }
        
        

    }




  return (
    

        <Dialog  open={openStudent} onClose={()=>setOpenStudent(false)}>
            <DialogTitle>Join a Class</DialogTitle>
            
            <DialogContent >
            <Collapse in={open}>
                    <Alert
                    severity='error'
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                    >
                    {message}
                    </Alert>
                </Collapse>
            <Paper sx={{minWidth:"300px",minHeight:'80px'}} elevation={0}>
            <DialogContentText>
                <Stack m={1} direction="column" spacing={2}>
                <TextField id="outlined-basic" label="Enter Class Code" value={classCode} onChange={handleClassCodeChange} name="classCode"variant="outlined" />
                </Stack>
            
            </DialogContentText>
            </Paper>
            
            
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>setOpenStudent(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
  
  
  )
}

export default ClassJoiner
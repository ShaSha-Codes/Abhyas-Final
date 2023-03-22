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
import {nanoid} from 'nanoid'

const ClassMaker = ({openTeacher,setOpenTeacher}) => {
    let dispatch=useDispatch()
    let user=useSelector(state=>state.user.value)
    const [title,setTitle] = React.useState("");
    const [description,setDescription] = React.useState("");

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleSubmit = async() => {
       
        let classCode=nanoid(6)
        let classData={
            title,
            description,
            classCode,
            teacher:user.email,
            students:[],
            assignments:[],
            quizzes:[],
            lectures:[],
            notes:[],
        }
        const docRef = doc(db, "Classes", classCode);
        await setDoc(docRef, classData);

        const docRef2 = doc(db, "UserInfo", user.email);
        await updateDoc(docRef2,{teacher:arrayUnion(classCode)});

        const docSnap = await getDoc(docRef2);
        dispatch(login(docSnap.data()))

        setOpenTeacher(false)
        setTitle("")
        setDescription("")
    }

   

  return (
    <Dialog  open={openTeacher} onClose={()=>setOpenTeacher(false)}>
        <DialogTitle>Create a Class</DialogTitle>
        <DialogContent >
        <Paper sx={{minWidth:"500px",minHeight:'130px'}} elevation={0}>
        <DialogContentText>
            <Stack m={1} direction="column" spacing={2}>
            <TextField id="outlined-basic" label="Title" value={title} onChange={handleTitleChange} name="title"variant="outlined" />
            <TextField multiline maxRows={4} id="outlined-basic" value={description} onChange={handleDescriptionChange} label="Description" name="description" variant="outlined" />
            </Stack>
        
        </DialogContentText>
        </Paper>
        
        
        </DialogContent>
        <DialogActions>
        <Button onClick={()=>setOpenTeacher(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
    </Dialog>
  
  )
}

export default ClassMaker
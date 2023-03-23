import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {useParams} from 'react-router-dom' 
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {useSelector,useDispatch} from 'react-redux'
import {login} from '../features/user'
import {db,storage} from '../firebase'
import {doc,updateDoc,setDoc,arrayUnion} from 'firebase/firestore'
import {ref,getDownloadURL,uploadBytesResumable} from 'firebase/storage'
import { nanoid } from 'nanoid';

export default function NoteForm(props) {
  let {speedDialValue, setSpeedDialValue} = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  let {classCode}=useParams();
  let dispatch=useDispatch()
  let user=useSelector(state=>state.user.value)

  const [title,setTitle]=React.useState('')
  const [description,setDescription]=React.useState('')
  const [file,setFile]=React.useState('')

  const handleTitleChange=(e)=>{
    setTitle(e.target.value)
  }

  const handleDescriptionChange=(e)=>{
    setDescription(e.target.value)
  }

  const handleFileChange=(e)=>{
    let tempFile=e.target.files[0]
    setFile(tempFile)
  }

  const handleSubmit= (e)=>{
      let noteCode=nanoid(6)
      let fileRef=ref(storage,`Notes/${noteCode}`)
      const uploadTask = uploadBytesResumable(fileRef, file)
      uploadTask.on('state_changed',(snapshot)=>{},(error)=>console.log(error), async() => {
      let data= getDownloadURL(uploadTask.snapshot.ref)

            .then((downloadURL) => {
            
                console.log('File available at', downloadURL);
              
            
            let noteRef=doc(db,"Notes",noteCode)
            let noteData={
              title:title,
              description:description,
              classCode:classCode,
              noteCode:noteCode,
              uploader:user.email,
              timestamp:Date.now(),
              file: downloadURL
            }
            try{
              setDoc(noteRef,noteData)
            }catch(e){
              console.log(e)
            }
          

            let classRef=doc(db,"Classes",classCode)
            updateDoc(classRef,{
              notes:arrayUnion(noteCode)
            })
            console.log("Note Uploaded")
            setSpeedDialValue(0)




        });
        }
      );


    
    

    }



  return (
    <div>
    
      <Dialog
        fullScreen={fullScreen}
        open={speedDialValue===1}
        onClose={()=>{setSpeedDialValue(0)}}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Upload Notes
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0} sx={{minWidth:'400px',margin:1}}>
          <DialogContentText>
            <Stack spacing={2}>
              <TextField id="outlined-basic" label="Title" name="title" variant="outlined" onChange={handleTitleChange}/>
              <TextField id="outlined-basic" label="Description" name="description" onChange={handleDescriptionChange} multiline rows={4} variant="outlined" />
              <label for="file">Add Notes:</label>
              <input type="file" onChange={handleFileChange} accept="application/pdf"  id="avatar" name="file" ></input>
            </Stack>
           
          </DialogContentText>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={()=>{setSpeedDialValue(0)}}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
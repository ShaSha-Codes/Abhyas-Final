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
import LoadingScreen from './LoadingScreen';
import Alert from '@mui/material/Alert';

export default function LectureForm(props) {
  let {speedDialValue, setSpeedDialValue} = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  let {classCode}=useParams();
  let user=useSelector(state=>state.user.value)


  
  const [progressValue,setProgressValue]=React.useState(0)
  const [title,setTitle]=React.useState('')
  const [description,setDescription]=React.useState('')
  const [toggle,setToggle]=React.useState(false)

  const handleTitleChange=(e)=>{
    setTitle(e.target.value)
  }

  const handleDescriptionChange=(e)=>{
    setDescription(e.target.value)
  }

 
  const handleSubmit= async(e)=>{
    if(title===''||description===''){
      setToggle(true)
    }
    else{
      let assignmentCode=nanoid(6)
      
            
            let assignmentRef=doc(db,"Assignments",assignmentCode)
            let assignmentData={
              title:title,
              description:description,
              classCode:classCode,
              assignmentCode:assignmentCode,
              uploader:user.email,
              timestamp:Date.now(),
              students:[]
            }
          
            await setDoc(assignmentRef,assignmentData)
          
          

            let classRef=doc(db,"Classes",classCode)
            updateDoc(classRef,{
              assignments:arrayUnion(assignmentCode)
            })
            console.log("Assignment Uploaded")
            setSpeedDialValue(0)

        }

    }

    React.useEffect(()=>{
      setToggle(false)
      setTitle('')
      setDescription('')
      setProgressValue(0)
    },[speedDialValue])


  return (
    <div>
    
      <Dialog
        fullScreen={fullScreen}
        open={speedDialValue===3}
        onClose={()=>{setSpeedDialValue(0)}}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Upload Assignments
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0} sx={{minWidth:'400px',margin:1}}>
          {toggle && <Alert sx={{mb:1}}severity="error" onClose={() => setToggle(false)}>Please Fill All fields</Alert>}
          <DialogContentText>
            <Stack spacing={2}>
              <TextField id="outlined-basic" label="Title" name="title" variant="outlined" onChange={handleTitleChange}/>
              <TextField id="outlined-basic" label="Description" name="description" onChange={handleDescriptionChange} multiline rows={4} variant="outlined" />
              
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
      {
        progressValue>0 && progressValue<100 && <LoadingScreen progressValue={progressValue}/>
      }
    </div>
  );
}
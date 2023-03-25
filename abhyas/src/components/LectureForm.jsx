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
  let dispatch=useDispatch()
  let user=useSelector(state=>state.user.value)


  
  const [progressValue,setProgressValue]=React.useState(0)
  const [title,setTitle]=React.useState('')
  const [description,setDescription]=React.useState('')
  const [file,setFile]=React.useState('')
  const [toggle,setToggle]=React.useState(false)

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
    if(title===''||description===''||file===''){
      setToggle(true)
    }
    else{
      let lecCode=nanoid(6)
      let fileRef=ref(storage,`Lecture/${lecCode}`)
      const uploadTask = uploadBytesResumable(fileRef, file)
      uploadTask.on('state_changed',(snapshot)=>{
        setProgressValue((snapshot.bytesTransferred / snapshot.totalBytes) * 100)

      },(error)=>console.log(error), async() => {
      let data= getDownloadURL(uploadTask.snapshot.ref)

            .then((downloadURL) => {
            
              console.log('File available at', downloadURL);
              
            
            let lecRef=doc(db,"Lectures",lecCode)
            let lecData={
              title:title,
              description:description,
              classCode:classCode,
              lecCode:lecCode,
              uploader:user.email,
              timestamp:Date.now(),
              file: downloadURL
            }
          
            setDoc(lecRef,lecData)
          
          

            let classRef=doc(db,"Classes",classCode)
            updateDoc(classRef,{
              lectures:arrayUnion(lecCode)
            })
            console.log("Lecture Uploaded")
            setSpeedDialValue(0)




        });
        }
      );


    
      }

    }

    React.useEffect(()=>{
      setToggle(false)
      setTitle('')
      setDescription('')
      setFile('')
      setProgressValue(0)
    },[speedDialValue])


  return (
    <div>
    
      <Dialog
        fullScreen={fullScreen}
        open={speedDialValue===2}
        onClose={()=>{setSpeedDialValue(0)}}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Upload Lectures
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0} sx={{minWidth:'400px',margin:1}}>
          {toggle && <Alert sx={{mb:1}}severity="error" onClose={() => setToggle(false)}>Please Fill All fields</Alert>}
          <DialogContentText>
            <Stack spacing={2}>
              <TextField id="outlined-basic" label="Title" name="title" variant="outlined" onChange={handleTitleChange}/>
              <TextField id="outlined-basic" label="Description" name="description" onChange={handleDescriptionChange} multiline rows={4} variant="outlined" />
              <label for="file">Add Lectures:</label>
              <input type="file" onChange={handleFileChange} accept="video/*" id="avatar" name="file" ></input>
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
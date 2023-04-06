import React from 'react'
import ChatBubble from './ChatBubble'
import { TextField,Stack } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom'
import { FileUploader } from "react-drag-drop-files";
import {doc,collection,setDoc,onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import {db,storage} from '../firebase'
import { ref, uploadBytesResumable,getDownloadURL  } from "firebase/storage";
import { nanoid } from 'nanoid';
import LoadingScreen from './LoadingScreen';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import {useSelector} from 'react-redux'




const fileType=['pdf','doc','docx','ppt','pptx','xls','xlsx','txt','csv','zip','rar','7z','tar','gz','tar.gz','tar.bz2','tar.xz','tar.lz','tar.lzma','tar.lzo','tar.sz','tar.Z','tar.zst','tar.lz4',
'tar.lz4','tar.z','mp4','mkv','avi','mov','wmv','flv','mpg','mpeg','webm','ogg','ogv','m4v','3gp','3g2','3gpp','3gpp2','3g','mp3',
'wav','wma','aac','flac','m4a','m4b','m4p','m4r','m4v','mka','png','jpeg','jpg','gif','bmp','svg','webp','psd','ai','eps','indd','raw','cr2','nef','orf','sr2','tif','tiff','dng','jxr','hdp','wdp','jpm','jpx','heic','ktx','ktx2','jng','svg','ico','icns','bpg','jp2','j2k','jpf','jpx','jpm','mj2','mjp2','jxr','hdp','wdp','avif','heif','heic','heics','heifs','avifs','pdf','doc','docx','ppt','pptx','xls','xlsx','txt','csv','zip','rar','7z','tar','gz','tar.gz','tar.bz2','tar.xz','tar.lz','tar.lzma','tar.lzo','tar.sz','tar.Z','tar.zst','tar.lz4',]


const ChatRoom = () => {
    let user=useSelector(state=>state.user.value)
    const {classCode} = useParams()
    console.log(classCode)
    const [file,setFile]=React.useState('')
const [open, setOpen] = React.useState(false);
const [progressValue,setProgressValue]=React.useState(0)
const [message,setMessage]=React.useState('')
const [toggle,setToggle]=React.useState(false)
const [messageData,setMessageData]=React.useState([])

const scrollableDivRef = React.useRef(null);


  React.useEffect(() => {
    scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
  }, [messageData]);

  React.useEffect(() => {
    const q = query(collection(db, 'Messages',classCode,'data'), orderBy('timestamp'));

        const realTime = onSnapshot(q, (docs) => {
          let tempData=[]
          docs.forEach((doc) => {
            tempData=[...tempData,<ChatBubble user={user.email===doc.data().sender?1:2} {...doc.data()}/> ]
          });
          setMessageData(tempData)
      }
      );

  },[])






  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  const handleFileChange=(uploadedFile)=>{
    
    console.log(uploadedFile)
    setFile(uploadedFile)
  
  }

  const handleFileSubmit= async (e)=>{
    if(file!=''){
            let fileCode=nanoid(8)
            const storageRef = ref(storage, `Files/${classCode}/${fileCode}`)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed', 
        (snapshot) => {
            setProgressValue((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        
        }, 
        (error) => {
            console.log(error)
        }, 
       () => {
            let messageCode=nanoid(8)
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                await setDoc(doc(db, 'Messages',classCode,'data', messageCode), {
                    message:'',
                    file:downloadURL,
                    sender:user.email,
                    timestamp:Date.now(),
                    type:file.type,
                    name:file.name,
                    fileCode:fileCode,
                    code:messageCode

                })
                setFile('')
                setToggle(false)
                setOpen(false)
            });
        }
        );
    }else{
        setToggle(true)
    }
  }



  const handleMessageSubmit=async (e)=>{
    if (event.key === 'Enter') {
        let messageCode=nanoid(8)
        await setDoc(doc(db, 'Messages',classCode,'data', messageCode), {
            message:message,
            sender:user.email,
            timestamp:Date.now(),
            code:messageCode,
            type:'message',
    
        })
        setMessage('')
        setToggle(false)
        console.log("Submitted Message")
      }
   
  }
  console.log(message)

  return (
    <div>
        <Stack ref={scrollableDivRef} sx={{overflow: 'auto',height:'62vh',width:'90vw'}}>
           {messageData}
          
        </Stack>
        <Stack direction="row">
        <IconButton aria-label="Attachment" color="info" onClick={handleClickOpen}>
                <AttachFileIcon sx={{color:'#285252', marginRight:1}} />
            </IconButton>
            <TextField  value={message} onChange={(e)=>setMessage(e.target.value)} sx={{marginTop:'0.4em',marginRight:'0.5em', width:'92%'}} variant="outlined" label="Message" onKeyDown={handleMessageSubmit}/>
            
        </Stack>

        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>File Selector</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select File
          </DialogContentText>
          <Collapse in={toggle}>
          <Alert
          severity='error'
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setToggle(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          No File Selected
        </Alert>
      </Collapse>
          <FileUploader style={{width:'600px',height:'500px'}} handleChange={handleFileChange} name="file" types={fileType}  />

       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFileSubmit}>Send</Button>
        </DialogActions>
      </Dialog>
      {
        progressValue>0 && progressValue<100 && <LoadingScreen progressValue={progressValue}/>
      }
        
    </div>
  )
}

export default ChatRoom
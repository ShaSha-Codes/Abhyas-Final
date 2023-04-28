import React from 'react'
import Paper from '@mui/material/Paper';
import {db} from '../firebase'
import {collection,query,where,getDoc,doc,setDoc,addDoc,updateDoc,onSnapshot } from 'firebase/firestore'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Stack,Fab,Grid } from '@mui/material';
import ChatRoom from '../components/ChatRoom';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import StudentWhiteboard from '../components/StudentWhiteboard';

const servers = {
  iceServers: [
      {
          urls: [
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
          ],
      },
  ],
  iceCandidatePoolSize: 10,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});




const JoinLive = () => {
  let navigate=useNavigate()
  const user=useSelector(state=>state.user.value)
  const [videoActive, setVideoActive] = React.useState(false);
  const {classCode}=useParams();
  const localRef =React.useRef();
  const remoteRef = React.useRef();
  const [open, setOpen] = React.useState(false);

  let pc


  const handleClickOpen = () => {
    setOpen(true);
    
};

const handleClose = () => {
    setOpen(false);
  
   
};

 

  React.useEffect(()=>{
    const checker=async()=>{
      let docRef=doc(db,"Classes",classCode)
      onSnapshot(docRef,(doc)=>{
        if(doc.data().live===false){
          navigate('/Student/'+classCode,{state:{error:"Live session ended"}})
        }
      })
      }
    checker()
  },[])



  React.useEffect(() => {
    pc = new RTCPeerConnection(servers);
    const getRoomId = async () => {
      let docRef2=doc(db,"Classes",classCode)
      const docSnap2 = await getDoc(docRef2);
      if(docSnap2.data().live===true){
      const docRef= doc(db,"PendingList",classCode,'data',user.email)
      const docSnap = await getDoc(docRef);
      await setDoc(docRef,{joined:true},{merge:true})
      if (docSnap.exists()) {
        const data=docSnap.data()
        console.log(data)
        setupSources(data.codeId)
      } else {
        console.log("No such document!");
      }

    }else{
      navigate('/Student/'+classCode,{state:{error:"Live session ended"}})
    }
    }
    getRoomId()
  },[])



  React.useEffect(()=>{
    window.addEventListener('beforeunload', disconnect);
    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  },[])




  const toggleVideo=()=>{
    localRef.current.srcObject.getVideoTracks()[0].enabled=!localRef.current.srcObject.getVideoTracks()[0].enabled
    setVideoActive(prevVideoActive=>!prevVideoActive)

}


const disconnect=async()=>{
  try{
    localRef.current.srcObject.getTracks().forEach(track => track.stop());
    remoteRef.current.srcObject.getTracks().forEach(track => track.stop());
    localRef.current.srcObject=null
    remoteRef.current.srcObject=null
    const docRef= doc(db,"PendingList",classCode,'data',user.email)
    await updateDoc(docRef,{joined:false,codeGenerationNeeded:true})
    pc.close()
  }
  catch(er){
    console.log(er)
  }
  navigate('/Student/'+classCode)
}


  const setupSources = async (callId) => {
    
    let localStream
    try{
        localStream = await navigator.mediaDevices.getUserMedia({ video: true });
    }catch(err){
        localStream=new MediaStream()
        console.log(localStream)
    }

    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };

    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

      const callDoc = doc(db,"Calls",callId)
      const answerCandidates = collection(callDoc,"answerCandidates");
      const offerCandidates = collection(callDoc,"offerCandidates");

      pc.onicecandidate = (event) => {
          event.candidate &&
              addDoc(answerCandidates,event.candidate.toJSON());
      };

      const callData = (await getDoc(callDoc)).data();
      console.log(callData)
      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
          new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
      };


      await setDoc(callDoc,{ answer },{merge:true});
    

    onSnapshot(  offerCandidates,(snapshot) => {
          snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                  let data = change.doc.data();
                  pc.addIceCandidate(new RTCIceCandidate(data));
              }
          });
      });
  

 
};




  return (
    <Grid container>
      <Grid item xs={9}>

      
        <Paper elevation={24} sx={{position:'relative',height:'98vh'}}>
          <Stack sx={{position:'absolute',bottom:'10px',right:'45%' }} spacing={3} direction="row">
              <Fab color="secondary" aria-label="edit" onClick={toggleVideo}>
                    {videoActive?<VideocamIcon />:<VideocamOffIcon />}
              </Fab>
              <Fab color="secondary" aria-label="edit" onClick={handleClickOpen}>
                  <NoteAltIcon />
              </Fab>
              
              <Fab color="secondary" aria-label="edit" onClick={disconnect}>
                  <CancelIcon />
              </Fab>
            </Stack>
            <video ref={remoteRef} style={{width:'100%',height:'100%'}} autoPlay playsInline/>
            <Paper elevation={24} sx={{position:'fixed', top:'20px',left:'20px',height:'18vh',width:'15vw'}}>
                <video ref={localRef}  style={{width:'100%',height:'100%'}} autoPlay playsInline/>
                
            </Paper>
        </Paper>
      </Grid>
      <Grid sx={{ display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'}} item xs={3}>
          <ChatRoom width={'20vw'}/>
      </Grid>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Whiteboard
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>

        </AppBar>
                   

      <StudentWhiteboard />
   

   
        
      </Dialog>
    </Grid>
  )
}

export default JoinLive
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




const JoinLive = () => {
  const user=useSelector(state=>state.user.value)
  const [videoActive, setVideoActive] = React.useState(false);
  const {classCode}=useParams();
  const localRef =React.useRef();
  const remoteRef = React.useRef();

  React.useEffect(() => {
    const getRoomId = async () => {
      const docRef= doc(db,"PendingList",classCode,'data',user.email)
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data=docSnap.data()
        console.log(data)
        setupSources(data.codeId)
      } else {
        console.log("No such document!");
      }

    }
    getRoomId()
  },[])

  const toggleVideo=()=>{
    localRef.current.srcObject.getVideoTracks()[0].enabled=!localRef.current.srcObject.getVideoTracks()[0].enabled
    setVideoActive(prevVideoActive=>!prevVideoActive)

}


  const setupSources = async (callId) => {
    
    const pc = new RTCPeerConnection(servers);
    const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });

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
              <Fab color="secondary" aria-label="edit">
                  <NoteAltIcon />
              </Fab>
              
              <Fab color="secondary" aria-label="edit">
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
          <ChatRoom />
      </Grid>
    </Grid>
  )
}

export default JoinLive
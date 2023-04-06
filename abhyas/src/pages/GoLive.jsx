import React from 'react'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ChatRoom from '../components/ChatRoom';
import Stack from '@mui/material/Stack';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import {db} from '../firebase'
import {collection,query,where,getDoc,doc,setDoc,addDoc,updateDoc,onSnapshot } from 'firebase/firestore'
import { useParams } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import CancelIcon from '@mui/icons-material/Cancel';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

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




const GoLive = () => {
    const {classCode}=useParams();
    const [webcamActive, setWebcamActive] = React.useState(false);
    const [micActive, setMicActive] = React.useState(false);
    const [videoActive, setVideoActive] = React.useState(false);


    let localStream
    const localRef =React.useRef();
    let remoteRef = [React.useRef(),React.useRef()];

    React.useEffect(() => {
        
        const getRoomId = async () => {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true ,audio: true,});
            const classRoomRef= doc(db,"Classes",classCode)
            await updateDoc(classRoomRef,{live:true})
            const classRoom=await getDoc(doc(db,"Classes",classCode))
            const data=classRoom.data()
            for(let i=0;i<data.students.length;i++){
          
                createSources(data.students[i],i)
            
            }
        }
        getRoomId()

    }, [])
    
    const toggleMic=()=>{
        localRef.current.srcObject.getAudioTracks()[0].enabled=!localRef.current.srcObject.getAudioTracks()[0].enabled
        setMicActive(prevMicActive=>!prevMicActive)
        

    }
    
    const toggleVideo=()=>{
        localRef.current.srcObject.getVideoTracks()[0].enabled=!localRef.current.srcObject.getVideoTracks()[0].enabled
        setVideoActive(prevVideoActive=>!prevVideoActive)
        

   
    }




    const createSources = async (email,index) => {
        const pc = new RTCPeerConnection(servers);
        

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
        remoteRef[index].current.srcObject = remoteStream;
        setWebcamActive(true);


            const callDoc = doc(collection(db,"Calls"))
            const offerCandidates = collection(callDoc,"offerCandidates");
            const answerCandidates = collection(callDoc,"answerCandidates");
          
            const pendingListCreator=await setDoc(doc(db,"PendingList",classCode,'data',email),{email,codeId:callDoc.id},{merge:true})

            pc.onicecandidate = (event) => {
                event.candidate &&
                    addDoc(offerCandidates,event.candidate.toJSON());
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            await setDoc(callDoc,{ offer },{merge:true});

            onSnapshot(callDoc,(snapshot) => {
                const data = snapshot.data();
                if (!pc.currentRemoteDescription && data?.answer) {
                    const answerDescription = new RTCSessionDescription(
                        data.answer
                    );
                    pc.setRemoteDescription(answerDescription);
                }
            });

            onSnapshot(answerCandidates,(snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const candidate = new RTCIceCandidate(
                            change.doc.data()
                        );
                        pc.addIceCandidate(candidate);
                    }
                });
            });
    
    }


  return (
    <Stack>
        <Grid spacing={2}  container>
            <Grid item xs={9}>
                <Paper elevation={24} sx={{height:'77vh',position:'relative'}}>
                    <video ref={localRef} style={{width:'100%',height:'100%'}} autoPlay playsInline/>
                    <Stack sx={{position:'absolute',bottom:'10px',right:'40%' }} spacing={3} direction="row">
                        <Fab color="secondary" aria-label="edit" onClick={toggleMic}>
                            {micActive?<MicNoneIcon />:<MicOffIcon />}
                        </Fab>
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
               
                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper elevation={24} sx={{height:'77vh'}}>
                    <ChatRoom style={{height:"100vh"}} />
                </Paper>
            </Grid>
        </Grid>
        <Box
        sx={{
            display: 'flex',
            gap: 1,
            py: 1,
            overflow: 'auto',
            width: '98vw',
            height:'20vh',
            scrollSnapType: 'x mandatory',
            '& > *': {
            scrollSnapAlign: 'center',
            },
            '::-webkit-scrollbar': { display: 'none' },
        }}
        >


           
            <Card orientation="horizontal"  variant="outlined" sx={{gap: 2, '--Card-padding': (theme) => theme.spacing(2),}}>
                <Box sx={{ whiteSpace: 'nowrap' }}>
                    <video ref={remoteRef[0]} style={{width:'15vw',height:'100%'}} autoPlay playsInline/>
                </Box>
            </Card>

            <Card orientation="horizontal"  variant="outlined" sx={{gap: 2, '--Card-padding': (theme) => theme.spacing(2),}}>
                <Box sx={{ whiteSpace: 'nowrap' }}>
                    <video ref={remoteRef[1]} style={{width:'15vw',height:'100%'}} autoPlay playsInline/>
                </Box>
            </Card>





                </Box>



            


    

    </Stack>
  )
}

export default GoLive
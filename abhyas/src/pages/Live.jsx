import React from 'react'
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {db} from '../firebase'
import {collection,query,where,getDoc,doc,setDoc,addDoc,updateDoc,onSnapshot } from 'firebase/firestore'


const data = [
    {
      src: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
      title: 'Night view',
      description: '4.21M views',
    },

  
  ];





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


const pc = new RTCPeerConnection(servers);




  
const Live = () => {
    const [webcamActive, setWebcamActive] = React.useState(false);
    const [roomId, setRoomId] = React.useState([]);
    const localRef =React.useRef();
    const remoteRef = React.useRef();

    const setupSources = async (mode,callId) => {
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
        setWebcamActive(true);


        if (mode === "create") {
            const callDoc = doc(collection(db,"Calls"))
            const offerCandidates = collection(callDoc,"offerCandidates");
            const answerCandidates = collection(callDoc,"answerCandidates");
            setRoomId(callDoc.id);
            

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
    }else if (mode === "join") {

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
        }

     
    };

    


  return (
    <Stack>
         <Card 

          orientation="horizontal"
          variant="outlined"
          sx={{
            gap: 2,
            '--Card-padding': (theme) => theme.spacing(2),
            height:'70vh'
          }}
        >
        
          <Box sx={{ whiteSpace: 'nowrap' }}>
            <video  ref={localRef} style={{minWidth: '100%', minHeight: '100%'}} autoPlay playsInline />
          </Box>
        </Card>

        
        <Box
      sx={{
        display: 'flex',
        gap: 1,
        py: 1,
        overflow: 'auto',
        width: '99vw',
        scrollSnapType: 'x mandatory',
        '& > *': {
          scrollSnapAlign: 'center',
        },
        '::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {data.map((item) => (
        <Card
          orientation="horizontal"
          key={item.title}
          variant="outlined"
          sx={{
            gap: 2,
            '--Card-padding': (theme) => theme.spacing(2),
          }}
        >
        
          <Box sx={{ whiteSpace: 'nowrap' }}>
            <video  ref={remoteRef} autoPlay playsInline   />
          </Box>
        </Card>
      ))}
    </Box>
    <Button variant="outlined" onClick={()=>setupSources("create")}>
        Start
    </Button>
    <Button variant="outlined" onClick={()=>setupSources("join",roomId)}>
        Join
    </Button>
    </Stack>
  )
        }

export default Live
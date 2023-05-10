import React from 'react'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ChatRoom from '../components/ChatRoom';
import Stack from '@mui/material/Stack';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import {db} from '../firebase'
import {collection,query,where,getDoc,doc,setDoc,addDoc,updateDoc,onSnapshot,deleteDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import CancelIcon from '@mui/icons-material/Cancel';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Whiteboard from '../components/Whiteboard';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

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





const GoLive = () => {
    let navigate=useNavigate()
    const {classCode}=useParams();
    const [webcamActive, setWebcamActive] = React.useState(false);
    const [micActive, setMicActive] = React.useState(false);
    const [videoActive, setVideoActive] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [whiteboardCounter,setWhiteboardCounter]=React.useState(0)
    let counter=0
    const [whiteboardArray,setWhiteboardArray]=React.useState([<Whiteboard counter={0}/>])


    const handleLeft=()=>{
        if(whiteboardCounter>0){
            setWhiteboardCounter(prevWhiteboardCounter=>prevWhiteboardCounter-1)
          
        }
    
    }

    const handleRight=()=>{
        if(whiteboardCounter<whiteboardArray.length-1){
            setWhiteboardCounter(prevWhiteboardCounter=>prevWhiteboardCounter+1)
        
        }else{
            setWhiteboardArray(prevWhiteboardArray=>{
                const newWhiteboardArray=[...prevWhiteboardArray]
                newWhiteboardArray.push(<Whiteboard counter={whiteboardCounter+1}/>)
                return newWhiteboardArray
            })
            setWhiteboardCounter(prevWhiteboardCounter=>prevWhiteboardCounter+1)
            
        }
        console.log(whiteboardArray)
    }


    const handleClickOpen = () => {
        setOpen(true);
        
    };

    const handleClose = () => {
        setOpen(false);
        setWhiteboardCounter(0)
       
    };


    const [liveStudents,setLiveStudents]=React.useState([
        {email:'',joined:false},
        {email:'',joined:false},
        {email:'',joined:false},
        {email:'',joined:false},
        {email:'',joined:false},
    ])
    let connections=[]



    let localStream
    const localRef =React.useRef();
    let remoteRef = [
        React.useRef(),
        React.useRef(),
        React.useRef(),
        React.useRef(),
        React.useRef(),
    ]

    

   


    React.useEffect(() => {
        
        const getRoomId = async () => {
            try{
                localStream = await navigator.mediaDevices.getUserMedia({ video: true ,audio: true,});
            }catch(err){
                localStream=new MediaStream()
            }
          
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



    React.useEffect(() => {
        const onSnaps = async () => {
        const classRoom=await getDoc(doc(db,"Classes",classCode))
        const data=classRoom.data()
        for(let i=0;i<data.students.length;i++){
            onSnapshot(doc(db,"PendingList",classCode,'data',data.students[i]), (doc) => {
                if(doc.data().joined===true){
                    setLiveStudents(prevLiveStudents=>{
                        const newLiveStudents=[...prevLiveStudents]
                        if(newLiveStudents[i].email===doc.data().email){
                            newLiveStudents[i].joined=true
                        }
                    
                        return newLiveStudents
                    })
                }else{
                    setLiveStudents(prevLiveStudents=>{
                        const newLiveStudents=[...prevLiveStudents]
                        if(newLiveStudents[i].email===doc.data().email){
                            newLiveStudents[i].joined=false
                        }
                    
                        return newLiveStudents
                    })
                }
                
                if(doc.data().codeGenerationNeeded===true){
                    createSources(data.students[i],i)
                 
                }
            })

      
        
        }
    }
        onSnaps()
    },[]);
    



    
    const toggleMic=()=>{
        localRef.current.srcObject.getAudioTracks()[0].enabled=!localRef.current.srcObject.getAudioTracks()[0].enabled
        setMicActive(prevMicActive=>!prevMicActive)
    }
    
    const toggleVideo=()=>{
        localRef.current.srcObject.getVideoTracks()[0].enabled=!localRef.current.srcObject.getVideoTracks()[0].enabled
        setVideoActive(prevVideoActive=>!prevVideoActive) 
    }

   
    const toggleScreenShare = async () => {
        console.log(whiteboardRef)
      };
      

    const createSources = async (email,index) => {
        const pc = new RTCPeerConnection(servers);
      


        connections.push(pc)
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

        setLiveStudents(prevLiveStudents=>{
            const newLiveStudents=[...prevLiveStudents]
            newLiveStudents[index].email=email
            return newLiveStudents
        })

        remoteRef[index].current.srcObject = remoteStream;
        setWebcamActive(true);


            const callDoc = doc(collection(db,"Calls"))
            const offerCandidates = collection(callDoc,"offerCandidates");
            const answerCandidates = collection(callDoc,"answerCandidates");
          
            const pendingListCreator=await setDoc(doc(db,"PendingList",classCode,'data',email),{email,codeId:callDoc.id,joined:false,codeGenerationNeeded:false},{merge:true})

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

    React.useEffect(()=>{
        window.addEventListener('beforeunload', disconnect);
        return () => {
          window.removeEventListener('beforeunload', disconnect);
        };
      },[])



    const disconnect=async()=>{
        await deleteDoc(doc(db,"PendingList",classCode))
        const classRoomRef= doc(db,"Classes",classCode)
        await updateDoc(classRoomRef,{live:false})
        try{
            
            localRef.current.srcObject.getTracks().forEach(track => track.stop());
            localRef.current.srcObject=null
            for(let i=0;i<remoteRef.length;i++){
                remoteRef[i].current.srcObject.getTracks().forEach(track => track.stop());
                remoteRef.current.srcObject=null
            }
            
            for(let i=0;i<connections.length;i++){
                connections[i].close()
            }
        }catch(err){
            
        }

        navigate('/Teacher/'+classCode)
      }
      
      React.useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.backgroundColor = "#202124";
        return () => {
          document.body.style.overflow = "auto";
          document.body.style.backgroundColor = "white";
        };
      }, []);
      

  return (
    <Stack sx={{bgcolor:"#202124"}}>
        <Grid spacing={1} pt={1} container>
            <Grid item xs={8.5}>
                <Paper elevation={24} sx={{width:'100%', height:"80vh",position:'relative'}}>
                    <video ref={localRef} style={{width:'100%',height:"80vh",objectFit: "cover",transform: "rotateY(180deg)"}} autoPlay playsInline/>
                </Paper>
            </Grid>
            <Grid item xs={3.5}>
                <Paper elevation={24} sx={{height:'80vh', borderRadius:"10px"}}>
                    <ChatRoom width={'100%'} height={'100%'}  />
                </Paper>
            </Grid>
            <Grid xs={12}sx={{display:"flex", alignItems:"center", flexDirection:"column"}}>
            <Stack sx={{position:'absolute',bottom:'20px' }} spacing={3} direction="row">
                        <Fab color="secondary" sx={{bgcolor:"#3c7979","&:hover": {
                  backgroundColor: '#285252'
                },}} aria-label="edit" onClick={toggleMic}>
                            {micActive?<MicNoneIcon />:<MicOffIcon />}
                        </Fab>
                        <Fab color="secondary"  sx={{bgcolor:"#3c7979","&:hover": {
                  backgroundColor: '#285252'
                },}} aria-label="edit" onClick={toggleVideo}>
                            {videoActive?<VideocamIcon />:<VideocamOffIcon />}
                        </Fab>
                        <Fab color="secondary"  sx={{bgcolor:"#3c7979","&:hover": {
                  backgroundColor: '#285252'
                },}} aria-label="edit" onClick={toggleScreenShare}>
                            <ScreenShareIcon />
                        </Fab>
                        <Fab color="secondary"  sx={{bgcolor:"#3c7979","&:hover": {
                  backgroundColor: '#285252'
                },}} aria-label="edit" onClick={handleClickOpen}>
                            <NoteAltIcon />
                        </Fab>
                       
                        <Fab color="secondary"  sx={{bgcolor:"#3c7979","&:hover": {
                  backgroundColor: '#285252'
                },}} aria-label="edit" onClick={disconnect}>
                            <CancelIcon />
                        </Fab>
                 </Stack>
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
            zIndex:100,
            scrollSnapType: 'x mandatory',
            '& > *': {
            scrollSnapAlign: 'center',
            },
            '::-webkit-scrollbar': { display: 'none' },
        }}
        >



        


                    <Card orientation="horizontal"  variant="outlined" sx={{display:liveStudents[0].joined?'block':'none',gap: 2, '--Card-padding': (theme) => theme.spacing(2),}}>
                        <Box sx={{ whiteSpace: 'nowrap' }}>
                            <video ref={remoteRef[0]} style={{width:'15vw',height:'100%'}} autoPlay playsInline/>
                        </Box>
                    </Card>

                    
                    <Card orientation="horizontal"  variant="outlined" sx={{display:liveStudents[1].joined?'block':'none',gap: 2, '--Card-padding': (theme) => theme.spacing(2),}}>
                        <Box sx={{ whiteSpace: 'nowrap' }}>
                            <video ref={remoteRef[1]} style={{width:'15vw',height:'100%'}} autoPlay playsInline/>
                        </Box>
                    </Card>
                    
                    
                    <Card orientation="horizontal"  variant="outlined" sx={{display:liveStudents[2].joined?'block':'none',gap: 2, '--Card-padding': (theme) => theme.spacing(2),}}>
                        <Box sx={{ whiteSpace: 'nowrap' }}>
                            <video ref={remoteRef[2]} style={{width:'15vw',height:'100%'}} autoPlay playsInline/>
                        </Box>
                    </Card>
                    
                    
                    <Card orientation="horizontal"  variant="outlined" sx={{display:liveStudents[3].joined?'block':'none',gap: 2, '--Card-padding': (theme) => theme.spacing(2),}}>
                        <Box sx={{ whiteSpace: 'nowrap' }}>
                            <video ref={remoteRef[3]} style={{width:'15vw',height:'100%'}} autoPlay playsInline/>
                        </Box>
                    </Card>
                    
                    
                    <Card orientation="horizontal"  variant="outlined" sx={{display:remoteRef[4].joined?'block':'none',gap: 2, '--Card-padding': (theme) => theme.spacing(2),}}>
                        <Box sx={{ whiteSpace: 'nowrap' }}>
                            <video ref={remoteRef[4]} style={{width:'15vw',height:'100%',display:liveStudents[4].joined?'block':'none'}} autoPlay playsInline/>
                        </Box>
                    </Card>
                  

                </Box>


            
    <div>
      
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
                   

            
        <IconButton sx={{position:'fixed',top:'50%',left:'10px',zIndex:9000}} aria-label="left" color="secondary" size="large" onClick={handleLeft}>
            <ArrowCircleLeftOutlinedIcon  fontSize="inherit"/>
        </IconButton>


        <IconButton sx={{position:'fixed',top:'50%',right:'10px',zIndex:9000}} aria-label="right" color="secondary" size="large" onClick={handleRight}> 
            <ArrowCircleRightOutlinedIcon fontSize="inherit"/>
        </IconButton>
     
            {whiteboardArray.map((item,index)=>{
                return(
                    <div style={{display:index===whiteboardCounter?'visibility':'hidden',zIndex:index===whiteboardCounter?100:-1,position:'fixed'}}>
                        {item}
                    </div>
                )
                }
            )}

  
          
            {whiteboardCounter}
                

        

   
        
      </Dialog>
    </div>
 
    

    </Stack>
  )
}

export default GoLive
import React from 'react'
import SideBar from '../components/SideBar'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { CardActionArea } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Map,{ Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Layer, Source} from 'react-map-gl';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {db} from '../firebase'
import { getDoc,getDocs,addDoc,setDoc,updateDoc,doc,collection,query,where} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import HailIcon from '@mui/icons-material/Hail';
import JobCard from '../components/JobCard';
import { nanoid } from 'nanoid';
import  Carousel  from 'react-material-ui-carousel';
import Slider from '@mui/material/Slider';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const Transition2 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Transition3 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="top" ref={ref} {...props} />;
});

const distanceArray = [
  {
    value: 5,
    label: '5Km',
  },
  {
    value: 20,
    label: '20Km',
  },
  ,
  {
    value: 40,
    label: '40Km',
  },
  ,
  {
    value: 60,
    label: '60Km',
  },
  ,
  {
    value: 80,
    label: '80Km',
  },
  {
    value: 100,
    label: '100Km',
  },
 
];


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  flexGrow: 1,
  height:'80vh',
  margin:'10px',
  alignItems:'center',
  justifyContent:'center',
  display:'flex',
}));

const TutorFinder = () => {
  const [lng1,setLng1]=React.useState(72.842949);
  const [lat1,setLat1]=React.useState(19.133890);
  const [mode, setMode] = React.useState('online');
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [title,setTitle]=React.useState('');
  const [description,setDescription]=React.useState('');
  const [open4, setopen4] = React.useState(false);
  const [userCardData, setUserCardData] = React.useState([]);
  const [distance,setDistance]=React.useState(5)
  const [tutorCardData,setTutorCardData]=React.useState([])
  const [searchDone,setSearchDone]=React.useState(false)

  let user = useSelector(state => state.user.value)



 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const dragMarker1=(event)=>{
    setLng1(event.lngLat.lng)
    setLat1(event.lngLat.lat)
  }


 


  const handleMode = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleSubmission=async()=>{
    if(title==='' || description===''){
      setopen4(true)
      return
    }else{
      let tutorCode = nanoid(10)
      const docRef = await setDoc(doc(db, "Tutors",tutorCode), {
        tutorCode:tutorCode,
        email:user.email,
        name:user.fname + " " + user.lname,
        photoUrl:user.photoUrl,
        title: title,
        description: description,
        mode:mode,
        lng:lng1,
        lat:lat1
      });
      setOpen(false)
      
    }
   
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Testt")
      setLng1(position.coords.longitude);
      setLat1(position.coords.latitude);
    }
    );

  },[]);
  
  

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
    setSearchDone(false);
  };




  
  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };


  React.useEffect(() => {
    const getTutorData = async()=>{
      const querySnapshot = await getDocs(query(collection(db, "Tutors"),where("email","==",user.email)));
      let tempData = []
      querySnapshot.forEach((doc) => {
     
    
          tempData.push(<JobCard {...doc.data()} delete={true} />)
     
      });
      setUserCardData(tempData)
    }
    getTutorData()
  },[open3])


  const handleSearch=async()=>{
    const querySnapshot = await getDocs(query(collection(db, "Tutors"),where("mode","==",mode),where("email","!=",user.email)));
    let tempData = []
    querySnapshot.forEach((doc) => {
      
      if(getDistanceFromLatLonInKm(doc.data().lat,doc.data().lng,lat1,lng1)<distance){
        tempData.push(<JobCard {...doc.data()} delete={false} />)
      }
      
    });
    setTutorCardData(tempData)
    setSearchDone(true)


  }





  return (
    <SideBar>
        <Grid container >
            <Item xs={4}  >
              <CardActionArea onClick={handleClickOpen}sx={{height:'100%',width:'100%'}}>
                <SchoolIcon sx={{fontSize:'120px'}}/>
                <h1>
                  Become a Tutor
                </h1>
              </CardActionArea>
          
            </Item>
            <Item xs={4}  >
              <CardActionArea onClick={handleClickOpen3} sx={{height:'100%',width:'100%'}}>
                <HailIcon sx={{fontSize:'120px'}}/>
                <h1>
                  Your Postings
                </h1>
              </CardActionArea>
          
            </Item>
            <Item xs={4}  >
              <CardActionArea onClick={handleClickOpen2} sx={{height:'100%',width:'100%'}}>
                <MenuBookIcon sx={{fontSize:'120px'}}/>
                <h1>
                  Find a Tutor
                </h1>
              </CardActionArea>
          
            </Item>
            
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
              Become a Tutor
            </Typography>
           
          </Toolbar>
        </AppBar>
      <Grid container>
        <Grid item xs={6}>

          <Map
            initialViewState={{
              longitude: 72.842949,
              latitude: 19.133890,
              zoom: 1
            }}
            mapboxAccessToken='pk.eyJ1IjoiYW1hZGV1czA2NDAiLCJhIjoiY2xnYzA2NmJ2MWVrajNqbzZ5dDk5c3B1MiJ9.6Z4SZbQ_jRsoXM-hFKU3uQ'
            style={{width:'100%',height:'100vh'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
                  <Marker longitude={lng1} latitude={lat1} offsetLeft={-20} offsetTop={-10} draggable onDrag={dragMarker1}/>
                  <NavigationControl position="bottom-right" />
                  <FullscreenControl />
                  <GeolocateControl />  
            </Map>
          </Grid>

          <Grid sx={{display:'flex',justifyContent:'center',alignItems:'center'}} item xs={6}>
              <Paper elevation={12} sx={{borderRadius:'30px',height:'55vh',width:'50vh'}}>
                    <Stack sx={{padding:'30px'}} spacing={1}>
                      <Typography sx={{display:'flex',justifyContent:'center',alignItems:'center'}} variant='h5'>
                          <b>Tutor Description</b>
                      </Typography>
                      <Collapse in={open4}>
                      <Alert
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setopen4(false);
                            }}

                          
                          >

                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        severity='error'
                        sx={{ mb: 2 }}
                      >
                        Fill all Fields
                      </Alert>
                    </Collapse>
                      <TextField id="outlined-basic" label="Title" value={title} onChange={(event)=>setTitle(event.target.value)} variant="outlined" />
                      <TextField multiline rows={4} value={description} onChange={(event)=>setDescription(event.target.value)} id="outlined-basic" label="Description" variant="outlined" />
                      <Stack spacing={4} direction="row">
                            <TextField disabled id="outlined-basic" value={lng1}  variant="outlined" />
                            <TextField disabled id="outlined-basic" value={lat1}  variant="outlined" />
                      </Stack>
                      <Stack justifyContent={'center'} alignItems={'center'} spacing={4} direction="row">
                        <Typography variant='subtitle1'>
                          Type
                        </Typography>
                      <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={handleMode}
                        aria-label="Type of Tutor"
                      >
                        <ToggleButton value="online" aria-label="left aligned">
                          Online
                        </ToggleButton>
                        <ToggleButton value="offline" aria-label="centered">
                          Offline
                        </ToggleButton>
                        <ToggleButton value="hybrid" aria-label="right aligned">
                          Hybrid
                        </ToggleButton>
                      </ToggleButtonGroup>
                        </Stack>
                      <Button  sx={{marginTop:30,height:'3em'}} variant="contained" onClick={handleSubmission}>
                          Submit
                      </Button>
                    </Stack>
                </Paper>
            </Grid>
    
    
          </Grid>
      </Dialog>





      <Dialog
        fullScreen
        open={open3}
        onClose={handleClose3}
        TransitionComponent={Transition3}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose3}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Your Postings
            </Typography>
          
          </Toolbar>
        </AppBar>
        <Grid container sx={{padding:'2em'}}>
          {userCardData}
        </Grid>
    
         
      </Dialog>
























      <Dialog
        fullScreen
        open={open2}
        onClose={handleClose2}
        TransitionComponent={Transition2}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose2}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Find a Tutor
            </Typography>
           
          </Toolbar>
        </AppBar>
        {(searchDone && tutorCardData.length>0) && 
        <Grid container sx={{padding:'2em'}}>
            {tutorCardData}
        </Grid>
        }
        {(searchDone && tutorCardData.length==0) && 
        <Typography sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'30vh'}} variant='h3'>
          No Tutors Found
        </Typography>
        }
           {!searchDone && 
          <Carousel swipe={false} autoPlay={false}>
            <Map
            
              initialViewState={{
                longitude: 72.842949,
                latitude: 19.133890,
                zoom: 2
              }}
              mapboxAccessToken='pk.eyJ1IjoiYW1hZGV1czA2NDAiLCJhIjoiY2xnYzA2NmJ2MWVrajNqbzZ5dDk5c3B1MiJ9.6Z4SZbQ_jRsoXM-hFKU3uQ'
              style={{width:'100%',height:'95vh'}}
              mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
              projection={'globe'}
              
            >
                    <Marker longitude={lng1} latitude={lat1} offsetLeft={-20} offsetTop={-10} draggable onDrag={dragMarker1}/>
                 
            
         
              </Map>
              <Paper sx={{display:'flex',height:'90vh',width:'100vw',justifyContent:'center',alignItems:'center'}}>
                <Stack  sx={{width:'40%'}}>
                    <Typography variant='h5'>
                      <b>Distance:</b>
                    </Typography>
                    <Slider defaultValue={5} marks={distanceArray} value={distance} onChange={(event)=>setDistance(event.target.value)} aria-label="Default" min={5} max={100} valueLabelDisplay="auto" />
                </Stack>
              </Paper>
              <Paper sx={{display:'flex',height:'90vh',width:'100vw',justifyContent:'center',alignItems:'center'}}>
                <Stack  sx={{justifyContent:'center',alignItems:'center'}}>
                    <Typography variant='h4'>
                      <b>Mode:</b>
                    </Typography>
                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={handleMode}
                        aria-label="Type of Tutor"
                      >
                        



                        <ToggleButton sx={{fontSize:'1.3em'}} value="online" aria-label="left aligned">
                        <EmojiPeopleIcon sx={{ fontSize: 40 }} />
                          Online
                        </ToggleButton>
                        <ToggleButton sx={{fontSize:'1.3em'}} value="offline" aria-label="centered">
                        <RunCircleIcon sx={{ fontSize: 40 }} />
                          Offline
                        </ToggleButton>
                        <ToggleButton  sx={{fontSize:'1.3em'}} value="hybrid" aria-label="right aligned">
                        <PeopleAltIcon sx={{ fontSize: 40 }} />
                          Hybrid
                        </ToggleButton>
                      </ToggleButtonGroup>

                      <Button sx={{fontSize:'1.1em',marginTop:'20px',width:'60%'}} variant="contained" onClick={handleSearch}>Search</Button>

                  
                    
                </Stack>
              </Paper>


          </Carousel> 
          }

         
      </Dialog>


    </SideBar>
  )
}

export default TutorFinder
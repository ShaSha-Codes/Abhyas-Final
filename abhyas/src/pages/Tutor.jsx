import React from 'react'
import SideBar from '../components/SideBar'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc,setDoc,getDocs } from "firebase/firestore";
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { Typography,Grid } from '@mui/material';
import Map,{ Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Layer, Source} from 'react-map-gl';


const Tutor = () => {
    const {tutorCode}=useParams()
    const [tutor,setTutor]=React.useState({
        name:'',
        email:'',
        photoUrl:'',
        lng:72.842949,
        lat:19.133890

    })

    React.useEffect(()=>{
        const getTutor=async()=>{
            const tutorRef=doc(db,"Tutors",tutorCode)
            const tutorSnap=await getDoc(tutorRef)
            if(tutorSnap.exists()){
                const tutorData=tutorSnap.data()
                setTutor(tutorData)
                
            }
        }
        getTutor()
    },[])


  return (
    <SideBar>
        <div style={{height:'30vh',borderRadius:'20px',backgroundImage:`url('https://content.linkedin.com/content/dam/premium/site/img/Premium-Heroes-02.png')`}}>
          </div>
    
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px'}}>
              <Paper sx={{borderRadius:'20px',width:'50vw',height:'60vh',position:'absolute',left:'50',bottom:150}} elevation={24}>
                  <Avatar sx={{width:'150px',height:'150px',position:'absolute',left:'50%',top:'-50px',transform:'translateX(-50%)'}} src={tutor.photoUrl}/>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px',marginTop:'100px'}}>
                      <Typography variant='h4'>
                        <strong>{tutor.name}</strong>
                      </Typography>
                      <br/>
                      <Grid container>
                          <Grid item xs={6} sx={{pr:2}}>
                              
                              <Typography variant='h6'>
                                <strong>Title:</strong> {tutor.title}
                              </Typography>
                              <Typography variant='h6'>
                                <strong>Description:</strong> {tutor.description}
                              </Typography>
                              <Typography variant='h6'>
                              <strong>Mode:</strong> {tutor.mode}
                              </Typography><Typography variant='h6'>
                              <strong>Email:</strong>  {tutor.email}
                              </Typography>
                              

                          </Grid>
                                <Grid item xs={6}>
                                <Map
                                  initialViewState={{
                                    longitude: 72.842949,
                                    latitude: 19.133890,
                                    zoom: 2
                                  }}
                                  mapboxAccessToken='pk.eyJ1IjoiYW1hZGV1czA2NDAiLCJhIjoiY2xnYzA2NmJ2MWVrajNqbzZ5dDk5c3B1MiJ9.6Z4SZbQ_jRsoXM-hFKU3uQ'
                                  style={{width:'15',height:'35vh',borderRadius:'20px'}} 
                                  mapStyle="mapbox://styles/mapbox/streets-v9">
                                        <Marker longitude={tutor.lng} latitude={tutor.lat} />
                                        <NavigationControl position="bottom-right" />
                                      <FullscreenControl />
                                      <GeolocateControl />  

                                    
                            
                                  </Map>
                         </Grid>
                      </Grid>
                    
                      

                  </div>
                  
              </Paper>
            </div>
        

    </SideBar>
  )
}

export default Tutor
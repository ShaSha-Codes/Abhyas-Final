import React from 'react'
import SideBar from '../components/SideBar'
import { useParams } from 'react-router-dom'
import {doc,getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material'
import useLogout from '../hooks/useLogout'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Lecture = () => {
  const {lecCode} = useParams()
  const [lecture,setLecture] = React.useState(null)
  const [show,setShow] = React.useState(false)
  const [buttonContent,setButtonContent] = React.useState("Show More")
  const checker=useLogout()

  const setShowValue=()=>{
    setShow(!show)
    if(show){
      setButtonContent("Show More")
    }else{
      setButtonContent("Show Less")
    }
  }

  React.useEffect(()=>{
    checker("Lectures",lecCode)
  })

  React.useEffect(()=>{
    const getLecture = async () => {
      const docRef = doc(db, "Lectures", lecCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLecture(docSnap.data());
      } else {
      
        console.log("No such document!");
      }
    }
    getLecture()
  },[])
  
  console.log(lecture?.file)
  return (
    <SideBar>
      <Grid 
      container
  alignItems="center"
  justifyContent="center"
  spacing={2} >

 

 
        { lecture!==null &&
           <Grid sx={{backgroundColor:"black", borderRadius:2}} xs={12}  display="flex" direction="column" alignItems="center"  justifyContent="center" >
            <video style={{borderRadius:'5px'}} width= "75%" controls >
              <source src={lecture?.file}  />
            </video>
            </Grid>
        }
        {
          <Grid xs={12} >
          <Paper sx={{marginTop:1,p:1.5,paddingLeft:10,minHeight:'10px',backgroundColor:'#f2f2f2',borderRadius:2}}>
            <div style={{display:"flex", style:"row" , justifyContent:"space-between" }}>
            <Typography variant="h5" sx={{fontWeight:'bold',color:'black'}}>{lecture?.title}</Typography>
            <Typography sx={{color:'gray', fontSize:'15px', marginTop:'auto'}}><button onClick={setShowValue} style={{display:'flex', alignItems:'center',borderRadius:"10px",border:'solid 0.5px gray'}}>{buttonContent}{!show&& <ArrowDropDownIcon/>}{show&&<ArrowDropUpIcon/>}</button></Typography>
            </div>
             
             {show && 
             <div style={{marginTop:'10px'}}>
              <hr style={{borderTop:'1px dotted gray'}}/>
              <p>Description:</p>
             <Typography variant="body1" sx={{color:'black',marginTop:-1}}>{lecture?.description}</Typography>
             </div>} 
            
     
          </Paper>
          </Grid>
        }
       </Grid>
    </SideBar>
  )
}

export default Lecture
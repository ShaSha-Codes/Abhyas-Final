import React from 'react'
import SideBar from '../components/SideBar'
import { useParams } from 'react-router-dom'
import {doc,getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material'
import useLogout from '../hooks/useLogout'

const Lecture = () => {
  const {lecCode} = useParams()
  const [lecture,setLecture] = React.useState(null)
  const checker=useLogout()


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
           <Grid xs={8}>
            <video  width="750" height="500" controls>
              <source src={lecture?.file}  />
            </video>
            </Grid>
        }
        {
          <Grid xs={4}>
          <Paper sx={{p:5,minHeight:'300px'}}>
            <Typography variant="h5" component="h1" gutterBottom>
              Title:
            </Typography>
            <hr/>
            <Typography sx={{mb:5}} variant="h6" component="h2" gutterBottom>
              {lecture?.title}
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Descrption:
            </Typography>
            <hr/>
            <Typography variant="h6" component="h3" gutterBottom>
              {lecture?.description}
            </Typography>
         
     
          </Paper>
          </Grid>
        }
       </Grid>
    </SideBar>
  )
}

export default Lecture
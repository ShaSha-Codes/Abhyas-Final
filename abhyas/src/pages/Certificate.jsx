import React from 'react'
import SideBar from '../components/SideBar'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CertificateCard from '../components/CertificateCard';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ClassIcon from '@mui/icons-material/Class';
import ClassJoiner from '../components/ClassJoiner';
import { useSelector } from 'react-redux';
import {db} from '../firebase'
import {collection,query,where,getDocs} from 'firebase/firestore'


const Certificate = () => {
  const [certificateData, setCertificateData] = React.useState([]);


  let user = useSelector(state => state.user.value)
  console.log(user)

  React.useEffect(() => {
   
  (async()=>{
    const q = query(collection(db, "Certificates"), where("email", "==", user.email ));
    const querySnapshot = await getDocs(q);
    let tempData=[]
    querySnapshot.forEach((doc) => {
      tempData.push({certificateCredential:doc.data().certificateCredential,title:doc.data().title,logo:doc.data().logo})
    })
    console.log(tempData)
        
      
    setCertificateData(tempData)

  })();



    
  },[user])

  
  return (
    <SideBar>
         <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
           
          </Box>
          { certificateData.length!==0 &&
          
          <Grid container spacing={3}>
                {
                    certificateData.map((item,index)=>{
                        return(
                            <CertificateCard key={index} certificateCredential={item.certificateCredential} title={item.title} logo={item.logo} />
                        )
                  })
                }
        
            </Grid>
           
       
              }

              {
                certificateData.length===0 &&
                <h1>You have no certificates yet.... </h1 >
              }
        </Box>
      
    </SideBar>
  )
}

export default Certificate;
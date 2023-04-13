import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { CardActionArea } from '@mui/material';
import {useNavigate} from 'react-router-dom';
import { Box } from '@mui/system';


export default function CertificateCard(props) {
  let navigate=useNavigate()
  const handleClick=()=>{
    navigate('/VerifyCertificate/'+props.certificateCredential)
  }

  return (
    <Grid item  md={3} sm={6} xs={12} mt={1}>
      <Card onClick={handleClick} sx={{cursor: 'pointer',borderRadius:5,minHeight:100,maxHeight:150, maxWidth: 345,display: 'flex', border:"1px solid #f2f2f2", bgcolor:"#f0f0f0" }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5" sx={{textOverflow:'ellipsis',}}>
          {props.title}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{width:100,objectFit:'cover'}}
        image= {props.logo}
        alt="logo"
      />
    </Card>



  
      </Grid>
  );
}

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function JobCard(props) {
   
    const {title,description,mode,photoUrl,tutorCode}=props
    const [display, setDisplay] = React.useState(true);

  const handleDelete=async(tutorCode)=>{
    await deleteDoc(doc(db, "Tutors", tutorCode));
    setDisplay("none")
   
  }

  const navigate=useNavigate()

  const handleNavigation=async()=>{
    if(!props.delete){
        navigate(`/Tutor/${tutorCode}`)
    }
   
  }


  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card elevation={24} sx={{ display:display,maxWidth: 345,height:200 }} onClick={handleNavigation}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} src={photoUrl} aria-label="Profile Pic" />
           
        }
        action={
          props.delete &&
          <IconButton aria-label="settings">
            <DeleteIcon onClick={()=>{handleDelete(tutorCode)}} />
          </IconButton>
        
      }
        title={title}
        subheader={mode}
      />
  
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description.slice(0,100)}
        </Typography>
      </CardContent>
    
      
    </Card>
    </Grid>
  );
}
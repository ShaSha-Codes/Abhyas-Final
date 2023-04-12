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



export default function JobCard(props) {
   
    const {title,description,mode,photoUrl,tutorCode}=props
    const [display, setDisplay] = React.useState(true);

  const handleDelete=async(tutorCode)=>{
    await deleteDoc(doc(db, "Tutors", tutorCode));
    setDisplay("none")
   
  }



  return (
    <Card sx={{ display:display,maxWidth: 345 }}>
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
          {description}
        </Typography>
      </CardContent>
    
      
    </Card>
  );
}
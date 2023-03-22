import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { CardActionArea } from '@mui/material';
import {useNavigate} from 'react-router-dom';


export default function ClassCard(props) {
  let navigate=useNavigate()
  const handleClick=()=>{
    navigate('/'+props.type+'/'+props.classCode)
  }

  return (
    <Grid item  md={3} sm={6} xs={12}>
    
    
      <Card onClick={handleClick} sx={{cursor: 'pointer',borderRadius:10,minHeight:290, maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="180"
          image={"https://api.dicebear.com/5.x/shapes/svg?seed="+props.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
          
        </CardContent>

      </Card>
  
      </Grid>
  );
}

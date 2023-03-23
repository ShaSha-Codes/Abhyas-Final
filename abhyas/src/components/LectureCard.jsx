import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';



export default function LectureCard(props) {

  let navigate=useNavigate()
    const handleClick=()=>{
        navigate('/Lecture/'+props.lecCode)
    }


  return (
    <Grid md={4} sm={6}xs={12}>
    <Card onClick={handleClick}sx={{ minWidth:300,maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="180"
          image="https://api.dicebear.com/5.x/fun-emoji/svg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    
    </Card>
    </Grid>
  );
}
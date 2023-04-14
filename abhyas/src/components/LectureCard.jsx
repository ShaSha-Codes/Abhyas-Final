import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import GeoPattern from 'geopattern';



export default function LectureCard(props) {

  let navigate=useNavigate()
    const handleClick=()=>{
        navigate('/Lecture/'+props.lecCode)
    }

    var pattern = GeoPattern.generate(props.title);
    var imgURL = pattern.toDataUri();

  return (
    <Grid md={4} sm={6}xs={12}>
    <Card onClick={handleClick} sx={{ marginBottom:'10px',marginRight:'10px',width:'95%',maxWidth:'500px',display: 'flex', bgcolor:"#f2f2f2 " }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="180"
          image={imgURL}
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
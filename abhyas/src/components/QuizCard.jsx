import * as React from 'react';
import { useTheme } from '@mui/material/styles'; 
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function QuizCard(props) {
  const theme = useTheme();
  let navigate=useNavigate()
    const handleClick=()=>{
        navigate('/Quiz/'+props.quizCode)
    }
  return (
    <Grid md={4} sm={6}xs={12}>
        <Card onClick={handleClick}  sx={{ marginBottom:'10px',marginRight:'10px',width:'95%',maxWidth:'500px',maxHeight:'120px',display: 'flex' }}>
            <CardActionArea >
                <Stack direction="row">
                    <CardMedia
                    component="img"
                    sx={{ width: 120,height: 120 }}
                    
                    image={`https://api.dicebear.com/6.x/identicon/svg?seed=`+props.title+`&scale=90&backgroundRotation=0,360,90,80,100,110,180,190,280,300,290&row1=ooxoo,oxxxo,xoxox&backgroundColor=D2E7E7`}
                    alt="Live from space album cover"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '2 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {props.subject}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {props.title.slice(0,100)+'...'}
                    </Typography>
                    </CardContent>
                </Box>
            </Stack>
        </CardActionArea>
        </Card>
    </Grid>
  );
}


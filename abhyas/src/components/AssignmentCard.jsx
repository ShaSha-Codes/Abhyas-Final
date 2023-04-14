import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GeoPattern from 'geopattern';

export default function AssignmentCard(props) {
  const theme = useTheme();
  let navigate=useNavigate()
    const handleClick=()=>{
        navigate('/Assignment/'+props.assignmentCode)
    }
    var pattern = GeoPattern.generate(props.title);
    var imgURL = pattern.toDataUri();
  return (
    <Grid md={4} sm={6}xs={12}>
        <Card onClick={handleClick}  sx={{ marginBottom:'10px',marginRight:'10px',width:'95%',maxWidth:'500px',maxHeight:'120px',display: 'flex', bgcolor:"#f2f2f2" }}>
            <CardActionArea >
                <Stack direction="row">

                    
                    <CardMedia
                    component="img"
                    sx={{ width: 120,height: 120 }}
                    
                    image={"https://api.dicebear.com/6.x/icons/svg?seed="+props.title}
                    alt="Live from space album cover"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {props.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {props.description.slice(0,100)+'...'}
                    </Typography>
                    </CardContent>
                
                </Box>
            </Stack>
        </CardActionArea>
        </Card>
    </Grid>
  );
}
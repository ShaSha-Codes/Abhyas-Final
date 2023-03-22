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

export default function AssignmentCard(props) {
  const theme = useTheme();

  return (
    <Grid md={4} sm={6}xs={12}>
        <Card sx={{ marginBottom:'10px',marginRight:'10px',maxWidth:'500px',display: 'flex' }}>
            <CardActionArea >
                <Stack direction="row">

                    
                    <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={"https://api.dicebear.com/5.x/icons/svg?seed="+props.title}
                    alt="Live from space album cover"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {props.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {props.description}
                    </Typography>
                    </CardContent>
                
                </Box>
            </Stack>
        </CardActionArea>
        </Card>
    </Grid>
  );
}
import React from 'react'
import SideBar from '../components/SideBar'
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
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useToggle from '../hooks/useToggle';
const Dashboard = () => {
  let user = useSelector(state => state.user.value);
  console.log(user.photoUrl)
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [toggleValue,toggler]=useToggle(false);
 


  
  return (
  
        <SideBar>
                <div style={{display: 'flex',height:'70vh', justifyContent: 'center', alignItems: 'center'}} >
                  <Card sx={{ display: 'flex',width:'700px' }}>
                    <Stack sx={{margin:2}} justifyContent="center">
                      <Avatar alt="Profile Pic" sx={{width: 250, height: 250}} src={user.photoUrl} />
                    </Stack>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Stack spacing={1}>
                    
                    <Typography component="div" variant="h3">
                      Profile
                    </Typography>
                    <Typography variant="h5" color="text.secondary" component="div">
                      <strong>Name: </strong> {user.fname+ " " + user.lname}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" component="div">
                      <strong>Email: </strong> {user.email}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" component="div">
                      <strong>Phone No: </strong> {user.phoneNo}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" component="div">
                      <strong>Gender: </strong> {user.gender}
                    </Typography>
                    <Button variant="contained" onClick={toggler}>Update</Button>
                    </Stack>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                  <Dialog
                    open={toggleValue}
                    onClose={toggler}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Use Google's location service?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={toggler}>Disagree</Button>
                      <Button  autoFocus>
                        Agree
                      </Button>
                    </DialogActions>
               </Dialog>
                
                  </Box>
                </Box>
              
              </Card>
              </div>
        </SideBar>
        
  
  )
}

export default Dashboard
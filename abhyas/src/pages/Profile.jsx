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
import {useSelector,useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useToggle from '../hooks/useToggle';
import ProfileEdit from '../components/ProfileEdit';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import GeoPattern from 'geopattern';


const Dashboard = () => {
  let user = useSelector(state => state.user.value);
  let dispatch = useDispatch();

  
  console.log(user.photoUrl)
  const theme = useTheme();
  const [toggleValue,toggler]=useToggle(false);

  const generatePattern = (name) => {
    var pattern = GeoPattern.generate(name, { color: '#3c7979' });
    var imgURL = pattern.toDataUri();
    return imgURL;
  }

 
 


  
  return (
  
        <SideBar>

    <div style={{height:'30vh',borderRadius:'20px',display:"flex", backgroundImage:"url(" +generatePattern(user.fname)+ ")"}}>
    <Button elevation={0} sx={{ marginLeft:"auto",borderRadius:"0px 20px 20px 0px",color:"white", bgcolor:"#285252","&:hover": {backgroundColor: '#142929' },}} variant="contained" onClick={toggler}>Update</Button>
          </div>
    
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px'}}>
              <Paper sx={{borderRadius:'20px',width:'50vw',height:'60vh',position:'absolute',left:'50',bottom:150}} elevation={24}>
                  <Avatar sx={{width:'150px',height:'150px',position:'absolute',left:'50%',top:'-50px',transform:'translateX(-50%)', border:"0.3rem solid white"}} src={user.photoUrl}/>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px',marginTop:'100px', height:"80%"}}>
                      <Typography variant='h4'>
                        <strong>{user.fname+ " " + user.lname}</strong>
                      </Typography>
                      <br/>
                      <Dialog
                    sx={{ '& .MuiDialogContent-root': { padding:0 },borderRadius: '10px' }}
                    open={toggleValue}
                    onClose={toggler}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                 
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        <ProfileEdit user={user}/>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button sx={{bgcolor:"#3c7979", color:"white","&:hover": {
                  backgroundColor: '#285252'
                } }}onClick={()=>toggler(false)}>Cancel</Button>
                      
                    </DialogActions>
               </Dialog>       
                      <Grid container sx={{height:"100%",bgcolor:"#f9f9f9", borderRadius:"20px"}}>
                          <Grid item xs={5.95} sx={{p:2}}>
                              
                              <Typography variant='h6'>
                              <strong>Email: </strong> {user.email}
                              </Typography>
                              <Typography variant='h6'>
                              <strong>Phone No: </strong> {user.phoneNo}
                              </Typography>
                              <Typography variant='h6'>
                              <strong>Gender: </strong> {user.gender}
                              </Typography>
                              <Typography variant='h6'>
                              <strong>Age: </strong> {user.age}
                              </Typography>
                              
                              
                          </Grid>
                          <Grid xs={0.1} sx={{bgcolor:"white"}}>
                          </Grid>
                          <Grid item xs={5.95} sx={{p:2}}>
                                <h3 style={{marginTop:0}}>Ongoing Activities:</h3>
                         </Grid>
                      </Grid>
                    
                      

                  </div>
                  
              </Paper>
            </div>
        </SideBar>
        
  
  )
}

export default Dashboard
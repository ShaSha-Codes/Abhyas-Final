import React from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { db,storage } from '../firebase';
import { doc,updateDoc } from "firebase/firestore";
import {  ref,uploadBytesResumable, getDownloadURL} from "firebase/storage";
import useToggle from '../hooks/useToggle';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { nanoid } from 'nanoid'
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { login } from '../features/user';

const ProfileEdit = (props) => {
  let user=useSelector(state=>state.user.value)
 

  const dispatch = useDispatch();
  let navigate = useNavigate();


  //All the Necessary States
  const [submitted,setSubmitted]=React.useState(false)
  const [toggleValue, toggler] = useToggle(false);
  const [alertData,setAlertData]=React.useState({severity:'error',message:'Fill all Inputs'})
  const [formData,setFormData]=React.useState({
    fname:'',
    lname:'',
    phoneNo:'',
    age:'',
    gender:'male',
    photoUrl:''
  })
  const [profilePic,setProfilePic]=React.useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')




  //For Handling Normal Form Inputs
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
  }



  //For Handling Profile Picture and Previewing It 
  const handlePictureChange=(e)=>{
    setProfilePic(URL.createObjectURL(e.target.files[0]))
    setFormData({
      ...formData,
      photoUrl:e.target.files[0]
    })
  }


  // Checking if all the inputs are filled and then uploading the profile picture to firebase storage and then updating the firestore database
  const handleSubmit=async(e)=>{
    e.preventDefault();
    for(let key in formData){
      if(formData[key]===''){
        setAlertData({severity:'error',message:'Fill all Inputs'})
        toggler(true)
        return
      }
    }
    const storageRef = ref(storage, 'ProfilePic/'+nanoid(6));
    const uploadTask = uploadBytesResumable(storageRef, formData.photoUrl);
    uploadTask.on('state_changed',async () => {
    await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      console.log('File available at', downloadURL);
      setFormData({
        ...formData,
        photoUrl:downloadURL
      })
      setSubmitted(true)
       });
  }
);
  }



//Updates FireStore Database with the new data on submit state change
React.useEffect(() => {
  if (submitted){
    (async ()=>{
      dispatch(login(formData))

    const dataRef = doc(db, "UserInfo", user.email);
      await updateDoc(dataRef, {
        profile: true,
        ...formData
      });
    
      setAlertData({severity:'success',message:'Profile Updated Successfully'})
      toggler(true)
      setTimeout(() => {
        navigate('/dashboard')
      },1000)

  })()
}
}, [submitted])










  return (
    <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      '& > :not(style)': {
        m: 1,
        width: 500,
        height: 550,
      },
    }}
  >
  
 
    <Paper component={Stack} direction="column" alignItems="center"  justifyContent="center" elevation={12} >
    
      <Typography variant="h4" component="div" gutterBottom>
          Profile
      </Typography>
      {toggleValue &&
      <Collapse in={toggleValue}>
        <Alert
          severity={alertData.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                toggler()
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertData.message}
        </Alert>
      </Collapse>
      }
      <div >
              <label style={{width: '80px',cursor: 'pointer'}} for="file-input" >
                <Avatar
                alt="Profile Pic"
                src={profilePic}
                sx={{ width: 100, height: 100}}
              />
        </label>

        < input onChange={handlePictureChange} style={{display: 'none'}} id="file-input" type="file"/>
    </div>
      <Stack sx={{marginTop:'1em'}}direction="row" spacing={2}>
        <TextField id="outlined-basic" value={formData.fname} onChange={handleChange} label="First Name" name="fname" variant="outlined" />
        <TextField id="outlined-basic" value={formData.lname} onChange={handleChange}  label="Last Name" name="lname" variant="outlined" />
      </Stack>
      <Stack sx={{marginTop:'1em'}} direction="row" spacing={2}>
        <TextField id="outlined-basic" label="Phone No" onChange={handleChange}  value={formData.phoneNo} name="phoneNo" variant="outlined" />
        <TextField id="outlined-basic" type="Number" onChange={handleChange}  value={formData.age} label="Age" name="age" variant="outlined" />
        </Stack>
      <FormControl sx={{marginTop:'1.2em'}}>
      <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        defaultValue="male"
        name="gender"
      >
        <FormControlLabel value="male" onChange={handleChange}  control={<Radio />} label="Male" />
        <FormControlLabel value="female" onChange={handleChange}  control={<Radio />} label="Female" />
        <FormControlLabel value="other" onChange={handleChange}  control={<Radio />} label="Other" />
        
      </RadioGroup>
    </FormControl>
    <Button onClick={handleSubmit} sx={{marginTop:'10px',width:'250px',height:'40px'}} variant="contained">Submit</Button>
      </Paper>
  </Box>
  )
}

export default ProfileEdit
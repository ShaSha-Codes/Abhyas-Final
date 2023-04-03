import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from "firebase/auth";
import useToggle from '../hooks/useToggle';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { auth,db } from '../firebase';
import { useNavigate,Link } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore"; 
import { useDispatch} from 'react-redux';
import { login } from '../features/user';
import { Paper } from '@mui/material';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Abhyas
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {

    const dispatch = useDispatch();
    
    
    let navigate = useNavigate();



    //For Toggle Custom Hook
    const [toggleValue, toggler] = useToggle(false);
    const [alertData,setAlertData] = React.useState({severity:'error',message:'Error Occured'});

  const handleSubmit = (event) => {
    //Fetching Data
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email=data.get('email');
    let password=data.get('password');
    let confirmPassword=data.get('confirmPassword');

    if(password!=confirmPassword){
        setAlertData({severity:'error',message:'Passwords Do Not Match'})
        toggler(true)
    }else{

    // Firebase Sign Up
     createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setAlertData({severity:'success',message:'Success Redirecting'})
        toggler(true)
        
        await setDoc(doc(db, "UserInfo", email), {
            email: email,
            profile:false,
            student:[],
            teacher:[]
          });
          
        dispatch(login({email:email,profile:false}))
        setTimeout(() => {
            navigate('/CompleteProfile')
        },1000)
  
      })
      .catch((error) => {
        const errorCode = error.code; 
        const errorMessage = error.message;
     
        if(errorCode=="auth/email-already-in-use"){
            setAlertData({severity:'error',message:'Email Already in Use'})
            toggler(true)
        }else if(errorCode=="auth/invalid-email"){
            setAlertData({severity:'error',message:'Invalid Email'})
            toggler(true)
        }else if(errorCode=="auth/weak-password"){
            setAlertData({severity:'error',message:'Weak Password'})
            toggler(true)
        }



      });

    }

  };






  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={5}
        sx={{
          m: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop:'10vh',
          padding:'2rem',
          paddingTop:'0rem',
          borderRadius:'1rem',
          
        }}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#3c7979' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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

            <Grid container spacing={2}>
              
             
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
              </Grid>
             
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor:'#3c7979',"&:hover": {
                backgroundColor: '#285252'
              }, }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        </Paper>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
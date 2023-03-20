import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signInWithEmailAndPassword  } from "firebase/auth";
import { auth,db} from "../firebase";
import useToggle from "../hooks/useToggle";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate,Link } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore"; 



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Landing() {
  let navigate = useNavigate();
  //For Toggle Custom Hook
  const [toggleValue, toggler] = useToggle(false);
  const [alertData,setAlertData] = React.useState({severity:'error',message:'Invalid Email or Password'});

  //For Submitting Login Form

  const handleSubmit = (event) => {

    //Fetching Data
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email=data.get('email');
    let password=data.get('password');


    //Firebase Sign In
    signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {

      
      const user = userCredential.user;
      setAlertData({severity:'success',message:'Login Successful'})
      toggler(true)

      const docRef = doc(db, "UserInfo", user.email);
      const docSnap = await getDoc(docRef);
      
      setTimeout(() => {
        if(docSnap.data().profile){
          navigate('/Dashboard')
        }else{
          navigate('/CompleteProfile')
        }
      },1000)

      console.log(docSnap.data())
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setAlertData({severity:'error',message:'Invalid Email or Password'})
      toggler(true)
   
    });

   
   
  };








  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
           
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            { toggleValue &&
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
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  
                </Grid>
                <Grid item>
                  <Link to="/SignUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
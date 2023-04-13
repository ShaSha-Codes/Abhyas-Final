import * as React from 'react';
import { useParams } from 'react-router-dom'
import useLogout from '../hooks/useLogout'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import useToggle from '../hooks/useToggle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { db,storage } from '../firebase';
import { doc,addDoc } from "firebase/firestore";
import { ref,uploadBytesResumable, uploadBytes,getDownloadURL, deleteObject} from "firebase/storage";
import { nanoid } from 'nanoid';
import {collection,query,where,getDoc,getDocs, deleteDoc} from 'firebase/firestore'




const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

  const theme = createTheme();
  

export default function CertificateMaker() {
    let navigate = useNavigate();
    const {classCode} = useParams()
    const [logo, setLogo] = React.useState('https://png.pngitem.com/pimgs/s/491-4918258_your-logo-here-horizontal-transparent-graphic-design-hd.png');
    const [signature, setSignature] = React.useState('https://png.pngitem.com/pimgs/s/577-5778075_certified-png-transparent-png.png');
    const [alertData,setAlertData]=React.useState({severity:'error',message:'Fill all Inputs'})
    const [toggleValue, toggler] = useToggle(false);
    const [logoData, setLogoData] = React.useState({
        photoUrl: '',
    });
    const [signatureData, setSignatureData] = React.useState({
        signatureUrl: '',
    });

    const [studentsData, setStudentsData] = React.useState([]);
    const [studentSelected, setStudentSelected] = React.useState([]);
    const [submitted,setSubmitted]=React.useState(false);
    const [submitted1,setSubmitted1]=React.useState(false);
    const [show,setShow] = React.useState(false);
    const [buttonContent,setButtonContent]=React.useState("");
    const [existingCertificates,setExistingCertificates]=React.useState([]);

    const checker=useLogout()
    React.useEffect(() => {
        checker("teacher",classCode)
    },[])

    const handleSubmit=async(e)=>{
        e.preventDefault();

            if(document.getElementById('organisation name').value===""){
                setAlertData({severity:'error',message:'Enter Organisation Name'})
                toggler(true)
                return
            }
            if(document.getElementById('title').value===""){
                setAlertData({severity:'error',message:'Enter Title'})
                toggler(true)
                return
            }
            if(studentSelected.length===0){
                setAlertData({severity:'error',message:'Choose at least one student'})
                toggler(true)
                return
              }
            if(!logoData.photoUrl){
              setAlertData({severity:'error',message:'Upload Organisation Logo'})
              toggler(true)
              return
            }
            if(!signatureData.signatureUrl){
                setAlertData({severity:'error',message:'Upload Signature'})
                toggler(true)
                return
            }
            if(document.getElementById('signer').value===""){
                setAlertData({severity:'error',message:'Enter Signer Name'})
                toggler(true)
                return
            }
            
          const storageRef = ref(storage, 'Logo/'+nanoid(6));
          const uploadTask = uploadBytesResumable(storageRef, logoData.photoUrl);
          uploadTask.on('state_changed',(snapshot)=>{},(error)=>console.log(error),() => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            setLogoData({
                ...logoData,
                photoUrl:downloadURL
            })

            setSubmitted(true)
            certificatesUpdater()
             });
          });

          const storageRef1 = ref(storage, 'Signature/'+nanoid(6));
            const uploadTask1 = uploadBytesResumable(storageRef1, signatureData.signatureUrl);
            uploadTask1.on('state_changed',(snapshot)=>{},(error)=>console.log(error),() => {
                getDownloadURL(uploadTask1.snapshot.ref).then(async (downloadURL1) => {
                console.log('File available at', downloadURL1);
                setSignatureData({
                    ...signatureData,
                    signatureUrl:downloadURL1
                })
                setSubmitted1(true)
                });
            });
      
        }
      

      const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setStudentSelected(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );}

      const handlePictureChange=(e)=>{
                setLogo(URL.createObjectURL(e.target.files[0]))
                setLogoData({
                ...logoData,
                photoUrl:e.target.files[0]
                })
                console.log("logo changed")
            }

        const handleSignatureChange=(e)=>{
                setSignature(URL.createObjectURL(e.target.files[0]))
                setSignatureData({
                ...signatureData,
                signatureUrl:e.target.files[0]
                })
                console.log("signature changed")
            }
            

            const certificatesUpdater = async () => {

              const q1 = query(collection(db, "Certificates"), where("classCode", "==", classCode));
              const querySnapshot1 = await getDocs(q1);
              let certificates = []
              querySnapshot1.forEach((doc) => {
                  certificates.push(doc.data())
              });
              setExistingCertificates(certificates)
            }

            const studentUpdater = async () => {
                const q = query(collection(db, "UserInfo"), where("student", "array-contains", classCode));
                const querySnapshot = await getDocs(q);
                let students = []
                querySnapshot.forEach((doc) => {    
                  if ( existingCertificates.length===0){
                    let tempData=doc.data()
                    students.push(tempData.fname+" "+tempData.lname+" ("+tempData.email+")")
                  }
                  else{
                  for(let i=0;i<existingCertificates.length;i++){
                    if(existingCertificates[i].email!==doc.data().email){
                    let tempData=doc.data()
                    students.push(tempData.fname+" "+tempData.lname+" ("+tempData.email+")")
                    }
                  }
                }
                    
                });
                setStudentsData(students)
            }
          

            const getStudentEmail = (props)=>{
                var str = props,
                pos = str.indexOf("(") + 1;
                str = str.slice(pos, str.lastIndexOf(")"));
                return str
            }

            const setShowValue=()=>{
              setShow(!show)
              if(show){
                setButtonContent("Show")
              }else{
                setButtonContent("Hide")
              }
            }


            React.useEffect(() => {
                certificatesUpdater()
            }, [])

            React.useEffect(() => {
                studentUpdater()
            }, [existingCertificates])

            React.useEffect(() => {
                if (submitted && submitted1){
                  (async ()=>{
                    for (let key in studentSelected){
                        let studentName
                        const q= query(collection(db, "UserInfo"), where("email", "==",studentSelected[key]));
                        const querySnapshot = await getDocs(q);
                        querySnapshot.forEach((doc) => {
                            let tempData=doc.data()
                            studentName=tempData.fname+" "+tempData.lname
                        });
                        console.log(studentName)
                        const credential = nanoid(9)
                        const dataRef = collection(db, "Certificates");
                        await addDoc(dataRef, {
                            certificateCredential: credential,
                            organisation: document.getElementById('organisation name').value,
                            title: document.getElementById('title').value,
                            logo: logoData.photoUrl,
                            signature: signatureData.signatureUrl,
                            signer: document.getElementById('signer').value, 
                            email: studentSelected[key],
                            date: Date.now(),
                            name: studentName,
                            classCode: classCode
                        });

                        
                    }
                  
                  
                    setAlertData({severity:'success',message:'Certificate Created'})
                    toggler(true)
                    certificatesUpdater()
              
                })()
              }
              }, [submitted,submitted1])

  return (
    <div>
 <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="organisation name"
              label="Organisation Name"
              name="organisation name"
              autoComplete="organisation name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="title"
              label="Title"
              type="title"
              id="title"
              autoComplete="current-title"
            />

        <InputLabel id="demo-multiple-checkbox-label">Select Students</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          fullWidth
          name='demo-multiple-checkbox'
          value={studentSelected}
          onChange={handleChange}
          input={<OutlinedInput label="Select Students" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          placeholder="Select Students"
        >
          {studentsData.map((name) => (
            <MenuItem key={name} value={getStudentEmail(name)}>
              <Checkbox checked={studentSelected.indexOf(getStudentEmail(name)) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
     
        <div  style={{display:'flex', justifyContent:'space-between',marginTop:10}}>
        <div>
        <InputLabel id="logo">Organisation Logo</InputLabel>
              <label style={{width: '80px',cursor: 'pointer'}} for="file-input" >
                <Avatar
                labelId="logo"
                alt="Organisation Logo"
                src={logo}
                sx={{ width: 160, height: 100, objectFit: 'cover'}}
                variant="rounded"
              />
        </label>
        < input onChange={handlePictureChange} style={{display: 'none'}} id="file-input" type="file"/>
        </div>


        <div>
        <InputLabel id="signature">Signature</InputLabel>
              <label style={{width: '80px',cursor: 'pointer'}} for="sign" >
                <Avatar
                labelId="signature"
                alt="Signature"
                src={signature}
                sx={{ width: 160, height: 100, objectFit: 'cover'}}
                variant="rounded"
              />
        </label>
        < input onChange={handleSignatureChange} style={{display: 'none'}} id="sign" type="file"/>
         </div>


     </div>
     <TextField
         margin="normal"
         required
         fullWidth
          name="signer"
          label="Signer's Name"
          type="signer"
          id="signer"
          autoComplete="current-signer"
        />
     
        
    
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#3c7979' }}
            >
              Make Certificates
            </Button>
          </Box>
          <Grid xs={12} sx={{width:"80vw"}} >
          <Paper sx={{marginTop:1,p:1.5,paddingLeft:10,minHeight:'10px',backgroundColor:'#f2f2f2',borderRadius:2}}>
            <div style={{display:"flex", style:"row" , justifyContent:"space-between" }}>
            <Typography variant="h6" sx={{color:'black'}}>View Assigned Certificates</Typography>
            <Typography sx={{color:'gray', fontSize:'15px', marginTop:'auto'}}><button onClick={setShowValue} style={{display:'flex', alignItems:'center',borderRadius:"10px",border:'solid 0.5px gray'}}>{buttonContent}{!show&& <ArrowDropDownIcon/>}{show&&<ArrowDropUpIcon/>}</button></Typography>
            </div>
             {show && 
             <div style={{marginTop:'10px'}}>
              <hr style={{borderTop:'1px dotted gray', marginBottom:10}}/>
             <Typography variant="body1" sx={{color:'black',marginTop:-1}}>
              {existingCertificates.map((certificate)=>{
                return(
                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                    <Typography variant="h6" sx={{color:'black'}}>{certificate.name +" ("+certificate.email+") "}</Typography>
                    <Button onClick={()=>{setShowValue(); navigate('/VerifyCertificate/'+certificate.certificateCredential)}} sx={{color:'#3c7979',marginLeft:5,height:"10px"}}>View</Button>
                    <Button onClick={async()=>{   
                      const q = query(collection(db, "Certificates"), where("certificateCredential", "==", certificate.certificateCredential));
                      const querySnapshot = await getDocs(q);
                      querySnapshot.forEach((doc) => {
                          deleteDoc(doc.ref);
                        const logoRef = ref(storage, certificate.logo);
                        const signatureRef = ref(storage, certificate.signature);
                        deleteObject(logoRef);
                        deleteObject(signatureRef);
                        certificatesUpdater()
                        console.log("deleted")
                      });
                    }} sx={{color:'red',marginLeft:5,height:"10px"}}>Delete</Button>
                    </div>
                
                )
              })  
              }
             </Typography>
             </div>} 
            
     
          </Paper>
          </Grid>
        </Box>
        
      </Container>
    </ThemeProvider>
    </div>
  )
}

import React from 'react'
import SideBar from '../components/SideBar'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ClassCard from '../components/ClassCard';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ClassIcon from '@mui/icons-material/Class';
import ClassMaker from '../components/ClassMaker';
import ClassJoiner from '../components/ClassJoiner';
import { useSelector } from 'react-redux';
import {db} from '../firebase'
import {collection,query,where,getDocs} from 'firebase/firestore'
import Error from '../components/Error';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}




const Classroom = () => {
  const [openTeacher, setOpenTeacher] = React.useState(false);
  const [openStudent, setOpenStudent] = React.useState(false);
  const [teacherCardData, setTeacherCardData] = React.useState([]);
  const [studentCardData, setStudentCardData] = React.useState([]);


  let user = useSelector(state => state.user.value)
  console.log(user)
  // For gathering teacher cards data
  React.useEffect(() => {
    (async()=>{const q = query(collection(db, "Classes"), where("teacher", "==", user.email));
    let tempData=[]
      await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tempData.push(doc.data())
        
      })})
    setTeacherCardData(tempData)
  })();

  (async()=>{
    const q = query(collection(db, "Classes"), where("students", "array-contains", user.email));
    let tempData=[]
      await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tempData.push(doc.data())
        
      })})

    setStudentCardData(tempData)

  })();



    
  },[user])

  






  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <SideBar>
         <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Student" {...a11yProps(0)} />
              <Tab label="Teacher" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
          <Grid container spacing={3}>

            <ClassJoiner openStudent={openStudent} setOpenStudent={setOpenStudent} />
                {
                  studentCardData.map((data) => {
                    return <ClassCard classCode={data.classCode} type="Student" title={data.title} description={data.description} />
                  })
                }
        
            </Grid>
            <IconButton sx={{position: 'fixed',bottom: '50px',right: '50px' }} onClick={()=>setOpenStudent(true)} size="large"  saria-label="Create a Class" color="secondary">
                <ClassIcon fontSize="large" />
              </IconButton>
          </TabPanel>




          <TabPanel value={value} index={1}>
          <Grid container spacing={2}>
           
             <ClassMaker openTeacher={openTeacher} setOpenTeacher={setOpenTeacher} />
                 {
                  teacherCardData.map((data) => {
                    return <ClassCard classCode={data.classCode} type="Teacher" title={data.title} description={data.description} />
                  })
                }
            
            </Grid>
              <IconButton sx={{position: 'fixed',bottom: '50px',right: '50px' }} onClick={()=>setOpenTeacher(true)} size="large"  saria-label="Create a Class" color="secondary">
                <AddToQueueIcon fontSize="large" />
              </IconButton>
            

          </TabPanel>
        </Box>
        <Error />
    </SideBar>
  )
}

export default Classroom
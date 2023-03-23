import React from 'react'
import SideBar from '../components/SideBar'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SpeedDialer from '../components/SpeedDialer';
import NotesIcon from '@mui/icons-material/Notes';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { useSelector,useDispatch} from 'react-redux';
import {db} from '../firebase'
import {collection,query,where,getDocs} from 'firebase/firestore'
import QuizForm from '../components/QuizForm';
import AssignmentForm from '../components/AssignmentForm';
import LectureForm from '../components/LectureForm';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import LectureCard from '../components/LectureCard';
import { Grid } from '@mui/material';


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

const teacherActions = [
    { icon: <NotesIcon />, name: 'Upload Notes' },
    { icon: <VideoFileIcon />, name: 'Upload Lecture' },
    { icon: <AssignmentIcon />, name: 'Upload Assignment' },
    { icon: <QuizIcon />, name: 'Upload Quiz' },
    { icon: <LiveTvIcon />, name: 'Go Live' }
  ];

























const Teacher = () => {
    let dispatch = useDispatch()
    let user = useSelector(state => state.user.value)
    const {classCode} = useParams()

    const [value, setValue] = React.useState(0);
    const [speedDialValue,setSpeedDialValue] = React.useState(0)
    const [notesData,setNotesData] = React.useState([])
    const [lecturesData,setLecturesData] = React.useState([])
    const [assignmentsData,setAssignmentsData] = React.useState([])
    const [quizzesData,setQuizzesData] = React.useState([])

    const notesUpdater = async () => {
        const q = query(collection(db, "Notes"), where("classCode", "==", classCode));
        const querySnapshot = await getDocs(q);
        let notes = []
        querySnapshot.forEach((doc) => {
            
            let tempData=doc.data()
            console.log(tempData)
            notes.push(<NoteCard {...tempData}/>)
        });
        setNotesData(notes)
    }

    const lecturesUpdater = async () => {
        const q = query(collection(db, "Lectures"), where("classCode", "==", classCode));
        const querySnapshot = await getDocs(q);
        let lectures = []
        querySnapshot.forEach((doc) => {
            lectures.push(<LectureCard {...doc.data()}/>)
        });
        setLecturesData(lectures)
    }

    const assignmentsUpdater = async () => {
        const q = query(collection(db, "Assignments"), where("classCode", "==", classCode));
        const querySnapshot = await getDocs(q);
        let assignments = []
        querySnapshot.forEach((doc) => {
            assignments.push(doc.data())
        });
        setAssignmentsData(assignments)
    }

    const quizzesUpdater = async () => {
        const q = query(collection(db, "Quizzes"), where("classCode", "==", classCode));
        const querySnapshot = await getDocs(q);
        let quizzes = []
        querySnapshot.forEach((doc) => {
            quizzes.push(doc.data())
        });
        setQuizzesData(quizzes)
    }


    React.useEffect(() => {
        notesUpdater()
        lecturesUpdater()
        // assignmentsUpdater()
        // quizzesUpdater()
    },[speedDialValue])



  console.log(speedDialValue)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 



  return (
    <>
    <SideBar>
         <Box sx={{ width: '100%' }}>
        
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="All" {...a11yProps(0)} />
                    <Tab label="Notes" {...a11yProps(1)} />
                    <Tab label="Lectures" {...a11yProps(2)} />
                    <Tab label="Assignments" {...a11yProps(3)} />
                    <Tab label="Quizzes" {...a11yProps(4)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Grid container spacing={1}>
                  
                    {notesData}
                    {lecturesData}
                </Grid>
                
                
            </TabPanel>
            <TabPanel value={value} index={1}>
                Notes
            </TabPanel>
            <TabPanel value={value} index={2}>
                Lectures
            </TabPanel>
            <TabPanel value={value} index={3}>
                Assignments
            </TabPanel>
            <TabPanel value={value} index={4}>
                Quizzes
            </TabPanel>
            <AssignmentForm speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}/>
            <QuizForm speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}/>
            <LectureForm speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}/>
            <NoteForm speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}/>

        </Box>
     
    </SideBar>
    <SpeedDialer speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}  actions={teacherActions}/>
    </>
   
  )
}

export default Teacher
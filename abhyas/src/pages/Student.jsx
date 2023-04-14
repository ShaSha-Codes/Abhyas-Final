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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import QuizIcon from '@mui/icons-material/Quiz';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { useSelector,useDispatch} from 'react-redux';
import {db} from '../firebase'
import {collection,query,where,getDocs} from 'firebase/firestore'
import QuizCard from '../components/QuizCard';
import AssignmentForm from '../components/AssignmentForm';
import LectureForm from '../components/LectureForm';
import NoteForm from '../components/NoteForm';
import QuizPreview from '../components/QuizCard';
import NoteCard from '../components/NoteCard';
import LectureCard from '../components/LectureCard';
import { Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useLogout from '../hooks/useLogout';
import ChatRoom from '../components/ChatRoom';
import { useNavigate } from 'react-router-dom';
import CreateQuiz from './CreateQuiz';
import Button from '@mui/material/Button';
import CertificateMaker from '../components/CertificateMaker';


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
const Student = () => {
  let dispatch = useDispatch()
  let user = useSelector(state => state.user.value)
  let navigate=useNavigate()


  
  const {classCode} = useParams()

  const [value, setValue] = React.useState(0);
  const [speedDialValue,setSpeedDialValue] = React.useState(0)
  const [notesData,setNotesData] = React.useState([])
  const [lecturesData,setLecturesData] = React.useState([])
  const [assignmentsData,setAssignmentsData] = React.useState([])
  const [quizzesData,setQuizzesData] = React.useState([])
  

  
  
  const checker=useLogout()
  React.useEffect(() => {
      checker("student",classCode)
  },[])


  
  const notesUpdater = async () => {
      const q = query(collection(db, "Notes"), where("classCode", "==", classCode));
      const querySnapshot = await getDocs(q);
      let notes = []
      querySnapshot.forEach((doc) => {
          
          let tempData=doc.data()
          console.log(doc.data())
          notes.push(<NoteCard {...tempData}/>)
      });
      console.log(notes)
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
        let tempData=doc.data()
        quizzes.push(<QuizCard {...tempData}/>)
    })
    setQuizzesData(quizzes)
};
  React.useEffect(() => {
      notesUpdater()
      lecturesUpdater()
      assignmentsUpdater()
      quizzesUpdater()
     
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
                  <Tab label="Chat" {...a11yProps(5)} />
              </Tabs>
          </Box>
          <TabPanel value={value} index={0}>

          {
            notesData.length>0 &&
            
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                  {notesData}
              </Grid>
            </AccordionDetails>
          </Accordion>
          }
        { lecturesData.length>0 &&
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              
              <Typography>Lectures</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Grid container spacing={1}>
                {lecturesData}
            </Grid>
            </AccordionDetails>
          </Accordion>


}
{ 

        assignmentsData.length>0 &&
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Assignments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                  {notesData}
              </Grid>
            </AccordionDetails>
          </Accordion>
        }

         
          {quizzesData.length &&

          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Quizzes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                  {quizzesData}
              </Grid>
            </AccordionDetails>
          </Accordion>
        
          }
          
              
          </TabPanel>
          <TabPanel value={value} index={1}>
                <Grid container spacing={1}>
                    {notesData}
                </Grid>
          </TabPanel>
          <TabPanel value={value} index={2}>
              <Grid container spacing={1}>
                {lecturesData}
              </Grid>
          </TabPanel>
          <TabPanel value={value} index={3}>
              Assignments
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Grid container spacing={1
            }>{quizzesData}</Grid>
          </TabPanel>
          <TabPanel value={value} index={5}>
              <ChatRoom/>
          </TabPanel>
          <AssignmentForm speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}/>
          <LectureForm speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}/>
          <NoteForm speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}/>
            
      </Box>
  </SideBar>
  </>
)
}
export default Student

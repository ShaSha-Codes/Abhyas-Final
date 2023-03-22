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
  const [value, setValue] = React.useState(0);
  const [speedDialValue,setSpeedDialValue] = React.useState(0)
  console.log(speedDialValue)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const {classCode} = useParams()



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
                All
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
            
        </Box>
     
    </SideBar>
    <SpeedDialer speedDialValue={speedDialValue} setSpeedDialValue={setSpeedDialValue}  actions={teacherActions}/>
    </>
   
  )
}

export default Teacher
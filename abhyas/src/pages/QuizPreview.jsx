import SideBar from '../components/SideBar'
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import '../global.css'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DownloadIcon from '@mui/icons-material/Download';
import useLogout from '../hooks/useLogout';
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // import your firebase config
import { Card, CardContent, List, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';


function QuizPreview() {
  const [quizzes, setQuizzes] = useState(null);
  const [students,setStudents]=useState([]);
  const checker=useLogout()
   React.useEffect(()=>{
    checker("Quizzes",quizCode)
},[])
   
  const {quizCode}=useParams()
  useEffect(() => {
    (async () => {
      const docRef1 = doc(db, 'Quizzes', quizCode);
      const docSnap = await getDoc(docRef1);
      if (docSnap.exists()) {
        setQuizzes(docSnap.data());
      }
    })();
  }, []);

  useEffect(() => {
      (async()=>{const docRef2=doc(db,'Classes',quizzes.classCode);
      const docSnap=await getDoc(docRef2);
      if(docSnap.exists()){
          setStudents(docSnap.data().students)
      }
      })()
      console.log(students)
  },[])
  
  
 
  if (!quizzes) return null;

  return (
<> 
    <SideBar/>
   <Grid container direction="row" display="flex" justifyContent="center" alignItems="center" sx={{color:"black"}}>
    <Typography variant="h4" alignItems="center" sx={{color:"white",textAlign:"center",marginBottom:"30px",
         background: "#2c3333",
         width:"50%",
         borderRadius: "12px",
         boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
         backdropFilter: "blur(16px) brightness(80%)",
         wordWrap: 'break-word',
        border:"1px solid black",padding:"8px"}}>{quizzes.subject} Quiz</Typography>
      </Grid>
      <Grid container direction="row" sx={{color:"black",marginLeft:'130px'}}>
  <Typography variant="h5" align="center" gutterBottom>
    Students
  </Typography>
  <List>
    {quizzes.students.map((student, index) => (
      <ListItem key={index}>
        <ListItemText primary={student.email} secondary={`Marks: ${student.marks}`}/>
      </ListItem>
    ))}
  </List>
</Grid>
  <Grid container direction="row" display="flex" justifyContent="center" alignItems="center" sx={{color:"black"}} >
    {quizzes.Questions.map((question, index) => (
      <Card key={index} display="flex" sx={{ marginBottom: '16px', width: '80%',marginLeft:"20px",
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: "12px",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(16px) brightness(80%)",
        wordWrap: 'break-word',
        "&:hover": {
          boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.4)",
        },
      }}>
        <CardContent sx={{color:"black",padding:"20px"}}>
          <Typography multiline sx={{fontSize:'20px',marginBottom:"15px",borderBottom:"2px solid"}} component="h2" gutterBottom>
           {index+1}.{question.text}
          </Typography>
          {question.options.map((option, index) => (
           
              <Typography variant="body1" sx={{color:"black",marginTop:"20px"}}>{index+1}.{option}</Typography>
          
          ))}
         
            <Typography variant="body1" sx={{maxWidth:"300px",lineHeight:"1.5",marginTop:"20px",
            background: "#2c3333",
            color:"white",
            borderRadius: "12px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(16px) brightness(80%)",
            wordWrap: 'break-word',
             border:"1px solid black",padding:"8px",}}>
                Answer : {question.correctAnswer}</Typography>
        </CardContent>
      </Card>
    ))}
  </Grid>
</>

  )
}

export default QuizPreview


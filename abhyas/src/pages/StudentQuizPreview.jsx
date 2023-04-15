import React from 'react'
import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import {doc,getDoc,updateDoc} from 'firebase/firestore'
import {db} from '../firebase';
import { TextField, Typography } from '@mui/material';
import { Grid,Paper,Box, Button, List, ListItem} from '@mui/material';
import {  ListItemText, ListItemIcon } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { CancelOutlined } from '@mui/icons-material';



function StudentQuizPreview() {
  
  
  const [Questions, setQuestions] = useState([]);
  const [email,setEmail] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizData,setQuizData]=useState([])
  const {quizCode}=useParams()
  const [subject,setSubject]=useState("");
  const [submitBool,setSubmitBool]=useState(false);
  const [TotalMarks,setTotalMarks]=useState(0);
  const [marks,setMarks]=useState(0);
  const [ans_arr,setAns_arr]=useState([])
  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'Quizzes', quizCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTotalMarks(docSnap.data().totalMarks)
        setQuestions(docSnap.data().Questions);
        setSubject(docSnap.data().title)
      }
    })();
  }, []);
   



 const handleEmail=(e)=>{
    setEmail(e.target.value)
 }
 
const [emailBool,setEmailBool]=useState(false)


const handleEmailSubmit=(event)=>{
  event.preventDefault();
    setEmailBool(true)
 } 

  

  // Set up the timer
  useEffect(() => {
    if (emailBool && Questions.length > 0 && currentQuestionIndex < Questions.length) {
      const timeLimit = Questions[currentQuestionIndex].timer * 60
      setTimeRemaining(timeLimit);
      const timerId = setInterval(() => {
        setTimeRemaining(prevTimeRemaining => {
          if (prevTimeRemaining === 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            return null;
          }
          return prevTimeRemaining - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [Questions, currentQuestionIndex, emailBool]);

  
  
  const handleAnswerSelected = (answer) => {
    // Check the answer and move to the next question
    const isCorrect = answer === Questions[currentQuestionIndex].correctAnswer;
    if(isCorrect){setMarks(prev=>prev+parseInt(Questions[currentQuestionIndex].weightage))}
     setAns_arr(prev=>[...prev,{question:Questions[currentQuestionIndex].text,answer:answer,isCorrect:isCorrect,
      CorrectAnswer:Questions[currentQuestionIndex].correctAnswer}])
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };
   
  
  //fetching the data from the database and updating the student's array
  
  const handleSubmit=async()=>{
  console.log(email)
  const docRef = doc(db, 'Quizzes', quizCode);  
  const docSnap = await getDoc(docRef);
  console.log(email)
  setSubmitBool(true);
  if (docSnap.exists()) {
    const quizData = docSnap.data();
    console.log(quizData)
    const newStudent = {
      email: email,
      marks: marks,
    };
    quizData.students.push(newStudent);
    await updateDoc(docRef, { students: quizData.students });
    
  }
  
   
   
  }

 
  if (Questions.length === 0) {
    return <div>Loading...</div>
  }
  
  if(submitBool){
    const isCorrect=false
   
    return (
      <Grid container direction="row" alignItems="center" sx={{marginTop:"100px",width:"150%",
      marginLeft:"250px"
    }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Paper style={{ padding: 16,backgroundColor:"#2c3333",color:"White" }} >
            <Typography variant="h5" align="center">
              You Scored {marks} out of {TotalMarks}
            </Typography>
            {   Questions.map((question,{isCorrect},index) => (
     <ListItem key={index}>
    <ListItemText primary={`Question :${question.text}`}/>
    <ListItemText primary={"your answer:None"} />
    {isCorrect ? (
      <ListItemIcon>
        <CheckCircleOutline style={{ color: 'green' }} />
      </ListItemIcon>
    ) : (
      <ListItemIcon>
        <CancelOutlined style={{ color: 'red' }} />
      </ListItemIcon>
    )}
    <ListItemText primary={`Correct answer: ${question.correctAnswer}`} />
  </ListItem>
))}
          </Paper>
        </Grid>
      </Grid>
    );
  }
  

  if (currentQuestionIndex == Questions.length) {
    return (
      <Grid container direction="row"  alignItems="center"
       sx={{marginTop:"100px",width:"150%",marginLeft:"250px"}}  >
        <Grid item xs={12} sm={8} md={6} >
          <Paper style={{ padding: 16,backgroundColor:"#2c3333",color:"White" }} >
            <Typography variant="h5" align="center">
              You Scored {marks} out of {TotalMarks}
            </Typography>
            {   ans_arr.map(({ question, answer, isCorrect, CorrectAnswer }, index) => (
     <ListItem key={index}>
    <ListItemText primary={`Question :${question}`} />
    <ListItemText primary={`Your answer: ${answer}`} />
    {isCorrect ? (
      <ListItemIcon>
        <CheckCircleOutline style={{ color: 'green' }} />
      </ListItemIcon>
    ) : (
      <ListItemIcon>
        <CancelOutlined style={{ color: 'red' }} />
      </ListItemIcon>
    )}
    <ListItemText primary={`Correct answer: ${CorrectAnswer}`} />
  </ListItem>
))}
          </Paper>
        </Grid>
      </Grid>
    );
  }

 
 

  if(emailBool){return(
    <>
      <Typography>{subject}</Typography>
      <QuestionCard index={currentQuestionIndex} question={Questions[currentQuestionIndex]} 
      timeRemaining={timeRemaining} onAnswerSelected={handleAnswerSelected} />
      <Button  
      type="submit" onClick={handleSubmit} variant="contained"
 sx={{ textAlign: 'center', fontWeight: 500,display: 'flex', justifyContent: 'center', alignItems: 'center',
 marginLeft:'700px',
 marginTop: '20px', backgroundColor: '#2c3333', color: 'white', padding: '10px',
 borderRadius: '5px', boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)'}}>
Submit
</Button>
    </>
  )}
  else{ return(
    <>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', 
  alignItems: 'center', width: '50%' }}>
    <TextField id="outlined-basic" required
    label="please enter your email to get Started" variant="outlined"  
    onChange={handleEmail}
    style={{ marginBottom: '20px', width: '100%' }} />
    <Button variant="subtitle1" type="submit" style={{ width: '50%', backgroundColor: '#2c3333', color: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)', }}>
      Start Quiz
    </Button>
  </form>
</div>
    </>

  )}
}

const QuestionCard = ({index, question, onAnswerSelected, timeRemaining }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
     width: '40%', margin: '40px auto', padding: '20px', borderRadius: '10px', 
     boxShadow: '0px 3px 20px rgba(0, 0, 0, 0.2)',color:"white",backgroundColor:"#2c3333"}}>
      <Typography variant="h4" sx={{ fontWeight: 500, marginBottom: '20px', textAlign: 'center',
      wordWrap:"break-word" }}>
        {index+1}.{question.text}
        </Typography>
      <List sx={{ display: 'flex', flexDirection: 'column', width: '100%', paddingLeft: 0, listStyleType: 'none', 
      textAlign: 'center' }}>
        {question.options.map((option, index) => (
          <ListItem key={index} sx={{ marginBottom: '10px' }}>
            <Button variant="contained" onClick={() => onAnswerSelected(option)} 
            sx={{ width: '100%', padding: '10px',textTransform:'none' }}>{option}</Button>
          </ListItem>
        ))}
      </List>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', 
    marginTop: '20px', backgroundColor: 'green', color: '#fff', padding: '10px',
     borderRadius: '5px', boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)' }}>
  <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 500 }}>
    Time left: {timeRemaining} seconds
  </Typography>
</Box>
</Box>
  );
}




export default StudentQuizPreview 


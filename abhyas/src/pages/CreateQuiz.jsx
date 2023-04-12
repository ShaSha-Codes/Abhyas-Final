import React, { useState } from "react";
import produce from "immer";
import { TextField, Button, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default CreateQuiz;


import {
  collection,
  getDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../firebase";
import { nanoid } from "nanoid";

function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", correctAnswer: "", options: [], weightage: 0,timer:0 },
  ]);
  const [subject, setSubject] = useState("");
  const { classCode } = useParams();

  const user = useSelector((state) => state.user.value);
 
  const handleTimer = (e,index) => {
    setQuestions(
      produce((draft) => {
        draft[index].timer = e.target.value;
      })
    );
  };
  

  const handleAddOption = (questionIndex) => {
    setQuestions(
      produce((draft) => {
        draft[questionIndex].options.push("");
      })
    );
  };

  const handleOptionTextChange = (event, questionIndex, optionIndex) => {
    setQuestions(
      produce((draft) => {
        draft[questionIndex].options[optionIndex] = event.target.value;
      })
    );
  };

  const handleQuizTitleChange = (event) => {
    setQuizTitle(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleQuestionTextChange = (event, index) => {
    setQuestions(
      produce((draft) => {
        draft[index].text = event.target.value;
      })
    );
  };

  const correctAnswer = (event, index) => {
    setQuestions(
      produce((draft) => {
        draft[index].correctAnswer = event.target.value;
      })
    );
  };

  const handleMarksChange = (event, index) => {
    setQuestions(
      produce((draft) => {
        draft[index].weightage = event.target.value;
      })
    );
  };

  const handleAddQuestion = () => {
    setQuestions(
      produce((draft) => {
        draft.push({
          text: "",
          options: [],
          weightage:0,
          timer:0
        });
      })
    );
  };

  //nanoId

  //remove question and options from the quiz
  const removeQuestion = (questionIndex) => {
    setQuestions(
      produce((draft) => {
        draft.splice(questionIndex, 1);
      })
    );
  };
  const removeOption = (questionIndex, optionIndex) => {
    setQuestions(
      produce((draft) => {
        draft[questionIndex].options.splice(optionIndex, 1);
      })
    );
  };
  
  const handleSubmit = async () => {
    let quizCode = nanoid(6);
    const docRef1 = doc(db, "Quizzes", quizCode);
    var total=0;
    questions.map((question) => {
        total += parseInt(question.weightage);
    })
    console.log(total);
    console.log(classCode);
    console.log(user);
    await setDoc(docRef1, {
      students: [],
      totalMarks: total,
      classCode,
      title: quizTitle,
      subject: subject,
      Questions:questions,
      quizCode
    }); 
    
    //create Quiz collection

    //firebase code
  }
  
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
      <Grid
        container
        direction="column"
        spacing={4}
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          item
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            label="Topic"
            value={subject}
            onChange={handleSubjectChange}
            sx={{ marginRight: 8 }}
          />
          <TextField
            label="Subject"
            value={quizTitle}
            onChange={handleQuizTitleChange}
            sx={{ marginRight: 8 }}
          />
        </Grid>
        {questions.map((question, questionIndex) => (
          <Grid item key={questionIndex}>
            <Grid container direction="column" spacing={1}>
              <Grid
                item
                container
                direction="row"
                spacing={55}
                alignItems="center"
              >
                <Grid item>
                  <TextField
                    label={`Question ${questionIndex + 1}`}
                    value={question.text}
                    onChange={(event) =>
                      handleQuestionTextChange(event, questionIndex)
                    }
                    InputProps={{
                      style: {
                        backgroundColor: "#f2f2f2",
                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          backgroundColor: "#e6e6e6",
                        },
                        "&.Muifocused": {
                          backgroundColor: "#fff",
                          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.4)",
                        },
                      },
                    }}
                    multiline
                    variant="outlined"
                    style={{ width: "300%" }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    Button
                    variant="outlined"
                    sx={{
                      marginRight: 3.5,
                      color: "white",
                      marginTop: 2,
                      width: "0.5%",
                    }}
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <DeleteIcon color="primary" />
                  </Button>
                  <TextField
                    label="Correct Answer"
                    value={question.correctAnswer}
                    onChange={(event) => correctAnswer(event, questionIndex)}
                    multiline
                  />
                  <Select
                    value={question.timer}
                    label="Timer"
                    onChange={(event)=>handleTimer(event,questionIndex)}
                    sx={{ marginLeft: 5}}
                  >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                  </Select>
                  <TextField
                    label="weightage"
                    type="number"
                    sx={{ marginLeft: 5 }}
                    value={question.weightage}
                    onChange={(event) =>
                      handleMarksChange(event, questionIndex)
                    }
                  />
                </Grid>
              </Grid>
              {question.options.map((option, optionIndex) => (
                <Grid item key={optionIndex}>
                  <TextField
                    label={`Option ${optionIndex + 1}`}
                    value={option}
                    style={{ width: "25%" }}
                    onChange={(event) =>
                      handleOptionTextChange(event, questionIndex, optionIndex)
                    }
                  />
                  <Button
                    Button
                    variant="outlined"
                    sx={{
                      marginLeft: 2,
                      color: "white",
                      marginTop: 2,
                      width: "0.5%",
                    }}
                    onClick={() => removeOption(questionIndex, optionIndex)}
                  >
                    <DeleteIcon color="primary" />
                  </Button>
                </Grid>
              ))}
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => handleAddOption(questionIndex)}
                >
                  Add Option
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ))}
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleAddQuestion}
            style={{ backgroundColor: "#282828", color: "white" }}
          >
            Add Question
          </Button>
        </Grid>
        <Grid item justifyContent="Center">
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save quiz
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}



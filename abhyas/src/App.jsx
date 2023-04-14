import React from 'react'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import CompleteProfile from './pages/CompleteProfile'
import Classroom from './pages/Classroom'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'
import TutorFinder from './pages/TutorFinder'
import Certificate from './pages/Certificate'
import Teacher from './pages/Teacher'
import Student from './pages/Student'
import Note from './pages/Note'
import PageNotFound from './pages/PageNotFound'
import Lecture from './pages/Lecture'
import GoLive from './pages/GoLive'
import JoinLive from './pages/JoinLive'
import Tutor from './pages/Tutor'
import VerifyCertificate from './pages/VerifyCertificate'
import QuizPreview from './pages/QuizPreview'
import CreateQuiz from './pages/CreateQuiz'
import { Routes,Route } from 'react-router-dom'
import MarketplaceNotes from './pages/MarketplaceNotes'
import Assignment from './pages/Assignment'

const App = () => {
  return (
    <Routes>
        <Route path='/'element={<Landing/>} />
        <Route path='/SignUp'element={<SignUp/>} />
        <Route path='/CompleteProfile'element={<CompleteProfile/>} />
        <Route path='/Classroom'element={<Classroom/>} />
        <Route path='/Marketplace'element={<Marketplace/>} />
        <Route path='/Profile'element={<Profile/>} />
        <Route path='/TutorFinder'element={<TutorFinder/>} />
        <Route path='/Certificate'element={<Certificate/>} />
        <Route path='/Teacher/:classCode'element={<Teacher/>} />
        <Route path='/Student/:classCode'element={<Student/>} />
        <Route path='/Note/:noteCode'element={<Note/>} />
        <Route path='Quiz/:quizCode'element={<QuizPreview/>} />
        <Route path="Teacher/CreateQuiz/Create/:classCode" element={<CreateQuiz/>} />
        <Route path='/Lecture/:lecCode'element={<Lecture/>} />
        <Route path='/Teacher/Live/Create/:classCode' element={<GoLive/>} />
        <Route path='/Student/Live/Join/:classCode' element={<JoinLive/>} />
        <Route path='/Tutor/:tutorCode' element={<Tutor/>} />
        <Route path='/VerifyCertificate/:certificateCredential' element={<VerifyCertificate/>} />
        <Route path='/Marketplace/:id' element={<MarketplaceNotes/>} />
        <Route path='/Assignment/:id' element={<Assignment/>} />
        <Route path='/*' element={<PageNotFound/>} />
    </Routes>
  )
}

export default App

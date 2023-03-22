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
import { Routes,Route } from 'react-router-dom'

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
    </Routes>
  )
}

export default App

import React from 'react'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import CompleteProfile from './pages/CompleteProfile'
import { Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
        <Route path='/'element={<Landing/>} />
        <Route path='/SignUp'element={<SignUp/>} />
        <Route path='/CompleteProfile'element={<CompleteProfile/>} />
    </Routes>
  )
}

export default App

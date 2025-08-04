import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from '../components/Dashboard'
import Login from '../components/login'
import SignUpPage from '../components/Sign'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App

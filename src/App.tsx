import './App.css'
// import { UserProvider } from './Context'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import ModeSelect from './pages/Menus/modeselect'
import Auth from './pages/Authentication/login'
import Verify from './pages/verify'
import OnePlayer from './pages/Modes/1Player'
import Vnum from './components/vnum'
import CustomGame from './pages/Menus/customGame'
import Dashboard from './components/profileBar'
import Room from './pages/Menus/room'
import Profile from './pages/profile'
import { useEffect } from 'react'

const App = () => {
  const loggedIN = localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token')
  const sendDashboard = () => {
    if (loggedIN !== null && (JSON.parse(loggedIN).access_token !== undefined || JSON.parse(loggedIN).access_token !== null)) {
      return <Dashboard />
    }
  }

  useEffect(() => {
    sendDashboard()
  }, [loggedIN])

  return (
    // <UserProvider>
    <>
      <Vnum />
      {sendDashboard()}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mode" element={<ModeSelect />} />
        <Route path="/verify" element={<Verify />} />
        
        <Route path="/auth" element={<Auth />} />
        <Route path="/spGame" element={<OnePlayer />} />

        <Route path="/customroom" element={<CustomGame />} />
        <Route path="/customroom/Room/:id" element={<Room />} />
        {/* <Route path="/mpGame" element={<MultiPlayer />} /> */}

        <Route path="/spGame" element={<OnePlayer />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
    // </UserProvider>
  )
}

export default App

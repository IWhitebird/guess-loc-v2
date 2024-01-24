import './App.css'
// import { UserProvider } from './Context'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Landing from './pages/landing'
import ModeSelect from './pages/Menus/modeselect'
import Auth from './pages/Authentication/login'
import Verify from './pages/verify'
import OnePlayer from './pages/Modes/1Player'
import Vnum from './components/vnum'
// import CustomGame from './pages/Menus/customGame'
import Dashboard from './components/profileBar'
// import Room from './pages/Menus/room'
import Profile from './pages/profile'
import { useEffect, useState } from 'react'
import FriendsList from './components/Friends/FriendsList'
import FriendProfilepage from './pages/friendProfilepage'
import Notification from './components/notification'
import AudioPlayer from './components/AudioPlayer'

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const loggedIN = localStorage.getItem('sb-pdnogztwriouxeskllgm-auth-token')
  const [friendModal, setFriendModal] = useState(false)
  const [handleState, setHandleState] = useState('list')
  const [audioSettings, setAudioSettings] = useState(false)
  const [notifModal, setNotifModal] = useState(false)
  const [receivedNotif, setReceivedNotif] = useState(false)

  const sendDashboard = () => {
    if (loggedIN !== null && (JSON.parse(loggedIN).access_token !== undefined || JSON.parse(loggedIN).access_token !== null)) {
      return (
        <div className='absolute w-full'>
          <Dashboard setFriendModal={setFriendModal} visible={friendModal} audioSettings={audioSettings} setAudioSettings={setAudioSettings} setNotifModal={setNotifModal}
            receivedNotif={receivedNotif} setReceivedNotif={setReceivedNotif} />
          <Notification handleState={handleState} setHandleState={setHandleState} friendModal={friendModal}
            setFriendModal={setFriendModal} visible={notifModal} setVisible={setNotifModal} receivedNotif={receivedNotif} setReceivedNotif={setReceivedNotif} />
          <AudioPlayer audioSettings={audioSettings} setAudioSettings={setAudioSettings} />
        </div>
      )
    }
  }

  useEffect(() => {
    sendDashboard()
    if (!loggedIN && location.pathname !== '/auth' && location.pathname !== '/') {
      navigate('/auth')
    }
  }, [loggedIN])

  return (
    // <UserProvider>
    <>
      <Vnum />
      {sendDashboard()}
      <FriendsList visible={friendModal} setVisible={setFriendModal} handleState={handleState} setHandleState={setHandleState} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mode" element={<ModeSelect setFriendModal={setFriendModal} audioSettings={audioSettings} setAudioSettings={setAudioSettings} />} />
        <Route path="/verify" element={<Verify />} />

        <Route path="/auth" element={<Auth />} />
        <Route path="/spGame" element={<OnePlayer />} />
{/* 
        <Route path="/customroom" element={<CustomGame />} />
        <Route path="/customroom/Room/:id" element={<Room />} /> */}
        {/* <Route path="/mpGame" element={<MultiPlayer />} /> */}
        <Route path="/profile/:id" element={<FriendProfilepage />} />
        <Route path="/spGame" element={<OnePlayer />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/profile/:id" element={<Profile />} />   //for other users profile */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
    // </UserProvider>
  )
}

export default App

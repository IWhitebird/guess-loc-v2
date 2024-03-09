import './App.css'
// import { UserProvider } from './Context'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import ModeSelect from './pages/Menus/modeselect'
import Auth from './pages/Authentication/login'
import Verify from './pages/verify'
import OnePlayer from './pages/Modes/SinglePlayer'
import Vnum from './components/vnum'
import CustomGame from './pages/Menus/customGame'
import Room from './pages/Menus/room'
import Profile from './pages/profile'
import { useState } from 'react'
import FriendProfilepage from './pages/friendProfilepage'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store/store'
import MultiPlayer from './pages/Modes/MultiPlayer'
import  SendDashboard  from './components/sendDashboard'

const App = () => {
  const loggedIN = useSelector((state: RootState) => state.user)
  const [friendModal, setFriendModal] = useState(false)
  const [audioSettings, setAudioSettings] = useState(false)

  return (
    <>
      <Vnum />
      {
        loggedIN.user_id !== '' &&

        <SendDashboard loggedIN={loggedIN} friendModal={friendModal} audioSettings={audioSettings} setFriendModal={setFriendModal} setAudioSettings={setAudioSettings} />
      }
      <Routes>
        <Route path="/" element={<Landing />} />

        {loggedIN.user_id !== ''  &&
          <>
            <Route path="/mode" element={<ModeSelect setFriendModal={setFriendModal} audioSettings={audioSettings} setAudioSettings={setAudioSettings} />} />
            <Route path="/spGame" element={<OnePlayer />} />
            <Route path="/customroom" element={<CustomGame />} />
            <Route path="/customroom/Room/:id" element={<Room />} />
            <Route path="/mpGame/:id" element={<MultiPlayer />} />
            <Route path="/profile/:id" element={<FriendProfilepage />} />
            <Route path="/spGame" element={<OnePlayer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} /> 
          </>
        }
        <Route path="/verify" element={<Verify />} />
        <Route path="/auth" element={<Auth />} />


        <Route path="*" element={<Landing />} />
      </Routes>
    </>
    // </UserProvider>
  )
}

export default App

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
import { useEffect, useState } from 'react'
import FriendsList from './components/Friends/FriendsList'
import FriendProfilepage from './pages/friendProfilepage'
import Notification from './components/notification'
import AudioPlayer from './components/AudioPlayer'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store/store'

const App = () => {
  const loggedIN = useSelector((state: RootState) => state.user)
  const [friendModal, setFriendModal] = useState(false)
  const [handleState, setHandleState] = useState('list')
  const [audioSettings, setAudioSettings] = useState(false)
  const [notifModal, setNotifModal] = useState(false)
  const [receivedNotif, setReceivedNotif] = useState(false)

  const sendDashboard = () => {
    if (loggedIN.user_id !== '' && loggedIN.user_id !== undefined) {
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
    // console.log(loggedIN)
    sendDashboard()
    // if (loggedIN.user_id === '' || loggedIN.user_id === undefined) {
    //   navigate('/auth')
    // }
  }, [loggedIN])

  return (
    // <UserProvider>
    <>
      <Vnum />
      {sendDashboard()}
      <FriendsList visible={friendModal} setVisible={setFriendModal} handleState={handleState} setHandleState={setHandleState} />
      <Routes>
        <Route path="/" element={<Landing />} />

        {loggedIN.user_id !== ''  &&
          <>
            <Route path="/mode" element={<ModeSelect setFriendModal={setFriendModal} audioSettings={audioSettings} setAudioSettings={setAudioSettings} />} />
            <Route path="/spGame" element={<OnePlayer />} />
            <Route path="/customroom" element={<CustomGame />} />
            <Route path="/customroom/Room/:id" element={<Room />} />
            {/* <Route path="/mpGame" element={<MultiPlayer />} /> */}
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

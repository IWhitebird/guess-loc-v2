import './App.css'
// import { UserProvider } from './Context'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import ModeSelect from './pages/modeselect'
import Auth from './pages/Authentication/login'
import Verify from './pages/verify'
import OnePlayer from './pages/Modes/1Player'
import Vnum from './components/vnum'
import CustomGame from './pages/Modes/customGame'


const App = () => {

  return (
    // <UserProvider>
    <>
      <Vnum />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mode" element={<ModeSelect />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/customroom" element={<CustomGame />} />
        {/* <Route path="/customroom/:id" element={<CustomGameId />} /> */}
        <Route path="/verify" element={<Verify />} />
        {/* <Route path="/mpGame" element={<MultiPlayer />} /> */}
        <Route path="/spGame" element={<OnePlayer />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
    // </UserProvider>
  )
}

export default App

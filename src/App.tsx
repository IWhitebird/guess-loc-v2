import './App.css'
// import { UserProvider } from './Context'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import ModeSelect from './pages/modeselect'
import Auth from './pages/Authentication/login'
import Verify from './pages/verify'

const App = () => {

  return (
      // <UserProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/mode" element={<ModeSelect />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      // </UserProvider>
  )
}

export default App

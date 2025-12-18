import { Routes, Route } from 'react-router-dom'
import UserTypeSelection from './pages/UserTypeSelection'
import Login from './pages/Login'
import Dashboard from './pages/dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserTypeSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  )
}

export default App

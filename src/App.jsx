import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ExpenseList from './components/ExpenseList'
import Budget from './components/Budget'
import Reports from './components/Reports'

function App() {
  const [theme, setTheme] = useState('light')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`min-h-screen ${theme}`}>
      {isAuthenticated && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/expenses"
          element={isAuthenticated ? <ExpenseList /> : <Navigate to="/login" />}
        />
        <Route
          path="/budget"
          element={isAuthenticated ? <Budget /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  )
}

export default App
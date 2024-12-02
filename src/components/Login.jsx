import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser, FaLock } from 'react-icons/fa'
import axios from 'axios'

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('http://localhost:3001/users')
      const user = response.data.find(
        u => u.username === credentials.username && u.password === credentials.password
      )
      
      if (user) {
        setIsAuthenticated(true)
        toast.success('Login successful!')
        navigate('/')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Expense Tracker</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Demo credentials: username: demo, password: demo123
        </p>
      </div>
    </div>
  )
}

export default Login
import { Link, useNavigate } from 'react-router-dom'
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa'

function Navbar({ theme, toggleTheme }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              ExpenseTracker
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link
                to="/"
                className={`${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className={`${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Expenses
              </Link>
              <Link
                to="/budget"
                className={`${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Budget
              </Link>
              <Link
                to="/reports"
                className={`${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Reports
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              } hover:text-blue-600`}
            >
              {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <FaSignOutAlt size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
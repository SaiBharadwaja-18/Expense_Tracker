import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { FaWallet, FaChartBar, FaExclamationTriangle, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
)

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets] = useState({})
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState({})
  const [previousMonthExpenses, setPreviousMonthExpenses] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categoryTrend, setCategoryTrend] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, budgetsRes] = await Promise.all([
          axios.get('http://localhost:3001/expenses'),
          axios.get('http://localhost:3001/budgets')
        ])
        setExpenses(expensesRes.data)
        setBudgets(budgetsRes.data)
        
        const total = expensesRes.data.reduce((acc, curr) => acc + curr.amount, 0)
        setTotalExpenses(total)
        
        // Calculate monthly expenses
        const monthly = expensesRes.data.reduce((acc, expense) => {
          const category = expense.category
          if (!acc[category]) acc[category] = 0
          acc[category] += expense.amount
          return acc
        }, {})
        setMonthlyExpenses(monthly)

        // Calculate previous month expenses (mock data for demonstration)
        setPreviousMonthExpenses(total * 0.8)

        // Generate trend data for categories
        generateCategoryTrend(expensesRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const generateCategoryTrend = (expenseData) => {
    const trend = expenseData.reduce((acc, expense) => {
      const date = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!acc[date]) {
        acc[date] = { date, amount: 0 }
      }
      if (selectedCategory === 'All' || expense.category === selectedCategory) {
        acc[date].amount += expense.amount
      }
      return acc
    }, {})

    setCategoryTrend(Object.values(trend).sort((a, b) => new Date(a.date) - new Date(b.date)))
  }

  useEffect(() => {
    generateCategoryTrend(expenses)
  }, [selectedCategory, expenses])

  const barChartData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [
      {
        label: 'Monthly Expenses (₹)',
        data: Object.values(monthlyExpenses),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(199, 199, 199)'
        ],
        borderWidth: 1
      }
    ]
  }

  const trendData = {
    labels: categoryTrend.map(item => item.date),
    datasets: [
      {
        label: `${selectedCategory} Expenses Trend`,
        data: categoryTrend.map(item => item.amount),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }
    ]
  }

  const doughnutData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [{
      data: Object.values(monthlyExpenses),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)'
      ],
      borderWidth: 1
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthly Expenses by Category',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`
        }
      }
    }
  }

  const trendOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: `${selectedCategory} Expense Trend`,
        font: {
          size: 16
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: 'Expense Distribution',
        font: {
          size: 16
        }
      }
    }
  }

  const getBudgetStatus = (category) => {
    const spent = monthlyExpenses[category] || 0
    const budget = budgets[category] || 0
    const percentage = (spent / budget) * 100

    if (percentage >= 90) {
      return { status: 'danger', message: 'Critical! Budget exceeded' }
    } else if (percentage >= 75) {
      return { status: 'warning', message: 'Warning! Approaching budget limit' }
    }
    return { status: 'safe', message: 'Within budget' }
  }

  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0) || 1
  const expenseChange = previousMonthExpenses ? ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 : 0
  const budgetUtilization = Math.round((totalExpenses / totalBudget) * 100)
  const averageTransaction = expenses.length ? (totalExpenses / expenses.length) : 0
  const highestExpenseCategory = Object.entries(monthlyExpenses).length ? 
    Object.entries(monthlyExpenses).reduce((a, b) => a[1] > b[1] ? a : b, ['None', 0])[0] : 
    'None'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold">₹{totalExpenses.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm">
                {expenseChange > 0 ? (
                  <>
                    <FaArrowUp className="mr-1" />
                    <span className="text-red-200">+{expenseChange.toFixed(1)}% from last month</span>
                  </>
                ) : (
                  <>
                    <FaArrowDown className="mr-1" />
                    <span className="text-green-200">{expenseChange.toFixed(1)}% from last month</span>
                  </>
                )}
              </div>
            </div>
            <FaWallet className="text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Budget</h3>
              <p className="text-3xl font-bold">₹{totalBudget.toLocaleString()}</p>
              <p className="text-sm mt-2">Monthly allocation</p>
            </div>
            <FaChartBar className="text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Transactions</h3>
              <p className="text-3xl font-bold">{expenses.length}</p>
              <p className="text-sm mt-2">This month</p>
            </div>
            <FaWallet className="text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Budget Status</h3>
              <p className="text-3xl font-bold">{budgetUtilization}%</p>
              <p className="text-sm mt-2">Of total budget used</p>
            </div>
            <FaChartBar className="text-4xl opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="h-[400px]">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Budget Warnings</h3>
          <div className="space-y-4">
            {Object.entries(budgets).map(([category, budget]) => {
              const { status, message } = getBudgetStatus(category)
              const spent = monthlyExpenses[category] || 0
              const percentage = Math.min((spent / budget) * 100, 100)

              return (
                <div key={category} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{category}</span>
                    <div className="flex items-center">
                      {status !== 'safe' && (
                        <FaExclamationTriangle 
                          className={`mr-2 ${
                            status === 'danger' ? 'text-red-500' : 'text-yellow-500'
                          }`}
                        />
                      )}
                      <span className={`text-sm ${
                        status === 'danger' ? 'text-red-500' : 
                        status === 'warning' ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        {message}
                      </span>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-gray-600">
                          ₹{spent.toLocaleString()} / ₹{budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-600">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          status === 'danger' ? 'bg-red-500' :
                          status === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Category for Trend Analysis</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {Object.keys(budgets).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="h-[300px]">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="h-[350px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="block text-sm text-gray-600 dark:text-gray-400">Highest Expense Category</span>
            <span className="text-lg font-semibold">{highestExpenseCategory}</span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="block text-sm text-gray-600 dark:text-gray-400">Average Transaction</span>
            <span className="text-lg font-semibold">₹{averageTransaction.toLocaleString()}</span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="block text-sm text-gray-600 dark:text-gray-400">Budget Utilization</span>
            <span className="text-lg font-semibold">{budgetUtilization}%</span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="block text-sm text-gray-600 dark:text-gray-400">Categories Over Budget</span>
            <span className="text-lg font-semibold">
              {Object.entries(budgets).filter(([category]) => 
                (monthlyExpenses[category] || 0) > budgets[category]
              ).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
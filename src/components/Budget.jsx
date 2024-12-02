import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

function Budget() {
  const [budgets, setBudgets] = useState({})
  const [expenses, setExpenses] = useState([])
  const [editingCategory, setEditingCategory] = useState('')
  const [newBudget, setNewBudget] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        axios.get('http://localhost:3001/budgets'),
        axios.get('http://localhost:3001/expenses')
      ])
      setBudgets(budgetsRes.data)
      setExpenses(expensesRes.data)
    } catch (error) {
      toast.error('Error fetching data')
    }
  }

  const handleUpdateBudget = async () => {
    try {
      const updatedBudgets = { ...budgets, [editingCategory]: Number(newBudget) }
      await axios.put('http://localhost:3001/budgets', updatedBudgets)
      setBudgets(updatedBudgets)
      setEditingCategory('')
      setNewBudget('')
      toast.success('Budget updated successfully')
    } catch (error) {
      toast.error('Error updating budget')
    }
  }

  const calculateExpensesByCategory = () => {
    return Object.keys(budgets).reduce((acc, category) => {
      acc[category] = expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0)
      return acc
    }, {})
  }

  const expensesByCategory = calculateExpensesByCategory()

  const chartData = {
    labels: Object.keys(budgets),
    datasets: [
      {
        data: Object.values(budgets),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384'
        ]
      }
    ]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Budget Allocation</h2>
          <div className="w-full max-w-md mx-auto">
            <Doughnut data={chartData} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Budget vs Expenses</h2>
          <div className="space-y-4">
            {Object.entries(budgets).map(([category, budget]) => (
              <div key={category} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{category}</span>
                  {editingCategory === category ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={handleUpdateBudget}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCategory('')}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>₹{budget.toLocaleString()}</span>
                      <button
                        onClick={() => {
                          setEditingCategory(category)
                          setNewBudget(budget.toString())
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        Spent: ₹{expensesByCategory[category].toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {Math.round((expensesByCategory[category] / budget) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${Math.min((expensesByCategory[category] / budget) * 100, 100)}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        expensesByCategory[category] > budget ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Budget
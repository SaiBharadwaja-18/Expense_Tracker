import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa'

function ExpenseList() {
  const [expenses, setExpenses] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/expenses')
      setExpenses(response.data)
    } catch (error) {
      toast.error('Error fetching expenses')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingExpense) {
        await axios.put(`http://localhost:3001/expenses/${editingExpense.id}`, formData)
        toast.success('Expense updated successfully')
      } else {
        await axios.post('http://localhost:3001/expenses', formData)
        toast.success('Expense added successfully')
      }
      setShowForm(false)
      setEditingExpense(null)
      setFormData({ title: '', amount: '', category: '', date: '' })
      fetchExpenses()
    } catch (error) {
      toast.error('Error saving expense')
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormData(expense)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/expenses/${id}`)
      toast.success('Expense deleted successfully')
      fetchExpenses()
    } catch (error) {
      toast.error('Error deleting expense')
    }
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(search.toLowerCase()) ||
    expense.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Expense</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingExpense ? 'Update' : 'Add'} Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingExpense(null)
                  setFormData({ title: '', amount: '', category: '', date: '' })
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-6 py-4 whitespace-nowrap">{expense.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{expense.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExpenseList
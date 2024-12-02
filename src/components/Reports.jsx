import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import Papa from 'papaparse'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function Reports() {
  const [expenses, setExpenses] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/expenses')
      setExpenses(response.data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    if (!startDate || !endDate) return true
    const expenseDate = new Date(expense.date)
    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
  })

  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        label: 'Expenses by Category (₹)',
        data: Object.values(expensesByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('Expense Report', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Report Period: ${startDate || 'All time'} to ${endDate || 'All time'}`, 20, 30)
    
    let yPos = 50
    doc.setFontSize(14)
    doc.text('Expenses by Category:', 20, yPos)
    
    yPos += 10
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      yPos += 10
      doc.setFontSize(12)
      doc.text(`${category}: ₹${amount.toLocaleString()}`, 30, yPos)
    })
    
    yPos += 20
    doc.setFontSize(14)
    doc.text(`Total Expenses: ₹${Object.values(expensesByCategory).reduce((a, b) => a + b, 0).toLocaleString()}`, 20, yPos)
    
    doc.save('expense-report.pdf')
  }

  const downloadCSV = () => {
    const data = filteredExpenses.map(expense => ({
      Title: expense.title,
      Amount: `₹${expense.amount}`,
      Category: expense.category,
      Date: new Date(expense.date).toLocaleDateString()
    }))
    
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'expense-report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="px-4 py-2 border rounded-lg"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="px-4 py-2 border rounded-lg"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={downloadPDF}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <FaFilePdf />
              <span>Download PDF</span>
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FaFileExcel />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <Bar data={chartData} options={options} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <tr key={category}>
                  <td className="px-6 py-4 whitespace-nowrap">{category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Math.round((amount / Object.values(expensesByCategory).reduce((a, b) => a + b, 0)) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports
# Expense Tracker

A comprehensive web application for managing personal expenses with features like expense tracking, budgeting, and detailed analytics.


## Features

- **User Authentication**
  - Secure login system
  - Demo account available for testing

- **Expense Management**
  - Add, edit, and delete expenses
  - Categorize expenses
  - Search and filter functionality
  - Real-time updates

- **Budget Control**
  - Set monthly budgets by category
  - Visual budget warnings
  - Progress tracking
  - Budget utilization metrics

- **Analytics & Reports**
  - Interactive charts and graphs
  - Expense distribution visualization
  - Category-wise analysis
  - Trend analysis
  - Export reports in PDF and CSV formats

- **Dashboard**
  - Overview of total expenses
  - Monthly comparisons
  - Budget status
  - Quick statistics

- **User Interface**
  - Modern and responsive design
  - Dark/Light theme toggle
  - Intuitive navigation
  - Real-time updates

## Technology Stack

- **Frontend**
  - React.js
  - Chart.js for data visualization
  - Tailwind CSS for styling
  - React Router for navigation
  - React Icons for UI elements

- **Backend**
  - JSON Server for data storage
  - Axios for API calls

- **Additional Libraries**
  - jsPDF for PDF generation
  - Papa Parse for CSV handling
  - React Toastify for notifications

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start both the Vite development server and JSON Server concurrently.

3. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - JSON Server: [http://localhost:3001](http://localhost:3001)

## Demo Credentials

- Username: demo
- Password: demo123

## Project Structure

```
expense-tracker/
├── src/
│   ├── components/
│   │   ├── Budget.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   └── Reports.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── db.json
├── package.json
└── README.md
```

## Features in Detail

### Expense Management
- Add new expenses with title, amount, category, and date
- Edit existing expenses
- Delete expenses
- Search expenses by title or category
- Filter expenses by date range

### Budgeting
- Set monthly budgets for different categories
- Visual indicators for budget status
- Warnings when approaching or exceeding budget limits
- Budget vs actual expense comparison

### Reports
- Generate detailed expense reports
- Export data in PDF format
- Download expense data as CSV
- Visual representations of expense patterns

### Dashboard Analytics
- Total expense overview
- Category-wise expense distribution
- Monthly expense trends
- Budget utilization metrics
- Quick statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- React.js team for the amazing framework
- Chart.js for beautiful visualizations
- Tailwind CSS for the styling system
- All other open-source libraries used in this project

## Support

For support, email saibharadwaja18@gmail.com or open an issue in the repository.
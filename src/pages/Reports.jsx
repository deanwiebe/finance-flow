import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Reports() {
  const [overallData, setOverallData] = useState(null);
  const [incomeSourcesData, setIncomeSourcesData] = useState(null);
  const [expenseSourcesData, setExpenseSourcesData] = useState(null); // NEW for expense pie

  // Dates for filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Format date to YYYY-MM-DD for inputs and requests
  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
  };

  // On mount, set default date range (last 3 months)
  useEffect(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    setStartDate(formatDate(threeMonthsAgo));
    setEndDate(formatDate(now));
  }, []);

  // Fetch overall income vs expense, refetch when dates change
  useEffect(() => {
    if (!startDate || !endDate) return;

    const url = new URL('/wp-json/finance-flow/v1/user-data', window.location.origin);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);

    fetch(url, {
      headers: {
        'X-WP-Nonce': financeFlowData.nonce
      }
    })
      .then(res => res.json())
      .then(data => {
        // Defensive check if data is array
        if (!Array.isArray(data)) {
          setOverallData(null);
          setExpenseSourcesData(null);
          return;
        }

        // Overall income and expense totals
        const totalIncome = data.reduce((sum, row) => sum + parseFloat(row.income || 0), 0);
        const totalExpense = data.reduce((sum, row) => sum + parseFloat(row.expense || 0), 0);

        setOverallData({
          labels: ['Income', 'Expense'],
          datasets: [
            {
              label: 'Amount',
              data: [totalIncome, totalExpense],
              backgroundColor: ['#4ade80', '#f87171'],
              borderColor: ['#22c55e', '#ef4444'],
              borderWidth: 1
            }
          ]
        });

        // Aggregate expenses by description for expense pie chart
        const expenseMap = {};
        data.forEach(row => {
          const expense = parseFloat(row.expense || 0);
          const desc = row.description || 'Unknown';
          if (expense > 0) {
            if (!expenseMap[desc]) {
              expenseMap[desc] = 0;
            }
            expenseMap[desc] += expense;
          }
        });

        const expenseLabels = Object.keys(expenseMap);
        const expenseData = Object.values(expenseMap);

        setExpenseSourcesData({
          labels: expenseLabels,
          datasets: [
            {
              label: 'Expenses',
              data: expenseData,
              backgroundColor: expenseLabels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`), // random pastel colors
              borderColor: '#ef4444',
              borderWidth: 1
            }
          ]
        });
      })
      .catch(() => {
        setOverallData(null);
        setExpenseSourcesData(null);
      });
  }, [startDate, endDate]);

  // Fetch income by source, refetch when dates change
  useEffect(() => {
    if (!startDate || !endDate) return;

    const url = new URL('/wp-json/finance-flow/v1/income-sources', window.location.origin);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);

    fetch(url, {
      headers: {
        'X-WP-Nonce': financeFlowData.nonce
      }
    })
      .then(res => res.json())
      .then(groupedData => {
        if (!groupedData || typeof groupedData !== 'object') {
          setIncomeSourcesData(null);
          return;
        }

        const incomeMap = {};

        Object.values(groupedData).forEach(monthEntries => {
          monthEntries.forEach(entry => {
            const { description, total_income } = entry;
            if (total_income > 0) {
              if (!incomeMap[description]) {
                incomeMap[description] = 0;
              }
              incomeMap[description] += total_income;
            }
          });
        });

        const labels = Object.keys(incomeMap);
        const data = Object.values(incomeMap);

        setIncomeSourcesData({
          labels,
          datasets: [
            {
              label: 'Total Income',
              data,
              backgroundColor: '#4ade80',
              borderColor: '#22c55e',
              borderWidth: 1
            }
          ]
        });
      })
      .catch(() => {
        setIncomeSourcesData(null);
      });
  }, [startDate, endDate]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <p className="text-gray-700 mb-6">
        View charts and reports based on your uploaded data.
      </p>

      {/* Date filters */}
      <div className="mb-8 flex gap-4 max-w-md mx-auto">
        <div>
          <label htmlFor="start-date" className="block mb-1 font-semibold">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            max={endDate || ''}
            onChange={e => setStartDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block mb-1 font-semibold">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate || ''}
            onChange={e => setEndDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Overall Income vs Expense */}
      {overallData ? (
        <div className="max-w-md mx-auto mb-12">
          <h2 className="text-xl font-semibold mb-4">Income vs Expense</h2>
          <Pie data={overallData} />
        </div>
      ) : (
        <p>Loading overall chart...</p>
      )}

      {/* Income by Source */}
      {incomeSourcesData ? (
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl font-semibold mb-4">Income by Source</h2>
          <Bar
            data={incomeSourcesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: context => `Income: $${context.raw.toFixed(2)}`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: value => `$${value}`
                  }
                }
              }
            }}
          />
        </div>
      ) : (
        <p>Loading income sources chart...</p>
      )}

      {/* Expense by Source (NEW Pie chart) */}
      {expenseSourcesData ? (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
          <Pie data={expenseSourcesData} />
        </div>
      ) : (
        <p>Loading expense chart...</p>
      )}
    </div>
  );
}

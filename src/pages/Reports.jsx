import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetch(`${financeFlowData.apiUrl}/report`, {
      headers: {
        'X-WP-Nonce': financeFlowData.nonce
      }
    })
      .then(res => res.json())
      .then(response => {
        setData(response.user_data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching report data:', error);
        setLoading(false);
      });
  }, []);

  const getLast6Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      months.push({ key, label });
    }
    return months;
  };

  const groupedBar = getLast6Months().map(({ key, label }) => {
    let income = 0;
    let expense = 0;
    data.forEach(item => {
      const dateKey = item.transaction_date?.slice(0, 7);
      if (dateKey === key) {
        income += parseFloat(item.income || 0);
        expense += parseFloat(item.expense || 0);
      }
    });
    return { label, income, expense };
  });

  const pieDataMap = {};
  data.forEach(item => {
    const month = item.transaction_date?.slice(0, 7);
    if (month === selectedMonth && parseFloat(item.expense) > 0) {
      const label = item.description || 'Other';
      if (!pieDataMap[label]) pieDataMap[label] = 0;
      pieDataMap[label] += parseFloat(item.expense);
    }
  });

  const incomeBySourceMap = {};
  data.forEach(item => {
    const month = item.transaction_date?.slice(0, 7);
    if (month === selectedMonth && parseFloat(item.income) > 0) {
      const label = item.description || 'Other';
      if (!incomeBySourceMap[label]) incomeBySourceMap[label] = 0;
      incomeBySourceMap[label] += parseFloat(item.income);
    }
  });

  const pieChart = {
    labels: Object.keys(pieDataMap),
    datasets: [
      {
        label: 'Expenses',
        data: Object.values(pieDataMap),
        backgroundColor: [
          '#EF4444', '#F97316', '#FACC15', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'
        ]
      }
    ]
  };

  const incomeChart = {
    labels: Object.keys(incomeBySourceMap),
    datasets: [
      {
        label: 'Income',
        data: Object.values(incomeBySourceMap),
        backgroundColor: [
          '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#FACC15', '#EF4444'
        ]
      }
    ]
  };

  const barChart = {
    labels: groupedBar.map(item => item.label),
    datasets: [
      {
        label: 'Income',
        data: groupedBar.map(item => item.income),
        backgroundColor: 'rgba(34, 197, 94, 0.7)'
      },
      {
        label: 'Expense',
        data: groupedBar.map(item => item.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.7)'
      }
    ]
  };

  const netBalanceData = [];
  let runningBalance = 0;
  const sortedData = [...data].sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));
  sortedData.forEach(item => {
    const date = item.transaction_date;
    const income = parseFloat(item.income || 0);
    const expense = parseFloat(item.expense || 0);
    runningBalance += income - expense;
    netBalanceData.push({ date, balance: runningBalance });
  });

  const netBalanceChart = {
    labels: netBalanceData.map(item => item.date),
    datasets: [
      {
        label: 'Net Balance',
        data: netBalanceData.map(item => item.balance),
        borderColor: 'rgba(59, 130, 246, 0.7)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const monthlyTotals = getLast6Months().map(({ key, label }) => {
    let income = 0;
    let expense = 0;
    data.forEach(item => {
      const dateKey = item.transaction_date?.slice(0, 7);
      if (dateKey === key) {
        income += parseFloat(item.income || 0);
        expense += parseFloat(item.expense || 0);
      }
    });
    return { label, income, expense };
  });

  const monthlyLineChart = {
    labels: monthlyTotals.map(item => item.label),
    datasets: [
      {
        label: 'Income',
        data: monthlyTotals.map(item => item.income),
        borderColor: 'rgba(34, 197, 94, 0.8)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Expense',
        data: monthlyTotals.map(item => item.expense),
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: context => `$${context.raw.toFixed(2)}`
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
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading report...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Income vs. Expense (Last 6 Months)</h2>
        <Bar data={barChart} options={chartOptions} />
      </div>

      {/* Net Balance Over Time */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Net Balance Over Time</h2>
        <Line data={netBalanceChart} options={chartOptions} />
      </div>

      {/* Monthly Income vs. Expense */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Income vs. Expense</h2>
        <Line data={monthlyLineChart} options={chartOptions} />
      </div>

      {/* Expenses by Category */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Expenses by Category</h2>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="mt-2 sm:mt-0 border border-gray-300 rounded px-3 py-1 text-sm"
          />
        </div>
        {pieChart.labels.length > 0 ? (
          <Pie data={pieChart} />
        ) : (
          <p className="text-sm text-gray-500">No expense data for selected month.</p>
        )}
      </div>

      {/* Income by Source */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Income by Source</h2>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="mt-2 sm:mt-0 border border-gray-300 rounded px-3 py-1 text-sm"
          />
        </div>
        {incomeChart.labels.length > 0 ? (
          <Pie data={incomeChart} />
        ) : (
          <p className="text-sm text-gray-500">No income data for selected month.</p>
        )}
      </div>
    </div>
  );
}

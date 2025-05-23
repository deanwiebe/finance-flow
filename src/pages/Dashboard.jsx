import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/wp-json/finance-flow/v1/report', {
      headers: {
        'X-WP-Nonce': financeFlowData.nonce,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (!Array.isArray(response.user_data)) {
          throw new Error('user_data is not an array');
        }
        setData(response.user_data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, []);

  // Total income and expenses
  const totalIncome = data.reduce((sum, item) => sum + parseFloat(item.income || 0), 0);
  const totalExpenses = data.reduce((sum, item) => sum + parseFloat(item.expense || 0), 0);
  const balance = totalIncome - totalExpenses;

  // Recent transactions
  const recentTransactions = [...data]
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
    .slice(0, 15);

  const hasUploaded = data.length > 0;

  // Group by upload date
  const groupedByUpload = {};
  data.forEach((item) => {
    const dateKey = new Date(item.uploaded_at).toISOString();
    if (!groupedByUpload[dateKey]) {
      groupedByUpload[dateKey] = [];
    }
    groupedByUpload[dateKey].push(item);
  });

  const sortedUploadDates = Object.keys(groupedByUpload).sort((a, b) => new Date(b) - new Date(a));

  const currentUpload = groupedByUpload[sortedUploadDates[0]] || [];
  const lastUpload = groupedByUpload[sortedUploadDates[1]] || [];

  const currentBalance = currentUpload.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0);
  const lastUploadBalance = lastUpload.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0);
  const balanceChange = currentBalance - lastUploadBalance;

  const lastUploadDate = sortedUploadDates[1]
    ? new Date(sortedUploadDates[1]).toLocaleDateString()
    : null;

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total Income</h2>
          <p className="text-green-600 text-xl font-bold">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
          <p className="text-red-500 text-xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">Net Income</h2>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Balance Overview</h2>
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            <strong>Today's Balance:</strong>{' '}
            <span className={currentBalance >= 0 ? 'text-green-600' : 'text-red-500'}>
              ${currentBalance.toFixed(2)}
            </span>
          </p>

          {lastUpload.length > 0 && (
            <>
              <p>
                <strong>Last Upload Balance ({lastUploadDate}):</strong>{' '}
                <span className={lastUploadBalance >= 0 ? 'text-green-600' : 'text-red-500'}>
                  ${lastUploadBalance.toFixed(2)}
                </span>
              </p>
              <p
                className={`font-semibold ${
                  balanceChange >= 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {balanceChange >= 0 ? '▲ Gained' : '▼ Lost'} ${Math.abs(balanceChange).toFixed(2)} since last upload
              </p>
            </>
          )}

          {lastUpload.length === 0 && (
            <p className="text-sm text-gray-500">No previous upload to compare.</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Recent Activity</h2>
        {recentTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-200 text-sm">
            {recentTransactions.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>{new Date(item.transaction_date).toLocaleDateString()}</span>
                <span>{item.description}</span>
                <span className={item.income > 0 ? 'text-green-600' : 'text-red-500'}>
                  ${item.income > 0 ? item.income : item.expense}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent transactions.</p>
        )}
      </div>

      {/* Data Status */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Data Status</h2>
        {hasUploaded ? (
          <p className="text-sm text-gray-600">
            ✅ CSV uploaded. Last upload: <strong>{new Date(sortedUploadDates[0]).toLocaleDateString()}</strong>
          </p>
        ) : (
          <p className="text-sm text-red-500">❌ No CSV data uploaded yet.</p>
        )}
      </div>

      {/* Call to Action */}
      {!hasUploaded && (
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Get started!</h3>
          <p className="text-sm text-gray-600 mb-4">Upload your first CSV to start tracking your finances.</p>
          <Link
            to="/upload"
            className="inline-block bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Upload CSV
          </Link>
        </div>
      )}
    </div>
  );
}

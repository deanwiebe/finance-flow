import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Reports() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('/wp-json/finance-flow/v1/user-data', {
      headers: {
        'X-WP-Nonce': financeFlowData.nonce
      }
    })
      .then(res => res.json())
      .then(data => {
        const totalIncome = data.reduce((sum, row) => sum + parseFloat(row.income), 0);
        const totalExpense = data.reduce((sum, row) => sum + parseFloat(row.expense), 0);

        setChartData({
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
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <p className="text-gray-700 mb-6">
        View charts and reports based on your uploaded data.
      </p>

      {chartData ? (
        <div className="max-w-md mx-auto">
          <Pie data={chartData} />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

function convertDateFormat(dateStr) {
  // Input: "MM/DD/YYYY", Output: "YYYY-MM-DD"
  const parts = dateStr.split('/');
  if(parts.length !== 3) return null;
  const [month, day, year] = parts;
  // Basic validation for numbers
  if (!month || !day || !year) return null;
  return `${year.trim()}-${month.trim().padStart(2, '0')}-${day.trim().padStart(2, '0')}`;
}

export default function Upload() {
  const [parsedData, setParsedData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: function(results) {
        const cleanedData = results.data.map(row => {
          return {
            date: convertDateFormat(row[0]?.trim()),
            description: row[1]?.trim(),
            expense: parseFloat(row[2]) || 0,
            income: parseFloat(row[3]) || 0,
            balance: parseFloat(row[4]) || 0,
          };
        });

        // Filter out any rows where date conversion failed
        const filteredData = cleanedData.filter(row => row.date !== null);

        setParsedData(filteredData);
        console.log('Parsed Data:', filteredData);

        let apiUrl = '';
        if (window.location.hostname === 'localhost') {
          apiUrl = 'http://finance-flow.local/wp-json/finance-flow/v1/upload';
        } else {
          apiUrl = `${window.location.origin}/wp-json/finance-flow/v1/upload`;
        }

        axios.post(apiUrl, filteredData, {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': financeFlowData.nonce,
          },
        })
        .then(response => {
          console.log('Upload Success:', response.data);
          setUploadStatus('✅ Upload successful!');
        })
        .catch(error => {
          console.error('Upload Error:', error);
          setUploadStatus('❌ Upload failed. Check console.');
        });
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload CSV</h2>

      <input type="file" accept=".csv" onChange={handleUpload} className="mb-4" />

      {uploadStatus && <p className="mb-4">{uploadStatus}</p>}

      {parsedData.length > 0 && (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Expense</th>
              <th className="border p-2">Income</th>
              <th className="border p-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {parsedData.map((row, index) => (
              <tr key={index}>
                <td className="border p-2">{row.date}</td>
                <td className="border p-2">{row.description}</td>
                <td className="border p-2">{row.expense.toFixed(2)}</td>
                <td className="border p-2">{row.income.toFixed(2)}</td>
                <td className="border p-2">{row.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

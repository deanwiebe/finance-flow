import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

function convertDateFormat(dateStr) {
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [month, day, year] = parts;
    return `${year.trim()}-${month.trim().padStart(2, '0')}-${day.trim().padStart(2, '0')}`;
  }
  return dateStr.trim();
}

export default function Upload() {
  const [parsedData, setParsedData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadStatus('⏳ Uploading...');
    let allData = [];
    let processedCount = 0;

    files.forEach((file, fileIndex) => {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;

          const cleanedData = data.map(row => {
            const dateRaw = row[0]?.trim();
            const desc = row[1]?.trim();
            const col2 = row[2]?.trim();
            const col3 = row[3]?.trim();
            const balance = parseFloat(row[4]) || 0;

            let expense = 0;
            let income = 0;

            if (col2 && !col3) {
              expense = parseFloat(col2) || 0;
            } else if (!col2 && col3) {
              income = parseFloat(col3) || 0;
            } else if (col2 && col3) {
              expense = parseFloat(col2) || 0;
              income = parseFloat(col3) || 0;
            }

            return {
              date: convertDateFormat(dateRaw),
              description: desc,
              expense,
              income,
              balance,
              source_file: file.name
            };
          });

          const filteredData = cleanedData.filter(row => row.date !== null);
          allData = [...allData, ...filteredData];

          let apiUrl = window.location.hostname === 'localhost'
            ? 'http://finance-flow.local/wp-json/finance-flow/v1/upload'
            : `${window.location.origin}/wp-json/finance-flow/v1/upload`;

          axios.post(apiUrl, filteredData, {
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': financeFlowData.nonce,
            },
          })
          .then(response => {
            console.log(`✅ ${file.name} upload success:`, response.data);
          })
          .catch(error => {
            console.error(`❌ ${file.name} upload error:`, error);
          })
          .finally(() => {
            processedCount++;
            if (processedCount === files.length) {
              setParsedData(allData);
              setUploadStatus(`✅ All ${files.length} file(s) uploaded.`);
            }
          });
        }
      });
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload CSV Files</h2>
      <input
        type="file"
        accept=".csv"
        multiple
        onChange={handleUpload}
        className="mb-4"
      />
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
              <th className="border p-2">File</th>
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
                <td className="border p-2">{row.source_file}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// src/pages/TermsOfUse.jsx
import React from 'react';

export default function TermsOfUse() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
      <p>
        Welcome to Finance Flow. By using this service, you agree to the following terms:
      </p>
      <ul className="list-disc list-inside my-4">
        <li>We store your financial data from uploaded CSV files in our secure database.</li>
        <li>Please do not upload CSV files containing account numbers or other sensitive information.</li>
        <li>Finance Flow is for educational and personal budgeting purposes only.</li>
        <li>We do not share your data with third parties without your consent.</li>
        <li>Use the service at your own discretion.</li>
      </ul>
      <p>
        For more details, please contact support.
      </p>
    </div>
  );
}

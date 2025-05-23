import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const username = window.financeFlowData?.username || 'User';

const handleLogout = async () => {
  try {
    let apiUrl =
      window.location.hostname === 'localhost'
        ? 'http://finance-flow.local/wp-json/finance-flow/v1/logout'
        : `${window.location.origin}/wp-json/finance-flow/v1/logout`;

    const response = await axios.post(
      apiUrl,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': financeFlowData.nonce,
        },
        withCredentials: true,
      }
    );

    console.log('Logout response:', response);

     if (response.status === 200) {
  window.location.href = '/';
    } else {
      // Defensive: Show entire data if message field is missing
      console.error('Logout failed:', response.data.message || response.data);
    }
  } catch (error) {
    console.error('Logout error:', error.response ? error.response.data : error.message);
  }
};


  const linkStyle = (path) =>
    `block px-4 py-2 rounded-md text-white hover:bg-green-700 ${
      location.pathname === path ? 'bg-green-700' : ''
    }`;

  return (
    <aside className="h-full w-64 bg-green-600 text-white flex flex-col p-6 shadow-lg md:rounded-none md:rounded-l-2xl relative">
      {/* Close button for mobile */}
      {onClose && (
        <button
          className="absolute top-4 right-4 text-white text-2xl md:hidden"
          onClick={onClose}
        >
          &times;
        </button>
      )}

      <div className="flex-1">
        <p className="mb-4">👋 Welcome, <strong>{username}</strong></p>
        <h2 className="text-2xl font-bold mb-8">Finance Flow</h2>
        <nav className="space-y-2">
          <Link to="/" className={linkStyle('/')}>
            Dashboard
          </Link>
          <Link to="/upload" className={linkStyle('/upload')}>
            Upload CSV
          </Link>
          <Link to="/reports" className={linkStyle('/reports')}>
            Reports
          </Link>
        </nav>
      </div>

      <div className="border-t border-white pt-4">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-md bg-green-500 hover:bg-green-700"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

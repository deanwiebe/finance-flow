import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const username = window.financeFlowData?.username || 'User';

  const handleLogout = async () => {
    await fetch('http://finance-flow.local/wp-json/finance-flow/v1/logout', {
      method: 'POST',
      credentials: 'include',
    });
    toast.success('Logged out successfully!');
    window.location.href = '/';
  };

  const linkStyle = (path) =>
    `block px-4 py-2 rounded-md text-white hover:bg-green-700 ${
      location.pathname === path ? 'bg-green-700' : ''
    }`;

  return (
    <aside className="h-full bg-green-600 text-white w-full md:w-full p-6 shadow-md rounded-l-2xl">
      {/* Mobile Close Button */}
      {onClose && (
        <button
          className="absolute top-4 right-4 text-white text-2xl md:hidden"
          onClick={onClose}
        >
          &times;
        </button>
      )}
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

      <div className="mt-10 border-t border-white pt-6">
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

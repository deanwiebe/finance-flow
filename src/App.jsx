import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Uploads from './pages/Upload';
import Reports from './pages/Reports';
import Login from './pages/Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(window.financeFlowData?.isLoggedIn === '1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-green-50 text-gray-800">
      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 transform z-40 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 text-white bg-green-700 hover:bg-green-800 p-3 rounded-md shadow-lg"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar menu"
      >
        ☰
      </button>

      {/* Main Content Panel */}
      <div className="flex-1 w-full p-6 sm:p-10 overflow-y-auto flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Uploads />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

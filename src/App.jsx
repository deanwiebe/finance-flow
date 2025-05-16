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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 py-8 ">
      <div className="flex flex-row w-full max-w-7xl bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-fade-in min-h-[700px]">
        {isLoggedIn && (
          <>
            {/* Mobile hamburger button */}
            <button
              className="md:hidden absolute top-4 left-4 z-50 text-white bg-green-700 hover:bg-green-800 p-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              ☰
            </button>

            {/* Sidebar */}
            <aside
              className={`fixed top-0 left-0 h-full w-64 bg-green-600 text-white shadow-lg transform
                md:relative md:translate-x-0 md:flex md:flex-col
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              <button
                className="md:hidden absolute top-4 right-4 text-white text-2xl font-bold focus:outline-none z-50"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar menu"
              >
                ×
              </button>
              <Sidebar />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className={`flex-1 p-10 bg-green-50 md:rounded-r-2xl ${isLoggedIn ? 'md:basis-2/3' : 'basis-full'}`}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Dashboard />
                ) : (
                  <Login onLoginSuccess={() => setIsLoggedIn(true)} />
                )
              }
            />
            <Route path="/upload" element={isLoggedIn ? <Uploads /> : <Navigate to="/" />} />
            <Route path="/reports" element={isLoggedIn ? <Reports /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;

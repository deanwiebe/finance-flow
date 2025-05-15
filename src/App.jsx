import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Uploads from './pages/Upload';
import Reports from './pages/Reports';
import Login from './pages/Login';

const App = () => {
  // Initialize logged-in state based on localized data
  const [isLoggedIn, setIsLoggedIn] = useState(window.financeFlowData?.isLoggedIn === '1');

  return (
    <div className="flex flex-row" style={{ height: '100vh' }}>
      {isLoggedIn && <Sidebar />}

      <main className={`flex-1 flex p-10 justify-center ${isLoggedIn ? 'basis-2/3' : 'basis-full'}`}>
        <div>
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
            <Route
              path="/upload"
              element={isLoggedIn ? <Uploads /> : <Navigate to="/" />}
            />
            <Route
              path="/reports"
              element={isLoggedIn ? <Reports /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;

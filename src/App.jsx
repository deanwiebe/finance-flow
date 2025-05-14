import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';


import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">

        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <div className="p-6 text-2xl font-bold text-green-600">
            Finance Flow
          </div>
          <nav className="mt-10">
            <ul>
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `block py-2.5 px-4 rounded text-gray-700 hover:bg-green-100 ${
                      isActive ? 'bg-green-200 font-semibold' : ''
                    }`
                  }
                  end
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/upload" 
                  className={({ isActive }) => 
                    `block py-2.5 px-4 rounded text-gray-700 hover:bg-green-100 ${
                      isActive ? 'bg-green-200 font-semibold' : ''
                    }`
                  }
                >
                  Upload CSV
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/reports" 
                  className={({ isActive }) => 
                    `block py-2.5 px-4 rounded text-gray-700 hover:bg-green-100 ${
                      isActive ? 'bg-green-200 font-semibold' : ''
                    }`
                  }
                >
                  Reports
                </NavLink>
              </li>
              <li>
                <a href="#" className="block py-2.5 px-4 rounded hover:bg-green-100 text-gray-700">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 overflow-y-auto justify-items-center content-center">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

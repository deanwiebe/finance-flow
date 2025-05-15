import React from 'react';
import { NavLink } from 'react-router-dom';

const user = window.financeFlowData?.user;
const isLoggedIn = window.financeFlowData?.isLoggedIn;
const displayName = user?.data?.display_name || user?.data?.user_login;

const Sidebar = () => {
const handleLogout = async () => {
  await fetch('http://finance-flow.local/wp-json/finance-flow/v1/logout', {
    method: 'POST',
    credentials: 'include',
  });

  // Optional: Clear any other app state or cookies here
  window.location.href = '/'; 
};

  const baseClasses =
    'block w-full text-center py-3 px-6 rounded-xl bg-white text-gray-800 font-medium shadow hover:shadow-lg hover:scale-[1.03] hover:bg-green-100 transition-all duration-200';

  const activeClasses = 'bg-green-300 text-green-900 shadow-lg';

  return (
    <aside className="basis-1/4 flex flex-col items-center w-64 bg-gray-50 shadow-lg h-full py-8">

      {isLoggedIn && (
        <div className="text-2xl font-extrabold text-green-600 mb-10">
          Welcome, {displayName}
        </div>
      )}

      <nav className="w-full px-4">
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${baseClasses} ${isActive ? activeClasses : ''}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `${baseClasses} ${isActive ? activeClasses : ''}`
              }
            >
              Upload CSV
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `${baseClasses} ${isActive ? activeClasses : ''}`
              }
            >
              Reports
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className={`${baseClasses} text-red-600 hover:bg-red-100`}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

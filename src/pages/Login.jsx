import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import TermsOfUse from './TermsOfUse';
import PrivacyPolicy from './PrivacyPolicy';



const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const location = useLocation();

  const linkStyle = (path) => {
    return location.pathname === path
      ? 'text-green-800 underline font-bold'
      : 'text-green-600 underline';
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

if (!isLogin && !agreed) {
  setError('You must agree to the Terms of Use and Privacy Policy to continue.');
  return;
}

    const endpoint = isLogin
      ? '/wp-json/finance-flow/v1/login'
      : '/wp-json/finance-flow/v1/register';

    const payload = {
      username: form.username,
      password: form.password,
    };
    if (!isLogin) payload.email = form.email;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        window.location.reload(); // success
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Request failed');
    }
  };

  // Show terms or privacy content in left panel if on those routes
  const showTerms = location.pathname === '/terms-of-use';
  const showPrivacy = location.pathname === '/privacy-policy';

  return (
    <div className="flex flex-col md:flex-row h-screen bg-green-50 text-gray-800">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-green-600 text-white p-10 flex flex-col justify-center overflow-auto">
        {showTerms ? (
          <TermsOfUse />
        ) : showPrivacy ? (
          <PrivacyPolicy />
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">Finance Flow</h1>
            <p className="text-lg mb-6">
              Upload your bank statements, track your income and expenses, and get insightful reports to improve your finances.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>📊 Automatic chart generation</li>
              <li>🔒 Secure login with WordPress</li>
              <li>📁 CSV upload support</li>
              <li>📅 Monthly and category breakdowns</li>
            </ul>
          </>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-t-lg text-lg font-medium ${
                isLogin ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-t-lg text-lg font-medium ${
                !isLogin ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
              }`}
            >
              Register
            </button>
          </div>

          <form
  onSubmit={handleSubmit}
  className="bg-white p-6 rounded-lg shadow-md space-y-4 border"
>
  <input
    type="text"
    name="username"
    value={form.username}
    onChange={handleInputChange}
    placeholder="Username"
    required
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
  />
  {!isLogin && (
    <input
      type="email"
      name="email"
      value={form.email}
      onChange={handleInputChange}
      placeholder="Email"
      required
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  )}
  <input
    type="password"
    name="password"
    value={form.password}
    onChange={handleInputChange}
    placeholder="Password"
    required
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
  />

  {/* Agreement Checkbox and Links — Registration only */}
  {!isLogin && (
    <label className="block text-sm text-gray-700">
      <input
        type="checkbox"
        checked={agreed}
        onChange={handleCheckboxChange}
        className="mr-2"
      />
      I agree to the{' '}
      <Link to="/terms-of-use" className={linkStyle('/terms-of-use')}>
        Terms of Use
      </Link>{' '}
      and{' '}
      <Link to="/privacy-policy" className={linkStyle('/privacy-policy')}>
        Privacy Policy
      </Link>
      .
    </label>
  )}

  {error && <p className="text-red-600">{error}</p>}

  <button
    type="submit"
    className={`w-full py-2 rounded-md text-white ${
      agreed || isLogin ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
    }`}
    disabled={!agreed && !isLogin}
  >
    {isLogin ? 'Login' : 'Register'}
  </button>
</form>

        </div>
      </div>

      {/* Routes to render Terms and Privacy pages in right panel if needed */}
      <Routes>
        <Route path="/terms-of-use" element={<></>} />
        <Route path="/privacy-policy" element={<></>} />
      </Routes>
    </div>
  );
};

export default Login;

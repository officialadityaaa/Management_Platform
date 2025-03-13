import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import ClaimForm from './components/ClaimForm';
import InsurerDashboard from './components/InsurerDashboard';
import ClaimDetails from './components/ClaimDetails';
import './App.css';  // Import the new styling

function App() {
  // Store auth state (in production consider using context or Redux)
  const [auth, setAuth] = useState({ token: null, role: null, email: null });

  const handleLogin = (token, role, email) => {
    setAuth({ token, role, email });
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setAuth({ token: null, role: null, email: null });
    localStorage.removeItem('token');
  };

  return (
    <div>
      <header>
        <h1>Claims Management Platform</h1>
        {auth.token && <button onClick={handleLogout}>Logout</button>}
      </header>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={!auth.token ? <Login onLogin={handleLogin} /> : <Navigate to={auth.role === 'patient' ? "/patient" : "/insurer"} />}
          />
          <Route
            path="/patient"
            element={auth.token && auth.role === 'patient' ? <PatientDashboard auth={auth} /> : <Navigate to="/" />}
          />
          <Route
            path="/patient/new"
            element={auth.token && auth.role === 'patient' ? <ClaimForm auth={auth} /> : <Navigate to="/" />}
          />
          <Route
            path="/insurer"
            element={auth.token && auth.role === 'insurer' ? <InsurerDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/insurer/claim/:id"
            element={auth.token && auth.role === 'insurer' ? <ClaimDetails /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

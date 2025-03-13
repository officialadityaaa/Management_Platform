import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, role } = res.data;
      // For demo purposes, assume patient email is username@demo.com
      const email = role === 'patient' ? `${username}@demo.com` : null;
      onLogin(token, role, email);
      navigate(role === 'patient' ? '/patient' : '/insurer');
    } catch (err) {
      alert('Login failed: ' + err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Demo credentials:
        <br />Patient: patient1 / password
        <br />Insurer: insurer1 / password
      </p>
    </div>
  );
};

export default Login;

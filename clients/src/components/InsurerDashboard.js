import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const InsurerDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [filters, setFilters] = useState({ status: '' });

  const fetchClaims = async () => {
    try {
      const res = await API.get('/claims', { params: filters });
      setClaims(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [filters]);

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Insurer Claims Dashboard</h2>
      <div>
        <label>Status Filter:</label>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Submission Date</th>
            <th>Name</th>
            <th>Claim Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(claim => (
            <tr key={claim._id}>
              <td>{new Date(claim.submissionDate).toLocaleString()}</td>
              <td>{claim.name}</td>
              <td>{claim.claimAmount}</td>
              <td>{claim.status}</td>
              <td>
                <Link to={`/insurer/claim/${claim._id}`}>Review</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InsurerDashboard;

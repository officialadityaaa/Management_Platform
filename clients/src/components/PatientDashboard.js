import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const PatientDashboard = ({ auth }) => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await API.get('/claims', { params: { email: auth.email } });
        setClaims(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClaims();
  }, [auth.email]);

  return (
    <div>
      <h2>My Claims</h2>
      <Link to="/patient/new">Submit New Claim</Link>
      <table>
        <thead>
          <tr>
            <th>Submission Date</th>
            <th>Claim Amount</th>
            <th>Status</th>
            <th>Approved Amount</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(claim => (
            <tr key={claim._id}>
              <td>{new Date(claim.submissionDate).toLocaleString()}</td>
              <td>{claim.claimAmount}</td>
              <td>{claim.status}</td>
              <td>{claim.approvedAmount || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientDashboard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ClaimDetails = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    approvedAmount: '',
    insurerComments: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await API.get('/claims');
        const found = res.data.find(c => c._id === id);
        setClaim(found);
        setFormData({
          status: found.status,
          approvedAmount: found.approvedAmount || '',
          insurerComments: found.insurerComments || ''
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchClaim();
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await API.put(`/claims/${id}`, formData);
      alert('Claim updated successfully');
      navigate('/insurer');
    } catch (err) {
      console.error(err);
      alert('Error updating claim');
    }
  };

  if (!claim) return <div>Loading...</div>;

  return (
    <div>
      <h2>Claim Details</h2>
      <p><strong>Name:</strong> {claim.name}</p>
      <p><strong>Email:</strong> {claim.email}</p>
      <p><strong>Claim Amount:</strong> {claim.claimAmount}</p>
      <p><strong>Description:</strong> {claim.description}</p>
      <p>
        <strong>Document:</strong>
        {claim.document ? (
          <a href={`http://localhost:5000/${claim.document}`} target="_blank" rel="noreferrer">
            View Document
          </a>
        ) : (
          'No document'
        )}
      </p>
      <hr />
      <form onSubmit={handleUpdate}>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label>Approved Amount:</label>
          <input name="approvedAmount" type="number" value={formData.approvedAmount} onChange={handleChange} />
        </div>
        <div>
          <label>Comments:</label>
          <textarea name="insurerComments" value={formData.insurerComments} onChange={handleChange} />
        </div>
        <button type="submit">Update Claim</button>
      </form>
    </div>
  );
};

export default ClaimDetails;

import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const ClaimForm = ({ auth }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: auth.email || '',
    claimAmount: '',
    description: '',
    document: null,
  });
  const navigate = useNavigate();

  const handleChange = e => {
    if (e.target.name === 'document') {
      setFormData({ ...formData, document: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('claimAmount', formData.claimAmount);
      data.append('description', formData.description);
      if (formData.document) {
        data.append('document', formData.document);
      }
      await API.post('/claims', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Claim submitted successfully');
      navigate('/patient');
    } catch (err) {
      console.error(err);
      alert('Error submitting claim');
    }
  };

  return (
    <div>
      <h2>Submit New Claim</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Claim Amount:</label>
          <input name="claimAmount" type="number" value={formData.claimAmount} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label>Upload Document:</label>
          <input name="document" type="file" onChange={handleChange} />
        </div>
        <button type="submit">Submit Claim</button>
      </form>
    </div>
  );
};

export default ClaimForm;

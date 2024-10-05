import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const EditSupplier = () => {
  const [supplier, setSupplier] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();
  const { id } = useParams(); // Get the supplier ID from the URL

  useEffect(() => {
    // Fetch the supplier data when the component mounts
    const fetchSupplier = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/suppliers/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        // Check the response structure and set the state accordingly
        const { supplier } = response.data; // Adjust if necessary
        setSupplier(supplier);
        setName(supplier.name);
        setAddress(supplier.address);
        setPhone(supplier.phone);
      } catch (error) {
        console.error('Error fetching supplier:', error);
        setErrors({ fetch: 'Failed to fetch supplier data.' }); // Set a generic error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSupplier();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/suppliers/${id}`, { name, address, phone }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/suppliers');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error updating supplier:', error);
        setErrors({ update: 'Failed to update supplier.' }); // Set a generic error message
      }
    }
  };



  return (
    <div className="d-flex">
      <Sidebar /> {/* Render Sidebar */}
      <div className="flex-grow-1">
        <Header /> {/* Render Header */}
        <div className="container">
          <h2>Edit Supplier</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && <div className="text-danger">{errors.name[0]}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
              {errors.address && <div className="text-danger">{errors.address[0]}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="number"
                id="phone"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {errors.phone && <div className="text-danger">{errors.phone[0]}</div>}
            </div>

            <button type="submit" className="btn btn-success">Update Supplier</button>
            {errors.update && <div className="text-danger">{errors.update}</div>} {/* Display generic update error */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;

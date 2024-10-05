import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const OrderList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch suppliers from your API
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/suppliers'); // Adjust API endpoint as necessary
                console.log('Fetched Suppliers:', response); // Log the entire response object

                // Check for various response structures
                if (Array.isArray(response.data)) {
                    // Directly an array
                    setSuppliers(response.data);
                } else if (response.data && Array.isArray(response.data.suppliers)) {
                    // If suppliers are nested
                    setSuppliers(response.data.suppliers);
                } else {
                    console.error('Expected an array but got:', response.data);
                    setErrorMessage('Unexpected response format.');
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setErrorMessage('Failed to fetch suppliers. Please try again later.');
            }
        };

        fetchSuppliers();
    }, []);

    const handleDelete = async (supplierId) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/suppliers/${supplierId}`); // Adjust API endpoint as necessary
                setSuppliers(suppliers.filter(supplier => supplier.id !== supplierId));
                setSuccessMessage('Supplier deleted successfully.');
            } catch (error) {
                console.error('Error deleting supplier:', error);
                setErrorMessage('Failed to delete supplier. Please try again later.');
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    <h2 style={{textAlign: 'center'}}>Purchase List</h2>

                    {successMessage && (
                        <div className="alert alert-success">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="alert alert-danger">
                            {errorMessage}
                        </div>
                    )}

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Supplier</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.length > 0 ? (
                                suppliers.map(supplier => (
                                    <tr key={supplier.id}>
                                        <td>{supplier.name}</td>
                                        <td>
                                            <button
                                                onClick={() => navigate(`/suppliers/${supplier.id}`)}
                                                className="btn btn-info btn-sm"
                                            >
                                                Details
                                            </button>

                                            <button
                                                onClick={() => handleDelete(supplier.id)}
                                                className="btn btn-danger btn-sm"
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">No suppliers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderList;

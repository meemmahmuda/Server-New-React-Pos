import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/suppliers');
                setSuppliers(response.data.suppliers);
            } catch (err) {
                setError('Error fetching suppliers');
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/suppliers/${id}`);
                setSuppliers(suppliers.filter(supplier => supplier.id !== id));
            } catch (err) {
                setError('Error deleting supplier');
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render the Sidebar component */}
            <div className="main-content flex-fill">
                <Header /> {/* Render the Header component */}
                <div className="container">
                    <h2 style={{ textAlign: 'center' }}>Supplier List</h2>
                    <Link to="/suppliers/create" className="btn btn-primary">Add New Supplier</Link>
              
                        <table className="table table-striped table-hover mt-3">
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th>SL No.</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supplier, index) => (
                                    <tr key={supplier.id}>
                                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                        <td>{supplier.name}</td>
                                        <td>{supplier.address}</td>
                                        <td>{supplier.phone}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Link to={`/suppliers/edit/${supplier.id}`} className="btn btn-warning">Edit</Link>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(supplier.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    
                </div>
            </div>
        </div>
    );
};

export default SupplierList;

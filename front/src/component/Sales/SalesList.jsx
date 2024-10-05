import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../Header'; // Import the Header component
import Sidebar from '../Sidebar'; // Import the Sidebar component

const SalesList = () => {
    const [sales, setSales] = useState({}); // Initialize sales as an empty object
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        // Fetch sales data from the API
        const fetchSales = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/sales'); // Adjust the API URL as needed
                // Make sure the response contains 'sales' in the expected format
                const fetchedSales = response.data.sales || {}; // Fallback to empty object if undefined
                setSales(fetchedSales);
            } catch (error) {
                console.error('Error fetching sales:', error);
            } finally {
                setLoading(false); // Stop loading once data is fetched
            }
        };

        fetchSales();
    }, []);

    const deleteSale = async (saleId) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/sales/${saleId}`);
                setSuccessMessage('Sale deleted successfully');
                // Fetch updated sales list after deletion
                setSales(prevSales => {
                    const updatedSales = { ...prevSales };
                    Object.keys(updatedSales).forEach(customerName => {
                        updatedSales[customerName] = updatedSales[customerName].filter(sale => sale.id !== saleId);
                        if (updatedSales[customerName].length === 0) {
                            delete updatedSales[customerName];
                        }
                    });
                    return updatedSales;
                });
            } catch (error) {
                console.error('Error deleting sale:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading state while data is being fetched
    }

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    <h2 style={{textAlign: 'center'}}>Sales List</h2>
                    <div className="row">
                        <div className="col-md-12">
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}

                            <div className="mb-3">
                                <Link to="/sales/create" className="btn btn-primary">Create Sale</Link> 
                            </div>

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(sales).length > 0 ? (
                                        Object.entries(sales).map(([customerName, customerSales]) => (
                                            <tr key={customerName}>
                                                <td>{customerName}</td>
                                                <td>
                                                    <Link to={`/sales/${customerName}`} className="btn btn-info btn-sm">Details</Link>

                                                    {/* Delete button for the first sale of the customer */}
                                                    <button
                                                        onClick={() => deleteSale(customerSales[0].id)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">No sales found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesList;

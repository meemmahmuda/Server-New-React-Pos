import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const ShowList = () => {
    const { id } = useParams(); // Get supplier ID from route parameters
    const [supplier, setSupplier] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch supplier details from your API
        const fetchSupplier = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/suppliers/${id}`);
                console.log('Response data:', response.data); // Debugging line
                setSupplier(response.data.supplier); // Adjust based on actual response structure
            } catch (error) {
                console.error('Error fetching supplier:', error.response || error.message); // Log error details
                setErrorMessage('Failed to fetch supplier details. Please try again later.');
            }
        };

        if (id) { // Check if id is defined
            fetchSupplier();
        }
    }, [id]);

    if (errorMessage) {
        return <div className="alert alert-danger">{errorMessage}</div>;
    }

    if (!supplier) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

    const orders = supplier.orders || []; // Fallback to an empty array if orders is undefined

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    <h2>Supplier Details</h2>
                    <h3>Supplier: {supplier.name}</h3>
                    <p>Phone: {supplier.phone}</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>

                    {/* This button will redirect the user to the PDF page */}
                    <a href={`http://127.0.0.1:8000/suppliers/${supplier.id}/print`} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                        Print Invoice
                    </a>

                    <h4>Purchase Products</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Purchase Price</th>
                                <th>Total Price</th>
                                <th>Amount Given</th>
                                <th>Amount Returned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order, index) => {
                                    const totalPrice = order.quantity * order.purchase_price;
                                    return (
                                        <tr key={index}>
                                            <td>{order.product.name}</td>
                                            <td>{order.quantity}</td>
                                            <td>{order.purchase_price.toFixed(2)}</td>
                                            <td>{totalPrice.toFixed(2)}</td>
                                            <td>{order.amount_given.toFixed(2)}</td>
                                            <td>{(order.amount_given - totalPrice).toFixed(2)}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No orders found for this supplier.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan="3" className="text-right">Overall Total Price:</th>
                                <th>{orders.reduce((total, order) => total + (order.quantity * order.purchase_price), 0).toFixed(2)}</th>
                                <th>{orders.reduce((total, order) => total + order.amount_given, 0).toFixed(2)}</th>
                                <th>{(orders.reduce((total, order) => total + order.amount_given, 0) - orders.reduce((total, order) => total + (order.quantity * order.purchase_price), 0)).toFixed(2)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShowList;

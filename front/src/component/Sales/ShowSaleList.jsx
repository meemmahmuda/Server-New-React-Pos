import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../Header'; // Import the Header component
import Sidebar from '../Sidebar'; // Import the Sidebar component

const ShowSaleList = () => {
    const { customerName } = useParams(); // Get customer name from URL parameters
    const [sales, setSales] = useState([]); // Initialize sales as an empty array
    const [totals, setTotals] = useState({
        totalPrice: 0,
        totalMoneyTaken: 0,
        totalMoneyReturned: 0
    }); // State for totals (price, money taken, and money returned)

    useEffect(() => {
        // Fetch sales data based on customerName
        const fetchSales = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/sales/${customerName}`);
                setSales(response.data.sales); // Assume API returns sales array

                // Calculate totals like in the Blade view
                let totalPrice = 0, totalMoneyTaken = 0, totalMoneyReturned = 0;
                response.data.sales.forEach(sale => {
                    totalPrice += parseFloat(sale.total_price); // Accumulate total price
                    totalMoneyTaken += parseFloat(sale.money_taken); // Accumulate total money taken
                    totalMoneyReturned += parseFloat(sale.money_returned); // Accumulate total money returned
                });

                setTotals({
                    totalPrice,
                    totalMoneyTaken,
                    totalMoneyReturned
                });
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchSales();
    }, [customerName]);

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    <h3>Sales Details for {customerName}</h3>
                    <div className="card">
                        <div className="card-body">
                            <h5>Sale Records</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Sale ID</th>
                                        <th>Sale Date</th>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Selling Price</th>
                                        <th>Discount</th>
                                        <th>Total Price</th>
                                        <th>Money Taken</th>
                                        <th>Money Returned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.length > 0 ? (
                                        sales.map(sale => (
                                            <tr key={sale.id}>
                                                <td>{sale.id}</td>
                                                <td>{new Date(sale.created_at).toLocaleString()}</td>
                                                <td>{sale.product?.name || 'N/A'}</td>
                                                <td>{sale.quantity}</td>
                                                <td>{sale.selling_price}</td>
                                                <td>{sale.discount}%</td>
                                                <td>{sale.total_price}</td>
                                                <td>{sale.money_taken}</td>
                                                <td>{sale.money_returned}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="text-center">No sales found.</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="6" className="text-right"><strong>Total Price:</strong></td>
                                        <td>{totals.totalPrice.toFixed(2)}</td> {/* Display the total price */}
                                        <td>{totals.totalMoneyTaken.toFixed(2)}</td> {/* Display the total money taken */}
                                        <td>{totals.totalMoneyReturned.toFixed(2)}</td> {/* Display the total money returned */}
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="mt-3">
                                {sales.length > 0 && (
                                    <a 
                                        href={`http://127.0.0.1:8000/api/sales/${sales[0].id}/pdf`} 
                                        className="btn btn-success" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Download PDF
                                    </a>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowSaleList;

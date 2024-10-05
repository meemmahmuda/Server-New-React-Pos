import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const CreateReturn = () => {
    const [sales, setSales] = useState([]); // Initialize sales as an empty array
    const [selectedSale, setSelectedSale] = useState('');
    const [quantity, setQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState(0); // Default to 0
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        // Fetch sales data from the backend
        const fetchSales = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/sales'); // Adjust the endpoint as needed
                console.log('Fetched sales data:', response.data); // Log the data to inspect its structure

                // Ensure that the response contains a sales object
                if (response.data && response.data.sales) {
                    const allSales = Object.values(response.data.sales).flat(); // Flatten the sales data into a single array
                    setSales(allSales); // Set the flattened sales data
                } else {
                    console.error('Sales data is not available in the expected structure:', response.data);
                    setSales([]); // Set to empty array if structure is not as expected
                }
            } catch (error) {
                console.error('Error fetching sales:', error);
                setSales([]); // Set to empty array on error
            }
        };
        fetchSales();
    }, []);

    const handleSaleChange = (e) => {
        const selectedId = e.target.value;
        const sale = sales.find(sale => sale.id.toString() === selectedId); // Convert to string for comparison
        
        if (sale) {
            setSelectedSale(sale.id);
            setMaxQuantity(sale.quantity);
        } else {
            setSelectedSale('');
            setMaxQuantity(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseInt(quantity) > maxQuantity) { // Ensure quantity is a number for comparison
            alert('The quantity returned cannot exceed the quantity sold.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/sales_returns', {
                sale_id: selectedSale,
                quantity: quantity,
            });
            alert('Sales return processed successfully!');
            // Redirect to the index page
            navigate('/sales_returns'); // Adjust the path as needed
        } catch (error) {
            console.error('Error processing return:', error);
            alert('Failed to process return. Please check the input.');
        }
    };

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    <h2>Create Sales Return</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="sale_id">Select Sale</label>
                            <select
                                name="sale_id"
                                id="sale_id"
                                className="form-control"
                                onChange={handleSaleChange}
                                required
                            >
                                <option value="">Select a sale</option>
                                {sales.map(sale => {
                                    // Debugging statement to check the sale structure
                                    console.log('Sale item:', sale);
                                    return (
                                        <option key={sale.id} value={sale.id}>
                                            {sale.product && sale.product.name ? sale.product.name : 'Product name not available'} - Qty Sold: {sale.quantity}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Quantity Returned</label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                className="form-control"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                min="1"
                                max={maxQuantity}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Process Return</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateReturn;

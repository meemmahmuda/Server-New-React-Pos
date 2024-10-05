import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const CreateSale = () => {
    const [products, setProducts] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [productId, setProductId] = useState('');
    const [sellingPrice, setSellingPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalSalesAmount, setTotalSalesAmount] = useState(0);
    const [sales, setSales] = useState([]);
    const [moneyTaken, setMoneyTaken] = useState(0);
    const [moneyReturned, setMoneyReturned] = useState(0);

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch products from API
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products'); // Adjust API endpoint as necessary
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        calculateTotalPrice();
    }, [quantity, sellingPrice, discount]);

    useEffect(() => {
        calculateMoneyReturned();
    }, [moneyTaken, totalSalesAmount]);

    const handleProductChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        setSellingPrice(parseFloat(price));
        setProductId(e.target.value);
    };

    const calculateTotalPrice = () => {
        let total = quantity * sellingPrice;
        if (discount) {
            total -= total * (discount / 100);
        }
        setTotalPrice(total);
    };

    const calculateMoneyReturned = () => {
        const returnAmount = moneyTaken - totalSalesAmount;
        setMoneyReturned(returnAmount >= 0 ? returnAmount : 0);
    };

    const addSale = () => {
        if (!productId || !quantity || !sellingPrice) {
            alert('Please select a product and enter quantity.');
            return;
        }

        const newSale = {
            product_id: productId,
            quantity: quantity,
            price: sellingPrice,
            discount: discount,
            total_price: totalPrice,
        };

        setSales([...sales, newSale]);
        setTotalSalesAmount(totalSalesAmount + totalPrice);

        // Reset form fields
        setProductId('');
        setSellingPrice(0);
        setQuantity(1);
        setDiscount(0);
        setTotalPrice(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (sales.length === 0) {
            alert('Please add at least one sale before submitting.');
            return;
        }

        const saleData = {
            customer_name: customerName,
            address: address,
            phone_no: phoneNo,
            sales_data: JSON.stringify(sales),
            total_sales: totalSalesAmount,
            money_taken: moneyTaken,
            money_returned: moneyReturned,
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/sales', saleData); // Adjust API endpoint as necessary
            alert('Sale created successfully!');
            // Reset form and state
            setSales([]);
            setTotalSalesAmount(0);
            navigate('/sales'); // Redirect to the sales index page
        } catch (error) {
            console.error('Error creating sale:', error);
            alert('Failed to create sale.');
        }
    };

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    <h2>Create Sale & Sales Bill</h2>
                    <div className="row">
                        {/* Sale Creation Form */}
                        <div className="col-md-6">
                            <form id="saleForm" style={{marginBottom: '40px'}}>
                                <div className="form-group">
                                    <label htmlFor="customer_name">Customer Name</label>
                                    <input
                                        type="text"
                                        id="customer_name"
                                        className="form-control"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        className="form-control"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone_no">Phone No</label>
                                    <input
                                        type="number"
                                        id="phone_no"
                                        className="form-control"
                                        value={phoneNo}
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product_id">Product</label>
                                    <select
                                        id="product_id"
                                        className="form-control"
                                        value={productId}
                                        onChange={handleProductChange}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                                data-price={product.selling_price}
                                            >
                                                {product.name} (Stock: {product.stock})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="selling_price">Selling Price</label>
                                    <input
                                        type="number"
                                        id="selling_price"
                                        className="form-control"
                                        value={sellingPrice}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        className="form-control"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="discount">Discount (%)</label>
                                    <input
                                        type="number"
                                        id="discount"
                                        className="form-control"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="total_price">Total Price</label>
                                    <input
                                        type="number"
                                        id="total_price"
                                        className="form-control"
                                        value={totalPrice}
                                        readOnly
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={addSale}
                                >
                                    Add Sale
                                </button>
                            </form>
                        </div>

                        {/* Sales Bill Section */}
                        <div className="col-md-6">
                            <h3>Sales Bill</h3>
                            <form id="salesBillForm" onSubmit={handleSubmit}>
                                <table className="table table-bordered" id="salesSummary">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.map((sale, index) => (
                                            <tr key={index}>
                                                <td>{products.find(p => p.id == sale.product_id)?.name}</td>
                                                <td>{sale.quantity}</td>
                                                <td>{sale.price}</td>
                                                <td>{sale.discount}</td>
                                                <td>{sale.total_price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="form-group">
                                    <label htmlFor="total_sales">Total Sales</label>
                                    <input
                                        type="number"
                                        id="total_sales"
                                        className="form-control"
                                        value={totalSalesAmount}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="money_taken">Money Taken</label>
                                    <input
                                        type="number"
                                        id="money_taken"
                                        className="form-control"
                                        value={moneyTaken}
                                        onChange={(e) => setMoneyTaken(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="money_returned">Money Returned</label>
                                    <input
                                        type="number"
                                        id="money_returned"
                                        className="form-control"
                                        value={moneyReturned}
                                        readOnly
                                    />
                                </div>
                                <button type="submit" className="btn btn-success">Submit Sale</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSale;

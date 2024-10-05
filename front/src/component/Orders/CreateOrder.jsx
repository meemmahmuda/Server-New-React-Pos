import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const CreateOrder = () => {
    const [products, setProducts] = useState([]);
    const [supplierName, setSupplierName] = useState('');
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orders, setOrders] = useState([]);
    const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
    const [amountGiven, setAmountGiven] = useState(0);
    const [amountReturn, setAmountReturn] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch products from your API
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
        calculateAmountReturn();
    }, [quantity, purchasePrice, amountGiven]);

    const handleProductChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        const supplier = selectedOption.getAttribute('data-supplier');

        setSupplierName(supplier);
        setPurchasePrice(parseFloat(price));
    };

    const addOrder = () => {
        if (!purchasePrice || quantity <= 0) {
            alert('Please select a product and enter quantity.');
            return;
        }

        const newOrder = {
            product_id: document.getElementById('product_id').value,
            quantity: quantity,
            price: purchasePrice,
            total_price: totalPrice,
        };

        setOrders([...orders, newOrder]);
        setTotalPurchaseAmount(totalPurchaseAmount + totalPrice);

        // Reset form for the next order
        setQuantity(1);
        setPurchasePrice(0);
        setSupplierName('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (orders.length === 0) {
            alert('Please add at least one order before submitting.');
            return;
        }

        const orderData = {
            order_data: JSON.stringify(orders),
            amount_given: amountGiven,
            amount_return: amountReturn,
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/orders', orderData); // Adjust API endpoint as necessary
            alert('Order created successfully!');
            // Reset state if necessary
            setOrders([]);
            setTotalPurchaseAmount(0);
            navigate('/orders'); // Redirect after successful order creation
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order.');
        }
    };

    const calculateTotalPrice = () => {
        setTotalPrice(quantity * purchasePrice);
    };

    const calculateAmountReturn = () => {
        const returnAmount = amountGiven - totalPurchaseAmount;
        setAmountReturn(returnAmount >= 0 ? returnAmount : 0);
    };

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    <h2>Create Order</h2>
                    <div className="row">
                        {/* Order Creation Form */}
                        <div className="col-md-6">
                            <form id="orderForm" style={{marginBottom: '40px'}}>
                                <div className="form-group">
                                    <label htmlFor="product_id">Product</label>
                                    <select
                                        id="product_id"
                                        name="product_id"
                                        className="form-control"
                                        onChange={handleProductChange}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                                data-price={product.purchase_price}
                                                data-supplier={product.supplier.name}
                                            >
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="supplier_name">Supplier</label>
                                    <input
                                        type="text"
                                        id="supplier_name"
                                        className="form-control"
                                        value={supplierName}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="purchase_price">Purchase Price</label>
                                    <input
                                        type="number"
                                        id="purchase_price"
                                        className="form-control"
                                        value={purchasePrice}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        className="form-control"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        min="1"
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
                                    onClick={addOrder}
                                >
                                    Add Order
                                </button>
                            </form>
                        </div>

                        {/* Purchase Bill Section */}
                        <div className="col-md-6">
                            <h3>Purchase Bill</h3>
                            <form id="purchaseForm" onSubmit={handleSubmit}  style={{marginBottom: '40px'}}>
                                <table className="table table-bordered" id="orderSummary">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, index) => (
                                            <tr key={index}>
                                                <td>{products.find((p) => p.id === parseInt(order.product_id)).name}</td>
                                                <td>{order.quantity}</td>
                                                <td>{order.price}</td>
                                                <td>{order.total_price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="form-group">
                                    <label htmlFor="total_purchase">Total Purchase</label>
                                    <input
                                        type="number"
                                        id="total_purchase"
                                        name="total_purchase"
                                        className="form-control"
                                        value={totalPurchaseAmount}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="amount_given">Amount Given</label>
                                    <input
                                        type="number"
                                        id="amount_given"
                                        name="amount_given"
                                        className="form-control"
                                        value={amountGiven}
                                        onChange={(e) => setAmountGiven(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="amount_return">Amount Returned</label>
                                    <input
                                        type="number"
                                        id="amount_return"
                                        name="amount_return"
                                        className="form-control"
                                        value={amountReturn}
                                        readOnly
                                    />
                                </div>
                                <button type="submit" className="btn btn-success">
                                    Submit Purchase
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrder;

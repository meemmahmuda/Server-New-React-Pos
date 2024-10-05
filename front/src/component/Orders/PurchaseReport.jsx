import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const PurchaseReport = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [reportData, setReportData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch report data when the component mounts or when selectedDate or selectedMonth changes
        if (selectedDate || selectedMonth) {
            fetchReportData();
        }
    }, [selectedDate, selectedMonth]);

    const fetchReportData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/purchases/report', {
                params: {
                    date: selectedDate,
                    month: selectedMonth,
                },
            });
            setReportData(response.data.reportData);
            setError(''); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch report data.');
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedMonth(''); // Reset month selection
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setSelectedDate(''); // Reset date selection
    };

    const renderTableRows = () => {
        return reportData.map((data, index) => (
            <tr key={index}>
                <td>{data.supplier || 'N/A'}</td>
                <td>{data.product_name}</td>
                <td>{data.quantity}</td>
                <td>TK {data.purchase_price}</td>
                <td>TK {data.total_price}</td>
            </tr>
        ));
    };

    const handlePDFDownload = () => {
        const url = `http://127.0.0.1:8000/api/orders/report/pdf?date=${selectedDate}&month=${selectedMonth}`;
        window.open(url, '_blank'); // Opens the PDF in a new tab
    };

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    <h2 style={{ textAlign: 'center' }}>Purchase Report</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <form onSubmit={(e) => { e.preventDefault(); fetchReportData(); }} style={{ marginRight: '20px' }}>
                            <div className="form-group">
                                <label htmlFor="date">Select Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="form-control"
                                    style={{ width: '200px' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Generate Date Report</button>
                        </form>

                        <form onSubmit={(e) => { e.preventDefault(); fetchReportData(); }}>
                            <div className="form-group">
                                <label htmlFor="month">Select Month:</label>
                                <select
                                    id="month"
                                    name="month"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    className="form-control"
                                    style={{ width: '150px' }}
                                >
                                    <option value="">Select Month</option>
                                    {Array.from({ length: 12 }, (_, index) => (
                                        <option key={index} value={index + 1}>
                                            {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Generate Month Report</button>
                        </form>
                    </div>

                    {error && <p className="mt-4 text-danger">{error}</p>}

                    {reportData.length > 0 ? (
                        <table className="table table-bordered mt-4">
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Purchase Price</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mt-4">No purchase data available for the selected date or month.</p>
                    )}

                    {reportData.length > 0 && (
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <button onClick={handlePDFDownload} className="btn btn-success mt-3">
                                Print PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseReport;

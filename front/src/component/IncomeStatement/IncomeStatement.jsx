import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header'; // Import your Header component
import Sidebar from '../Sidebar'; // Import your Sidebar component

const IncomeStatement = () => {
    const [incomeStatement, setIncomeStatement] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month

    useEffect(() => {
        fetchIncomeStatement(selectedMonth);
    }, [selectedMonth]);

    const fetchIncomeStatement = async (month) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/income-statement?month=${month}`);
            setIncomeStatement(response.data.incomeStatement);
        } catch (error) {
            console.error('Error fetching income statement:', error);
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchIncomeStatement(selectedMonth);
    };

    const downloadPDF = () => {
        window.location.href = `http://127.0.0.1:8000/api/income-statement/pdf?month=${selectedMonth}`;
    };

    return (
        <div className="d-flex">
            <Sidebar /> {/* Render Sidebar */}
            <div className="flex-grow-1">
                <Header /> {/* Render Header */}
                <div className="container">
                    {/* Month selection form */}
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="form-group row">
                            <label htmlFor="month" className="col-sm-2 col-form-label">Select Month:</label>
                            <div className="col-sm-4">
                                <input
                                    type="month"
                                    id="month"
                                    name="month"
                                    className="form-control"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                />
                            </div>
                            <div className="col-sm-2">
                                <button type="submit" className="btn btn-primary">Filter</button>
                            </div>
                        </div>
                    </form>

                    {/* Download PDF Button */}
                    <button className="btn btn-success mb-4" onClick={downloadPDF}>
                        Download PDF
                    </button>

                    {/* Display the income statement in vertical format */}
                    {incomeStatement ? (
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Details</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Gross Sales</td>
                                    <td>TK {incomeStatement.gross_sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td>(-) Discounts</td>
                                    <td>TK {incomeStatement.discount_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td>(-) Sales Returns</td>
                                    <td>TK {incomeStatement.sales_return_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>Net Sales</td>
                                    <td>TK {incomeStatement.net_sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td>(-) Purchases</td>
                                    <td>TK {incomeStatement.purchase_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td>Cost of Goods Sold (COGS)</td>
                                    <td>TK {incomeStatement.cogs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>Gross Profit</td>
                                    <td>TK {incomeStatement.gross_profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td>(-) Operating Expenses</td>
                                    <td>TK {incomeStatement.operating_expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>Operating Profit (EBIT)</td>
                                    <td>TK {incomeStatement.operating_profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td>(+) Interest Income</td>
                                    <td>TK {incomeStatement.interest_income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td>(-) Interest Expense</td>
                                    <td>TK {incomeStatement.interest_expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>Net Income Before Taxes (EBT)</td>
                                    <td>TK {incomeStatement.net_income_before_taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td>(-) Taxes (15%)</td>
                                    <td>TK {incomeStatement.taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td>Net Income/Loss</td>
                                    <td>TK {incomeStatement.net_income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No data available for the selected month.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncomeStatement;

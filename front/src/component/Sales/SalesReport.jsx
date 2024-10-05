import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header'; // Import the Header component
import Sidebar from '../Sidebar'; // Import the Sidebar component

const SalesReport = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [reportData, setReportData] = useState([]);

  // Function to fetch report data
  const fetchReportData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/sales/report', {
        params: {
          date: selectedDate,
          month: selectedMonth,
        },
      });
      setReportData(response.data.reportData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  // Function to handle form submission for date
  const handleDateSubmit = (e) => {
    e.preventDefault();
    fetchReportData();
  };

  // Function to handle form submission for month
  const handleMonthSubmit = (e) => {
    e.preventDefault();
    fetchReportData();
  };

  return (
    <div className="d-flex">
      {/* Render Sidebar */}
      <Sidebar />
      <div className="flex-grow-1">
        {/* Render Header */}
        <Header />

        <div className="container">
        <h2 style={{ textAlign: 'center' }}>Sales Report</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Form for selecting date */}
            <form onSubmit={handleDateSubmit} style={{ marginRight: '20px' }}>
              <div className="form-group">
                <label htmlFor="date">Select Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-control"
                  style={{ width: '200px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary">Generate Date Report</button>
            </form>

            {/* Form for selecting month */}
            <form onSubmit={handleMonthSubmit}>
              <div className="form-group">
                <label htmlFor="month">Select Month:</label>
                <select
                  id="month"
                  name="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="form-control"
                  style={{ width: '150px' }}
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Generate Month Report</button>
            </form>
          </div>

          {/* Display report data */}
          {reportData.length > 0 ? (
            <>
              <table className="table table-bordered mt-4">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Product Name</th>
                    <th>Units Sold</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Total Sales</th>
                    <th>Net Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.category}</td>
                      <td>{data.product_name}</td>
                      <td>{data.units_sold}</td>
                      <td>TK {data.unit_price}</td>
                      <td>TK {data.discount}</td>
                      <td>TK {data.total_sales}</td>
                      <td>TK {data.net_sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Print PDF Button */}
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <a
                  href={`http://127.0.0.1:8000/api/sales/report/pdf?date=${selectedDate}&month=${selectedMonth}`}
                  className="btn btn-success mt-3"
                  download
                >
                  Print PDF
                </a>
              </div>
            </>
          ) : (
            <p className="mt-4">No sales data available for the selected date or month.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;

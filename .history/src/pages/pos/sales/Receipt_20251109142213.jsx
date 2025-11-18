// src/pages/pos/sales/Receipt.jsx
import React, { useState, useRef } from "react";
import axios from "axios";

function Receipt() {
  const receiptRef = useRef();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!invoiceNumber) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/sales/invoice/${invoiceNumber}`);
      if (res.data) {
        setSale(res.data);
      } else {
        setError("Invoice not found");
        setSale(null);
      }
    } catch (err) {
      setError("Invoice not found or server error");
      setSale(null);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const currentDate = new Date().toLocaleString();

  // Calculate totals
  const subtotal = sale
    ? sale.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  const amountPaid = total; // assuming full payment
  const changeDue = 0; // can be dynamic if needed
  const paymentMethod = sale?.paymentMode || "";

  return (
    <div className="flex flex-col bg-gray-900 text-gray-200 p-6 items-center">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Receipt
      </h1>

      {/* Search Input */}
      <div className="mb-4 w-full max-w-md flex gap-2">
        <input
          type="text"
          placeholder="Enter Invoice Number (e.g., INV-0009)"
          className="flex-1 p-2 rounded border border-gray-400 text-gray-900"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 bg-blue-600 hover:bg-blue-500 rounded font-semibold"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Receipt */}
      {sale && (
        <div
          ref={receiptRef}
          className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-gray-200"
        >
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">Grox Shopping Store</h2>
            <p>123 Market Street, Lagos</p>
            <p>{currentDate}</p>
            <p className="mt-2 font-semibold">Invoice: {sale.invoiceNumber}</p>
          </div>

          <table className="w-full mb-4 border-collapse border border-gray-600">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-2 py-1 text-left">Item</th>
                <th className="px-2 py-1">Qty</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item) => (
                <tr key={item._id} className="border-b border-gray-600">
                  <td className="px-2 py-1">{item.productName</td>
                  <td className="px-2 py-1 text-center">{item.quantity}</td>
                  <td className="px-2 py-1 text-right">₦{item.price.toLocaleString()}</td>
                  <td className="px-2 py-1 text-right">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-2 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7.5%):</span>
              <span>₦{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid:</span>
              <span>₦{amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Change:</span>
              <span>₦{changeDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
          </div>

          <p className="text-center mt-4">Thank you for shopping with us!</p>
        </div>
      )}

      <button
        onClick={handlePrint}
        className="mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded font-semibold"
      >
        Print Receipt
      </button>
    </div>
  );
}

export default Receipt;

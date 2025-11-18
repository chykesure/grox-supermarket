import React, { useState, useRef } from "react";
import axios from "axios";

function Receipt() {
  const receiptRef = useRef();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [sale, setSale] = useState(null); // sale data from backend
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!invoiceNumber) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/sales/invoice/${invoiceNumber}`);
      setSale(res.data);
    } catch (err) {
      alert("Sale not found");
      setSale(null);
    } finally {
      setLoading(false);
    }
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

  const cartItems = sale?.items || []; // prevent undefined
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  const amountPaid = total; // can be replaced with sale.total if exists
  const changeDue = amountPaid - total;
  const paymentMethod = sale?.paymentMode || "—";
  const currentDate = sale ? new Date(sale.date).toLocaleString() : new Date().toLocaleString();

  return (
    <div className="flex flex-col bg-gray-900 text-gray-200 p-6 items-center">
      <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
        Receipt
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Invoice Number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="px-2 py-1 rounded text-black"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {sale && (
        <div
          ref={receiptRef}
          className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-gray-200"
        >
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">Grox Shopping Store</h2>
            <p>123 Market Street, Lagos</p>
            <p>{currentDate}</p>
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
              {cartItems.map((item) => (
                <tr key={item._id} className="border-b border-gray-600">
                  <td className="px-2 py-1">{item.productName}</td>
                  <td className="px-2 py-1 text-center">{item.quantity}</td>
                  <td className="px-2 py-1 text-right">₦{item.price}</td>
                  <td className="px-2 py-1 text-right">₦{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-2 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7.5%):</span>
              <span>₦{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid:</span>
              <span>₦{amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Change:</span>
              <span>₦{changeDue.toFixed(2)}</span>
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

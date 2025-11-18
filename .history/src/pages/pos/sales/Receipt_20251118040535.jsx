import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";

function Receipt() {
  const receiptRef = useRef();
  const location = useLocation();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [sale, setSale] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.invoiceNumber) {
      setInvoiceNumber(location.state.invoiceNumber);
      fetchSale(location.state.invoiceNumber);
    }
  }, [location.state]);

  const fetchSale = async (number) => {
    if (!number) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/sales/invoice/${number}`);
      setSale(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setSale(null);
      setError("Sale not found");
    }
  };

  const handleSearch = () => fetchSale(invoiceNumber);

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

  const subtotal = sale?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  const amountPaid = sale?.total || 0;
  const paymentMethod = sale?.paymentMode || "-";
  const currentDate = sale?.date ? new Date(sale.date).toLocaleString() : "";

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
      {/* Search */}
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="Enter invoice number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {sale && (
        <>
          <div
            ref={receiptRef}
            className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-200"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center mb-2 space-x-2">
                <FaShoppingBag className="text-blue-500 text-3xl" />
                <h2 className="text-2xl font-bold text-gray-800">Grox Shopping Store</h2>
              </div>
              <p className="text-gray-500">{currentDate}</p>
              <p className="text-gray-500">B338 Imo-Akure Road, Ilesha, Osun State</p>
            </div>

            {/* Invoice & Cashier */}
            <div className="flex justify-between mb-4">
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded font-semibold shadow-sm">
                🧾 Invoice #: {sale.invoiceNumber}
              </span>
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded font-medium shadow-sm">
                👤 Cashier: {sale.cashier}
              </span>
            </div>

            {/* Items Table */}
            <table className="w-full mb-4 border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-600">
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-center">Qty</th>
                  <th className="px-3 py-2 text-right">Price</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-3 py-2">{item.productName}</td>
                    <td className="px-3 py-2 text-center">{item.quantity}</td>
                    <td className="px-3 py-2 text-right">₦{item.price.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-gray-300 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>Subtotal:</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>Tax (7.5%):</span>
                <span>₦{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-800 font-bold text-lg">
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Paid:</span>
                <span>₦{amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Payment Method:</span>
                <span>{paymentMethod}</span>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center mt-6 text-gray-500 italic">
              Thank you for shopping with Grox Shopping Store! <br />
              Visit again.
            </p>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="mt-6 py-2 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold shadow"
          >
            Print Receipt
          </button>
        </>
      )}
    </div>
  );
}

export default Receipt;

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // ✅ For reading invoice number from URL

function Receipt() {
  const receiptRef = useRef();
  const { invoiceNumber: invoiceFromUrl } = useParams(); // ✅ e.g. /sales/receipt/13 → invoiceFromUrl = "13"
  const [invoiceNumber, setInvoiceNumber] = useState(invoiceFromUrl || "");
  const [sale, setSale] = useState(null);
  const [error, setError] = useState("");

  // ✅ Auto-fetch sale if URL contains an invoice number
  useEffect(() => {
    if (invoiceFromUrl) {
      fetchSale(invoiceFromUrl);
    }
  }, [invoiceFromUrl]);

  const fetchSale = async (number) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/sales/invoice/${number}`);
      setSale(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching sale:", err);
      setSale(null);
      setError("Sale not found");
    }
  };

  const handleSearch = () => {
    if (invoiceNumber) fetchSale(invoiceNumber);
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

  const subtotal = sale?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  const amountPaid = sale?.total || 0;
  const paymentMethod = sale?.paymentMode || "-";
  const currentDate = sale?.date ? new Date(sale.date).toLocaleString() : "";

  return (
    <div className="flex flex-col items-center bg-gray-900 text-gray-200 p-6 min-h-screen">
      {/* 🔍 Search Bar */}
      {!invoiceFromUrl && (
        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            placeholder="Enter invoice number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="px-3 py-2 rounded text-gray-900"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold"
          >
            Search
          </button>
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 🧾 Receipt Section */}
      {sale && (
        <>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Receipt
          </h1>

          <div
            ref={receiptRef}
            className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-gray-200"
          >
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">Grox Shopping Store</h2>
              <p>B338 Imo-Akure Road </p>
              <p>{currentDate}</p>
              <p className="mt-2 text-yellow-400 font-semibold">
                Invoice #: {sale.invoiceNumber}
              </p>
            </div>

            <table className="w-full mb-4 border-collapse border border-gray-600">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="px-2 py-1 text-left">Item</th>
                  <th className="px-2 py-1 text-center">Qty</th>
                  <th className="px-2 py-1 text-right">Price</th>
                  <th className="px-2 py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="px-2 py-1">{item.productName}</td>
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
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span>₦{amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>{paymentMethod}</span>
              </div>
            </div>

            <p className="text-center mt-4 italic text-gray-400">
              Thank you for shopping with us!
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded font-semibold"
          >
            🖨️ Print Receipt
          </button>
        </>
      )}
    </div>
  );
}

export default Receipt;

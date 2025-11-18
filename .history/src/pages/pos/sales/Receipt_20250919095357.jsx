// src/pages/pos/sales/Receipt.jsx
import React, { useRef } from "react";

function Receipt() {
  const receiptRef = useRef();

  // Sample cart data (replace with real cart from state or context)
  const cartItems = [
    { id: 1, name: "Milk 1L", quantity: 2, price: 200 },
    { id: 2, name: "Bread", quantity: 1, price: 150 },
    { id: 3, name: "Eggs (12pcs)", quantity: 3, price: 500 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  const amountPaid = 2000; // example
  const changeDue = amountPaid - total;

  const paymentMethod = "Cash"; // example
  const currentDate = new Date().toLocaleString();

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

  return (
    <div className="flex flex-col  bg-gray-900 text-gray-200 p-6 items-center">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Receipt
      </h1>

      <div
        ref={receiptRef}
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-gray-200"
      >
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Supermart POS</h2>
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
              <tr key={item.id} className="border-b border-gray-600">
                <td className="px-2 py-1">{item.name}</td>
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

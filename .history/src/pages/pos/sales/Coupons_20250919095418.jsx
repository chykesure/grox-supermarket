// src/pages/pos/sales/Coupons.jsx
import React, { useState } from "react";

function Coupons() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Milk 1L", quantity: 2, price: 200 },
    { id: 2, name: "Bread", quantity: 1, price: 150 },
    { id: 3, name: "Eggs (12pcs)", quantity: 3, price: 500 },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [message, setMessage] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const tax = (subtotal - discountAmount) * 0.075;
  const total = subtotal - discountAmount + tax;

  const applyCoupon = () => {
    // Example logic for demo coupons
    if (couponCode.toLowerCase() === "promo10") {
      setDiscountPercent(10);
      setMessage("Coupon applied! 10% discount.");
    } else if (couponCode.toLowerCase() === "promo20") {
      setDiscountPercent(20);
      setMessage("Coupon applied! 20% discount.");
    } else {
      setDiscountPercent(0);
      setMessage("Invalid coupon code.");
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountPercent(0);
    setMessage("");
  };

  return (
    <div className="flex flex-col  bg-gray-900 text-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Apply Coupons / Discounts
      </h1>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Cart Table */}
        <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg p-4 shadow-lg">
          <table className="w-full table-auto border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-2 py-1 border-b border-gray-600">Item</th>
                <th className="px-2 py-1 border-b border-gray-600">Qty</th>
                <th className="px-2 py-1 border-b border-gray-600">Price</th>
                <th className="px-2 py-1 border-b border-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="px-2 py-1">{item.name}</td>
                  <td className="px-2 py-1">{item.quantity}</td>
                  <td className="px-2 py-1">₦{item.price}</td>
                  <td className="px-2 py-1">₦{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 p-4 bg-gray-700 rounded space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-₦{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7.5%):</span>
              <span>₦{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Coupon Actions */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="p-2 rounded bg-gray-900 border border-gray-600 text-gray-200"
          />
          <button
            onClick={applyCoupon}
            className="w-full py-2 bg-green-600 hover:bg-green-500 rounded font-semibold"
          >
            Apply Coupon
          </button>
          <button
            onClick={removeCoupon}
            className="w-full py-2 bg-red-600 hover:bg-red-500 rounded font-semibold"
          >
            Remove Coupon
          </button>
          {message && (
            <div className={`p-2 rounded ${discountPercent ? "bg-green-700" : "bg-red-700"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Coupons;

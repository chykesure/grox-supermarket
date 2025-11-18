import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

// -----------------------------
// Helper to format money
// -----------------------------
const formatMoney = (amount) => {
  return `₦${new Intl.NumberFormat("en-NG").format(amount)}`;
};

// -----------------------------
// Reusable UI Components
// -----------------------------
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg text-white font-medium shadow-sm transition ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-md border border-gray-700 bg-gray-800 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// -----------------------------
// StockPage Component
// -----------------------------
const StockPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(
    localStorage.getItem("selectedSupplier") || ""
  );
  const [supplierSearch, setSupplierSearch] = useState(""); // For filtering suppliers
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false); // For showing supplier suggestions

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  // Extend currentItem state
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    name: "",
    sku: "",
    quantity: 1,
    costPrice: 0,
    sellingPrice: 0,
    wholesalePrice: 0,
    wholesalePackSize: 1,
    markup: 0,
    subtotal: 0,
    currentStock: 0,
    projectedBalance: 0,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);


  // Fetch suppliers & products
  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleProductSelect = (productId) => {
    const selected = products.find((p) => p._id === productId);
    if (selected) {
      setCurrentItem({
        productId: selected._id,
        name: selected.name,
        sku: selected.sku,
        costPrice: selected.costPrice || 0,
        sellingPrice: selected.sellingPrice || 0,
        quantity: 1,
        subtotal: selected.costPrice || 0,
        currentStock: selected.stockBalance || 0,
        projectedBalance: (selected.stockBalance || 0) + 1,
      });
    }
  };

  const handleCurrentItemChange = (field, value) => {
    let updated = { ...currentItem };

    // Convert numeric fields safely
    const numeric = [
      "quantity",
      "costPrice",
      "sellingPrice",
      "wholesalePrice",
      "wholesalePackSize",
      "markup"
    ];
    updated[field] = numeric.includes(field) ? Number(value) : value;

    // Always pick the latest values (React-safe)
    const cost = field === "costPrice" ? Number(value) : updated.costPrice;
    const selling = field === "sellingPrice" ? Number(value) : updated.sellingPrice;

    // 🔥 Always auto-calc markup when cost or selling changes
    if (cost > 0 && selling > 0) {
      updated.markup = Number((((selling - cost) / cost) * 100).toFixed(2));
    }

    // 🔥 Keep selling price in sync if user edits markup instead
    if (field === "markup" && cost > 0) {
      const newSelling = cost + (cost * Number(value)) / 100;
      updated.sellingPrice = Number(newSelling.toFixed(2));
    }

    // Subtotal
    const qty = field === "quantity" ? Number(value) : updated.quantity;
    updated.subtotal = qty * cost;

    // Projected balance
    updated.projectedBalance = (updated.currentStock || 0) + qty;

    setCurrentItem(updated);
  };



  // Add to cart & persist
  const addToCart = () => {
    if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.costPrice <= 0) {
      return alert("Please select a valid product and enter all required fields.");
    }
    const newCart = [...cartItems, { ...currentItem }];
    setCartItems(newCart);
    localStorage.setItem("cartItems", JSON.stringify(newCart));

    // Reset current item
    setCurrentItem({
      productId: "",
      name: "",
      sku: "",
      quantity: 1,
      costPrice: 0,
      sellingPrice: 0,
      subtotal: 0,
      currentStock: 0,
      projectedBalance: 0,
    });
  };

  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem("cartItems", JSON.stringify(newCart));
  };

  useEffect(() => {
    setTotalAmount(cartItems.reduce((sum, item) => sum + item.subtotal, 0));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("selectedSupplier", selectedSupplier);
  }, [selectedSupplier]);

  const confirmToStock = async () => {
    if (!selectedSupplier) return alert("Select a supplier");
    if (!referenceNumber) return alert("Enter a reference number");
    if (cartItems.length === 0) return alert("Add items to cart first");

    try {
      const res = await axios.post("http://localhost:8080/stock/invoice/save", {
        supplierId: selectedSupplier,
        items: cartItems,
        totalAmount,
        referenceNumber,
      });

      Swal.fire({
        title: "✅ Stock Added Successfully!",
        html: `
          <p style="font-size: 16px; margin: 10px 0;">
            <strong>Reference Number:</strong> <span style="color: #10b981;">${referenceNumber}</span>
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            Total Amount: <strong style="color:#10b981;">₦${new Intl.NumberFormat(
          "en-NG"
        ).format(totalAmount)}</strong>
          </p>
        `,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#059669",
        background: "#111827",
        color: "#d1fae5",
      });

      setCartItems([]);
      setSelectedSupplier("");
      setReferenceNumber("");
      setTotalAmount(0);
      localStorage.removeItem("cartItems");
      localStorage.removeItem("selectedSupplier");
      setShowAddModal(false);
    } catch (err) {
      console.error("Error saving stock invoice:", err);
      alert("❌ Error saving stock. Please try again.");
    }
  };

  // Filter suppliers based on search input
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier._id);
    setSupplierSearch(supplier.name);
    setShowSupplierDropdown(false);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Stock Entry</h2>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus className="w-4 h-4" /> Add Stock
        </Button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
                Add Stock Items
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-red-500 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Supplier Search Input */}
            {/* Supplier Search Input */}
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Supplier
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search supplier..."
                  value={supplierSearch}
                  onChange={(e) => {
                    setSupplierSearch(e.target.value);
                    setShowSupplierDropdown(true);
                  }}
                  onFocus={() => setShowSupplierDropdown(true)}
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
                {showSupplierDropdown && filteredSuppliers.length > 0 && (
                  <ul className="absolute left-0 right-0 z-20 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-y-auto max-h-48">
                    {filteredSuppliers.map((supplier) => (
                      <li
                        key={supplier._id}
                        onClick={() => handleSupplierSelect(supplier)}
                        className="px-4 py-2 hover:bg-emerald-700/40 cursor-pointer text-gray-200 transition"
                      >
                        {supplier.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Product Entry Form */}
            <div className="grid grid-cols-6 gap-4 items-end">
              {/* Reference Number */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reference No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-2025-001"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>

              {/* Product Search */}
              <div className="relative col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product
                </label>
                <input
                  type="text"
                  placeholder="🔍 Search product..."
                  value={currentItem.name}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    const filtered = products.filter((p) =>
                      p.name.toLowerCase().includes(value)
                    );
                    setCurrentItem({ ...currentItem, name: e.target.value });
                    setFilteredProducts(filtered);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />

                {showProductDropdown && filteredProducts.length > 0 && (
                  <ul className="absolute left-0 right-0 z-20 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-y-auto max-h-48">
                    {filteredProducts.map((p) => (
                      <li
                        key={p._id}
                        onClick={() => {
                          handleProductSelect(p._id);
                          setFilteredProducts([]);
                          setShowProductDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-emerald-700/40 cursor-pointer text-gray-200 transition"
                      >
                        {p.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={currentItem.sku}
                  disabled
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-gray-400 placeholder-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Qty
                </label>
                <input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => handleCurrentItemChange("quantity", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cost (₦)
                </label>
                <input
                  type="number"
                  value={currentItem.costPrice}
                  onChange={(e) => handleCurrentItemChange("costPrice", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Selling Price (₦)</label>
                <input
                  type="number"
                  value={currentItem.sellingPrice}
                  onChange={(e) => handleCurrentItemChange("sellingPrice", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Wholesale Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Wholesale Price (₦)</label>
                <input
                  type="number"
                  value={currentItem.wholesalePrice}
                  onChange={(e) => handleCurrentItemChange("wholesalePrice", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Wholesale Pack Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Wholesale Pack Size</label>
                <input
                  type="number"
                  value={currentItem.wholesalePackSize}
                  onChange={(e) => handleCurrentItemChange("wholesalePackSize", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Markup % */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Markup (%)</label>
                <input
                  type="number"
                  value={currentItem.markup}
                  onChange={(e) => handleCurrentItemChange("markup", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Add Button */}
              <div className="col-span-6 flex justify-end">
                <button
                  onClick={addToCart}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 
                 text-white font-semibold rounded-xl shadow-md hover:shadow-emerald-500/30 transition-all"
                >
                  + Add to Cart
                </button>
              </div>
            </div>

            {/* Cart Table */}
            {cartItems.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-800 text-gray-400">
                    <tr>
                      <th>S/N</th>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Qty</th>
                      <th>Cost</th>
                      <th>Selling</th>
                      <th>Wholesale</th>
                      <th>Pack Size</th>
                      <th>Markup %</th>
                      <th>Amount</th>
                      <th>Projected Balance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/60">
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.sku}</td>
                        <td>{item.quantity}</td>
                        <td>{formatMoney(item.costPrice)}</td>
                        <td>{formatMoney(item.sellingPrice)}</td>
                        <td>{formatMoney(item.wholesalePrice)}</td>
                        <td>{item.wholesalePackSize}</td>
                        <td>{item.markup}</td>
                        <td>{formatMoney(item.subtotal)}</td>
                        <td>{item.projectedBalance}</td>
                        <td>
                          <Trash2
                            className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-400"
                            onClick={() => removeFromCart(index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer Section */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <div className="text-lg font-semibold">
                Total:{" "}
                <span className="text-emerald-400">{formatMoney(totalAmount)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToStock}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg text-white font-semibold shadow-md hover:shadow-emerald-500/30 transition"
                >
                  Confirm to Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;
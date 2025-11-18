// StockPage (patched)
// Replace your existing StockPage with this file.

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { UserPlus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { Trash2, Edit3, Check, X } from "lucide-react";


// -----------------------------
// Config
// -----------------------------
const API_BASE = "http://localhost:8080";



// -----------------------------
// Helper to format money
// -----------------------------
const formatMoney = (amount) => {
  const num = Number(amount) || 0;
  return `₦${new Intl.NumberFormat("en-NG").format(num)}`;
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
  const [supplierSearch, setSupplierSearch] = useState(""); // visible supplier input
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems") || "[]")
  );

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
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editErrors, setEditErrors] = useState({});


  const wrapperRef = useRef(null);

  // Fetch suppliers & products
  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  // Initialize visible supplier name if an id exists
  useEffect(() => {
    if (selectedSupplier && suppliers.length > 0) {
      const found = suppliers.find((s) => s._id === selectedSupplier);
      if (found) setSupplierSearch(found.name);
    }
  }, [selectedSupplier, suppliers]);

  // Persist cartItems whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setTotalAmount(cartItems.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0));
  }, [cartItems]);

  // Persist selected supplier id
  useEffect(() => {
    if (selectedSupplier) localStorage.setItem("selectedSupplier", selectedSupplier);
    else localStorage.removeItem("selectedSupplier");
  }, [selectedSupplier]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setShowSupplierDropdown(false);
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/suppliers`);
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products`);
      setProducts(res.data || []);
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
        costPrice: Number(selected.costPrice) || 0,
        sellingPrice: Number(selected.sellingPrice) || 0,
        quantity: 1,
        subtotal: Number(selected.costPrice) || 0,
        currentStock: Number(selected.stockBalance) || 0,
        projectedBalance: (Number(selected.stockBalance) || 0) + 1,
        wholesalePrice: Number(selected.wholesalePrice) || 0,
        wholesalePackSize: Number(selected.wholesalePackSize) || 1,
        markup:
          selected.costPrice && selected.sellingPrice
            ? Number((((selected.sellingPrice - selected.costPrice) / selected.costPrice) * 100).toFixed(2))
            : 0,
      });
    }
  };

  const handleCurrentItemChange = (field, value) => {
    // Normalize numbers properly
    const numericFields = [
      "quantity",
      "costPrice",
      "sellingPrice",
      "wholesalePrice",
      "wholesalePackSize",
      "markup",
    ];

    const parsedValue = numericFields.includes(field) ? (value === "" ? "" : Number(value)) : value;

    const updated = { ...currentItem, [field]: parsedValue };

    // ensure numbers are numbers for calc
    const cost = Number(updated.costPrice) || 0;
    let selling = Number(updated.sellingPrice) || 0;
    let markup = Number(updated.markup) || 0;
    const qty = Number(updated.quantity) || 0;

    // If cost or selling changed, update markup
    if (field === "costPrice" || field === "sellingPrice") {
      if (cost > 0 && selling > 0) {
        updated.markup = Number((((selling - cost) / cost) * 100).toFixed(2));
        markup = updated.markup;
      } else {
        updated.markup = 0;
        markup = 0;
      }
    }

    // If markup changed, recalc selling price
    if (field === "markup") {
      selling = cost + (cost * markup) / 100;
      updated.sellingPrice = Number(selling.toFixed(2));
      // clamp wholesalePrice to new selling price
      if (Number(updated.wholesalePrice) > selling) {
        updated.wholesalePrice = Number(selling.toFixed(2));
      }
    }

    // If wholesalePrice changed, ensure it does not exceed selling
    if (field === "wholesalePrice") {
      if (Number(parsedValue) > selling) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: `Wholesale price cannot exceed Selling Price. Max allowed: ₦${selling}`,
          background: "#111827",
          color: "#f87171",
          confirmButtonColor: "#f87171",
        });
        // don't apply invalid wholesale update
        updated.wholesalePrice = currentItem.wholesalePrice;
      }
    }

    // Recalculate subtotal using selling price (fallback to cost if selling is 0)
    const priceToUse = selling > 0 ? selling : cost;
    updated.subtotal = Number((qty * priceToUse).toFixed(2));

    // Recalculate projected balance = currentStock + qty
    updated.projectedBalance = (Number(updated.currentStock) || 0) + qty;

    setCurrentItem(updated);
  };

  // Add to cart & persist
  const addToCart = () => {
    // validations
    if (!currentItem.productId) {
      return alert("Please select a product.");
    }
    if (Number(currentItem.quantity) <= 0) {
      return alert("Quantity must be at least 1.");
    }
    if (Number(currentItem.costPrice) <= 0) {
      return alert("Cost must be greater than 0.");
    }
    if (Number(currentItem.sellingPrice) <= 0) {
      return alert("Selling Price must be greater than 0.");
    }

    // Append item
    const newCart = [...cartItems, { ...currentItem }];
    setCartItems(newCart);

    // Reset current item
    setCurrentItem({
      productId: "",
      name: "",
      sku: "",
      quantity: 1,
      costPrice: 0,
      sellingPrice: 0,
      markup: 0,
      wholesalePrice: 0,
      wholesalePackSize: 1,
      subtotal: 0,
      currentStock: 0,
      projectedBalance: 0,
    });
    setFilteredProducts([]);
    setShowProductDropdown(false);
  };

  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
  };

  const confirmToStock = async () => {
    if (!selectedSupplier) return alert("Select a supplier");
    if (!referenceNumber) return alert("Enter a reference number");
    if (!cartItems.length) return alert("Add items to cart first");

    setIsSaving(true);
    try {
      const res = await axios.post(`${API_BASE}/stock/invoice/save`, {
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

      // reset UI
      setCartItems([]);
      setSelectedSupplier("");
      setReferenceNumber("");
      setTotalAmount(0);
      localStorage.removeItem("cartItems");
      localStorage.removeItem("selectedSupplier");
      setShowAddModal(false);
    } catch (err) {
      console.error("Error saving stock invoice:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save stock. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter suppliers based on search input
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes((supplierSearch || "").toLowerCase())
  );

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier._id);
    setSupplierSearch(supplier.name);
    setShowSupplierDropdown(false);
  };

  const handleEditCartItem = (index, field, value) => {
    const updated = [...cartItems];
    const item = { ...updated[index] };

    // Convert value to number where needed
    const num = parseFloat(value) || 0;

    item[field] = num;

    // Recalculate derived fields
    item.subtotal = item.quantity * item.costPrice;

    // If markup changed → update selling price
    if (field === "markup") {
      item.sellingPrice = item.costPrice + (item.costPrice * (num / 100));
    }

    // If selling price changed → update markup
    if (field === "sellingPrice" && item.costPrice > 0) {
      item.markup = ((num - item.costPrice) / item.costPrice) * 100;
    }

    // Recalculate projected balance
    item.projectedBalance = item.sellingPrice * item.quantity;

    updated[index] = item;
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditErrors({});
  };

  const handleEditField = (index, field, value) => {
    const updated = [...cartItems];
    const item = { ...updated[index] };

    const num = parseFloat(value) || 0;
    item[field] = num;

    const errors = {};

    if (field === "costPrice" || field === "sellingPrice") {
      if (item.costPrice > item.sellingPrice) {
        errors.cost = "Cost price cannot be greater than selling price";
      }
    }

    if (field === "wholesalePrice" || field === "sellingPrice") {
      if (item.wholesalePrice > item.sellingPrice) {
        errors.wholesale = "Wholesale price cannot be greater than selling price";
      }
    }

    // subtotal + projected
    item.subtotal = item.quantity * item.costPrice;
    item.projectedBalance = item.quantity * item.sellingPrice;

    updated[index] = item;
    setCartItems(updated);
    setEditErrors(errors);
  };

  const saveEdit = () => {
    if (Object.keys(editErrors).length > 0) return; // block save
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditErrors({});
  };


  return (
    <div ref={wrapperRef}>
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
          <div className="bg-gray-900 border border-gray-700 w-full h-full rounded-none shadow-2xl overflow-y-auto p-6 space-y-6 animate-fadeIn">
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
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Supplier</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search supplier..."
                  value={supplierSearch}
                  onChange={(e) => {
                    setSupplierSearch(e.target.value);
                    setShowSupplierDropdown(true);
                    setSelectedSupplier("");
                  }}
                  onFocus={() => setShowSupplierDropdown(true)}
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Reference No.</label>
                <input
                  type="text"
                  placeholder="e.g. INV-2025-001"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>

              {/* Product Search */}
              <div className="relative col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Product</label>
                <input
                  type="text"
                  placeholder="🔍 Search product..."
                  value={currentItem.name}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    const filtered = products.filter((p) => p.name.toLowerCase().includes(value));
                    setCurrentItem({ ...currentItem, name: e.target.value });
                    setFilteredProducts(filtered);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">SKU</label>
                <input
                  type="text"
                  value={currentItem.sku}
                  disabled
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-gray-400 placeholder-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => handleCurrentItemChange("quantity", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cost (₦)</label>
                <input
                  type="number"
                  min="0"
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
                  min="0"
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
                  min="0"
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
                  min="1"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold rounded-xl shadow-md hover:shadow-emerald-500/30 transition-all"
                >
                  + Add to Cart
                </button>
              </div>
            </div>

            {/* Cart Table */}
            {cartItems.length > 0 && (
              <div className="mt-8">
                <div className="rounded-xl border border-gray-700 overflow-hidden shadow-lg">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-800 text-gray-300 sticky top-0 z-10">
                      <tr className="text-sm uppercase tracking-wide">
                        <th className="px-4 py-3 text-left">S/N</th>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Cost</th>
                        <th className="px-4 py-3 text-right">Selling</th>
                        <th className="px-4 py-3 text-right">Wholesale</th>
                        <th className="px-4 py-3 text-center">Pack</th>
                        <th className="px-4 py-3 text-center">Markup %</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-center">Projected</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody className="text-gray-200">
                      {cartItems.map((item, index) => {
                        const isEditing = editingIndex === index;

                        return (
                          <tr
                            key={item.productId || index}
                            className="border-t border-gray-700 hover:bg-gray-800/70 transition-all"
                          >
                            <td className="px-4 py-3">{index + 1}</td>

                            <td className="px-4 py-3 font-medium text-emerald-300">{item.name}</td>

                            <td className="px-4 py-3">{item.sku}</td>

                            {/* Quantity */}
                            <td className="px-4 py-3 text-center">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-20 bg-gray-900 border border-gray-600 text-center rounded-md px-2 py-1"
                                  value={item.quantity}
                                  onChange={(e) => handleEditField(index, "quantity", e.target.value)}
                                />
                              ) : (
                                item.quantity
                              )}
                            </td>

                            {/* Cost */}
                            <td className="px-4 py-3 text-right">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-24 bg-gray-900 border border-gray-600 text-right rounded-md px-2 py-1"
                                  value={item.costPrice}
                                  onChange={(e) => handleEditField(index, "costPrice", e.target.value)}
                                />
                              ) : (
                                formatMoney(item.costPrice)
                              )}
                            </td>

                            {/* Selling */}
                            <td className="px-4 py-3 text-right">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-24 bg-gray-900 border border-gray-600 text-right rounded-md px-2 py-1"
                                  value={item.sellingPrice}
                                  onChange={(e) =>
                                    handleEditField(index, "sellingPrice", e.target.value)
                                  }
                                />
                              ) : (
                                formatMoney(item.sellingPrice)
                              )}
                            </td>

                            {/* Wholesale */}
                            <td className="px-4 py-3 text-right">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-24 bg-gray-900 border border-gray-600 text-right rounded-md px-2 py-1"
                                  value={item.wholesalePrice}
                                  onChange={(e) =>
                                    handleEditField(index, "wholesalePrice", e.target.value)
                                  }
                                />
                              ) : (
                                formatMoney(item.wholesalePrice)
                              )}
                            </td>

                            {/* Pack */}
                            <td className="px-4 py-3 text-center">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-16 bg-gray-900 border border-gray-600 text-center rounded-md px-2 py-1"
                                  value={item.wholesalePackSize}
                                  onChange={(e) =>
                                    handleEditField(index, "wholesalePackSize", e.target.value)
                                  }
                                />
                              ) : (
                                item.wholesalePackSize
                              )}
                            </td>

                            {/* Markup */}
                            <td className="px-4 py-3 text-center">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-16 bg-gray-900 border border-gray-600 text-center rounded-md px-2 py-1"
                                  value={item.markup}
                                  onChange={(e) => handleEditField(index, "markup", e.target.value)}
                                />
                              ) : (
                                `${item.markup}%`
                              )}
                            </td>

                            {/* Subtotal */}
                            <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                              {formatMoney(item.subtotal)}
                            </td>

                            {/* Projected */}
                            <td className="px-4 py-3 text-center">{item.projectedBalance}</td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-center">
                              {!isEditing ? (
                                <button
                                  onClick={() => startEditing(index)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  Edit
                                </button>
                              ) : (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={saveEdit}
                                    disabled={Object.keys(editErrors).length > 0}
                                    className={`px-3 py-1 rounded ${Object.keys(editErrors).length > 0
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-500"
                                      }`}
                                  >
                                    Save
                                  </button>

                                  <button
                                    onClick={cancelEdit}
                                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-500"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}

                              {/* Error messages */}
                              {Object.keys(editErrors).length > 0 && isEditing && (
                                <div className="text-red-400 text-xs mt-1">
                                  {editErrors.cost && <div>{editErrors.cost}</div>}
                                  {editErrors.wholesale && <div>{editErrors.wholesale}</div>}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Footer Section */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <div className="text-lg font-semibold">
                Total: <span className="text-emerald-400">{formatMoney(totalAmount)}</span>
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
                  disabled={isSaving}
                  className={`px-5 py-2 ${isSaving ? "opacity-60 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                    } rounded-lg text-white font-semibold shadow-md hover:shadow-emerald-500/30 transition`}
                >
                  {isSaving ? "Saving..." : "Confirm to Stock"}
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

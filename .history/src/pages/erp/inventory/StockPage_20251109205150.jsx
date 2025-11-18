import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

// -----------------------------
// Helper to format money
// -----------------------------
const formatMoney = (amount) =>
  `₦${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

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

const StockPage = () => {
  // -----------------------------
  // State
  // -----------------------------
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(
    localStorage.getItem("selectedSupplier") || ""
  );
  const [supplierSearch, setSupplierSearch] = useState("");
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const [currentItem, setCurrentItem] = useState({
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // -----------------------------
  // Pagination State
  // -----------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalPages = Math.ceil(cartItems.length / rowsPerPage);

  const paginatedItems = cartItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset to first page
  };

  // -----------------------------
  // Fetch suppliers & products
  // -----------------------------
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

  // -----------------------------
  // Product & Supplier Handlers
  // -----------------------------
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
    const updatedItem = { ...currentItem };
    updatedItem[field] =
      field === "quantity" || field === "costPrice" ? Number(value) : value;

    if (field === "quantity" || field === "costPrice") {
      updatedItem.subtotal = updatedItem.quantity * updatedItem.costPrice;
      updatedItem.projectedBalance =
        (updatedItem.currentStock || 0) + updatedItem.quantity;
    }

    setCurrentItem(updatedItem);
  };

  const addToCart = () => {
    if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.costPrice <= 0) {
      return alert("Please select a valid product and enter all required fields.");
    }
    const newCart = [...cartItems, { ...currentItem }];
    setCartItems(newCart);
    localStorage.setItem("cartItems", JSON.stringify(newCart));

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
      await axios.post("http://localhost:8080/stock/invoice/save", {
        supplierId: selectedSupplier,
        items: cartItems,
        totalAmount,
        referenceNumber,
      });

      Swal.fire({
        title: "✅ Stock Added Successfully!",
        html: `<p><strong>Reference Number:</strong> <span style="color:#10b981;">${referenceNumber}</span></p>
               <p>Total Amount: <strong style="color:#10b981;">${formatMoney(totalAmount)}</strong></p>`,
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

            {/* Supplier & Product Form */}
            {/* ... your existing supplier/product input code here remains unchanged */}

            {/* Cart Table with Pagination */}
            {cartItems.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mb-2">
                  <div>
                    Rows per page:{" "}
                    <select
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      className="bg-gray-800 text-gray-200 px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {[5, 10, 15, 20, 50].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-gray-200">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-700 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
                        }`}
                    >
                      Prev
                    </button>
                    <span>
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-500"
                        }`}
                    >
                      Next
                    </button>
                  </div>
                </div>

                <table className="w-full text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-800 text-gray-400">
                    <tr>
                      <th className="px-4 py-2">S/N</th>
                      <th className="px-4 py-2">Product</th>
                      <th className="px-4 py-2">SKU</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">Cost</th>
                      <th className="px-4 py-2">Selling</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Projected Balance</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/60">
                        <td className="px-4 py-2 text-gray-400">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.sku}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">{formatMoney(item.costPrice)}</td>
                        <td className="px-4 py-2">{formatMoney(item.sellingPrice)}</td>
                        <td className="px-4 py-2">{formatMoney(item.subtotal)}</td>
                        <td className="px-4 py-2">{item.projectedBalance}</td>
                        <td className="px-4 py-2 text-center">
                          <Trash2
                            className="w-4 h-4 text-red-500 cursor-pointer inline-block hover:text-red-400"
                            onClick={() => removeFromCart(index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
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

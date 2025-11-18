import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Plus } from "lucide-react";

// -----------------------------
// UI Components
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
// Transfers / Stock Table Page
// -----------------------------
const TransfersPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newStock, setNewStock] = useState({
    name: "",
    sku: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    location: "Main",
  });

  // Fetch stocks from backend
  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/stock/balance");
      setStocks(res.data);
    } catch (err) {
      console.error("Error fetching stocks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleDelete = async (sku) => {
    try {
      await axios.delete(`http://localhost:8080/stock/${sku}`);
      setStocks(stocks.filter((s) => s.sku !== sku));
    } catch (err) {
      console.error("Error deleting stock:", err);
    }
  };

  const handleAddStock = async () => {
    try {
      const res = await axios.post("http://localhost:8080/stock", newStock);
      setStocks([res.data.data, ...stocks]);
      setShowModal(false);
      setNewStock({ name: "", sku: "", quantity: 0, costPrice: 0, sellingPrice: 0, location: "Main" });
    } catch (err) {
      console.error("Error adding stock:", err);
    }
  };

  if (loading)
    return (
      <p className="text-gray-300 text-center py-8">
        Loading stocks...
      </p>
    );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-emerald-400">Stock Inventory</h2>
        {/* <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Stock
        </Button> */}
      </div>

      {/* Stock Table */}
      <Card>
        <CardContent>
          <table className="min-w-full text-gray-300">
            <thead className="border-b border-gray-700 text-gray-400 text-xs uppercase">
              <tr>
                <th className="py-3 text-left">Item</th>
                <th className="py-3 text-left">SKU</th>
                <th className="py-3 text-left">Location</th>
                <th className="py-3 text-left">Quantity in Stock</th>
                <th className="py-3 text-left">Cost Price</th>
                <th className="py-3 text-left">Selling Price</th>
                {/* <th className="py-3 text-center">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {stocks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">
                    No stock items found.
                  </td>
                </tr>
              ) : (
                stocks.map((s) => (
                  <tr key={s._id} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="py-3">{s.productName}</td>
                    <td className="py-3">{s.sku}</td>
                    <td className="py-3">{s.location}</td>
                    <td className="py-3">{s.quantityInStock}</td>
                    <td className="py-3">
                      {s.costPrice.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                    </td>
                    <td className="py-3">
                      {s.sellingPrice.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                    </td>
                    {/* <td className="py-3 flex justify-center gap-3">
                      <Edit2 className="w-4 h-4 text-blue-400 cursor-pointer" />
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(s.sku)}
                      />
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-emerald-400 mb-4">Add New Stock</h3>
            <div className="flex flex-col gap-3">
              <input
                className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
                placeholder="Product Name"
                value={newStock.name}
                onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
              />
              <input
                className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
                placeholder="SKU"
                value={newStock.sku}
                onChange={(e) => setNewStock({ ...newStock, sku: e.target.value })}
              />
              <input
                type="number"
                className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
                placeholder="Quantity"
                value={newStock.quantity}
                onChange={(e) => setNewStock({ ...newStock, quantity: Number(e.target.value) })}
              />
              <input
                type="number"
                className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
                placeholder="Cost Price"
                value={newStock.costPrice}
                onChange={(e) => setNewStock({ ...newStock, costPrice: Number(e.target.value) })}
              />
              <input
                type="number"
                className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
                placeholder="Selling Price"
                value={newStock.sellingPrice}
                onChange={(e) => setNewStock({ ...newStock, sellingPrice: Number(e.target.value) })}
              />
              <input
                className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
                placeholder="Location"
                value={newStock.location}
                onChange={(e) => setNewStock({ ...newStock, location: e.target.value })}
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button className="bg-gray-600 hover:bg-gray-700" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleAddStock}>
                  Save Stock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransfersPage;

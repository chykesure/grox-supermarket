import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = "http://localhost:8080/api"; // ✅ change if your backend runs elsewhere

  // Fetch all products & discounts
  useEffect(() => {
    fetchProducts();
    fetchDiscounts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/discounts`);
      setDiscounts(res.data);
    } catch (err) {
      toast.error("Failed to load discounts");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.discount) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (formData.discount > 100 || formData.discount <= 0) {
      toast.error("Discount must be between 1 and 100%");
      return;
    }

    try {
      setSubmitting(true);
      if (editItem) {
        // Update existing
        await axios.put(`${API_BASE}/discounts/${editItem._id}`, formData);
        toast.success("Discount updated successfully!");
      } else {
        // Add new
        await axios.post(`${API_BASE}/discounts`, formData);
        toast.success("Discount added successfully!");
      }

      fetchDiscounts();
      setFormData({ productId: "", discount: "", startDate: "", endDate: "" });
      setEditItem(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      productId: item.productId._id,
      discount: item.discount,
      startDate: item.startDate?.split("T")[0],
      endDate: item.endDate?.split("T")[0],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;
    try {
      await axios.delete(`${API_BASE}/discounts/${id}`);
      toast.info("Discount deleted");
      fetchDiscounts();
    } catch (err) {
      toast.error("Failed to delete discount");
    }
  };

  const getStatus = (endDate) => {
    const today = new Date();
    return new Date(endDate) >= today ? "Active" : "Expired";
  };

  const filteredDiscounts = discounts.filter((d) => {
    const name = d.productId?.name?.toLowerCase() || "";
    const sku = d.productId?.sku?.toLowerCase() || "";
    return name.includes(search.toLowerCase()) || sku.includes(search.toLowerCase());
  });

  return (
    <div className="text-gray-200">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-2">Product Discounts</h2>
      <p className="text-gray-400 mb-6">Manage discounts for products.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-md text-center">
          <h4 className="text-sm text-gray-400">Total Discounts</h4>
          <p className="text-xl font-semibold">{discounts.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-md text-center">
          <h4 className="text-sm text-gray-400">Active</h4>
          <p className="text-xl font-semibold">
            {discounts.filter((d) => getStatus(d.endDate) === "Active").length}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-md text-center">
          <h4 className="text-sm text-gray-400">Expired</h4>
          <p className="text-xl font-semibold">
            {discounts.filter((d) => getStatus(d.endDate) === "Expired").length}
          </p>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-3">
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="discount"
            placeholder="Discount %"
            value={formData.discount}
            onChange={handleChange}
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          />

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          />

          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-md text-white transition ${submitting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
          >
            {submitting ? "Saving..." : editItem ? "Update" : "Apply"}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search product or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 w-1/3"
        />
      </div>

      {/* Discounts Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 rounded-md text-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Discount %</th>
              <th className="px-4 py-2">Start</th>
              <th className="px-4 py-2">End</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filteredDiscounts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  No discounts found
                </td>
              </tr>
            ) : (
              filteredDiscounts.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-700 hover:bg-gray-800/40 transition"
                >
                  <td className="px-4 py-2">{item.productId?.name}</td>
                  <td className="px-4 py-2">{item.productId?.sku}</td>
                  <td className="px-4 py-2">{item.discount}%</td>
                  <td className="px-4 py-2">{item.startDate?.split("T")[0]}</td>
                  <td className="px-4 py-2">{item.endDate?.split("T")[0]}</td>
                  <td className="px-4 py-2">
                    {getStatus(item.endDate) === "Active" ? (
                      <span className="px-2 py-1 bg-green-600 text-xs rounded">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-600 text-xs rounded">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-500 flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-2 py-1 bg-red-600 rounded hover:bg-red-500 flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Discounts;

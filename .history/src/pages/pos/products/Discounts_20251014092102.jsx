import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    // Mock product data
    setProducts(["Product A", "Product B", "Product C"]);
    // Mock existing discounts
    setDiscounts([
      {
        id: 1,
        product: "Product A",
        discount: 15,
        startDate: "2025-10-01",
        endDate: "2025-10-30",
      },
    ]);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.product || !formData.discount) {
      toast.error("Please fill all required fields!");
      return;
    }
    if (formData.discount > 100 || formData.discount <= 0) {
      toast.error("Discount must be between 1 and 100%");
      return;
    }

    const newDiscount = {
      id: Date.now(),
      ...formData,
    };

    setDiscounts([...discounts, newDiscount]);
    setFormData({ product: "", discount: "", startDate: "", endDate: "" });
    toast.success("Discount added successfully!");
  };

  const handleDelete = (id) => {
    setDiscounts(discounts.filter((d) => d.id !== id));
    toast.info("Discount deleted");
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      product: item.product,
      discount: item.discount,
      startDate: item.startDate,
      endDate: item.endDate,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setDiscounts(
      discounts.map((d) =>
        d.id === editItem.id ? { ...d, ...formData } : d
      )
    );
    toast.success("Discount updated!");
    setEditItem(null);
    setFormData({ product: "", discount: "", startDate: "", endDate: "" });
  };

  const filteredDiscounts = discounts.filter((d) =>
    d.product.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (endDate) => {
    const today = new Date();
    return new Date(endDate) >= today ? "Active" : "Expired";
  };

  return (
    <div className="text-gray-200">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Product Discounts</h2>
      <p className="text-gray-400 mb-6">
        Manage discounts for products.
      </p>

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
        <form
          onSubmit={editItem ? handleUpdate : handleSubmit}
          className="grid grid-cols-5 gap-3"
        >
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200"
          >
            <option value="">Select Product</option>
            {products.map((p, i) => (
              <option key={i} value={p}>
                {p}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            {editItem ? "Update" : "Apply"}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 w-1/3"
        />
      </div>

      {/* Discounts Table */}
      <table className="w-full border border-gray-700 rounded-md text-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2">Discount %</th>
            <th className="px-4 py-2">Start</th>
            <th className="px-4 py-2">End</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDiscounts.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-700 hover:bg-gray-800/40 transition"
            >
              <td className="px-4 py-2">{item.product}</td>
              <td className="px-4 py-2">{item.discount}%</td>
              <td className="px-4 py-2">{item.startDate}</td>
              <td className="px-4 py-2">{item.endDate}</td>
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
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 bg-red-600 rounded hover:bg-red-500 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Discounts;

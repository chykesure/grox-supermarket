// src/pages/pos/sales/ScanItems.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";



function ScanItems() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [cashTendered, setCashTendered] = useState(0);
  const [lastInvoice, setLastInvoice] = useState(null); // <-- New state
  const barcodeInputRef = useRef(null);

  const subtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const change = cashTendered - subtotal;
  const navigate = useNavigate();

  // Current state initialization (good)
  const [cashierName, setCashierName] = useState(() => {
    return localStorage.getItem("username") || "Walk-in";
  });

  // Update cashierName if localStorage changes (optional)
  useEffect(() => {
    const handleStorageChange = () => {
      const username = localStorage.getItem("username") || "Walk-in";
      setCashierName(username);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);




  // Auto-update cashTendered when subtotal changes
  useEffect(() => {
    setCashTendered(subtotal);
  }, [subtotal]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products-with-stock");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("❌ Failed to load products", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Persist Cart in localStorage
  const isFirstLoad = useRef(true);
  useEffect(() => {
    const savedCart = localStorage.getItem("posCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    localStorage.setItem("posCart", JSON.stringify(cart));
  }, [cart]);


  const applyWholesaleLogic = (product, qty) => {
    if (qty >= product.wholesalePack) {
      return product.wholesalePrice;   // wholesale price
    }
    return product.sellingPrice;       // normal price
  };

  // Cart operations
  const addToCart = (product) => {
  if (product.stock <= 0) {
    toast.warn(`⚠️ ${product.name} is out of stock`);
    return;
  }

  const existing = cart.find((item) => item._id === product._id);

  if (existing) {
    const newQty = existing.quantity + 1;

    if (newQty > product.stock) {
      toast.warn(`⚠️ Only ${product.stock} in stock`);
      return;
    }

    const updatedPrice = applyWholesaleLogic(product, newQty);

    setCart(
      cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: newQty, sellingPrice: updatedPrice }
          : item
      )
    );
  } else {
    // First add to cart → quantity = 1
    const updatedPrice = applyWholesaleLogic(product, 1);

    setCart([
      ...cart,
      { ...product, quantity: 1, sellingPrice: updatedPrice },
    ]);
  }
};



  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    if (qty < 1) return;
    if (qty > product.stock) {
      toast.warn(`⚠️ Only ${product.stock} in stock`);
      qty = product.stock;
    }

    const updatedPrice = applyWholesaleLogic(product, qty);

    setCart(
      cart.map((item) =>
        item._id === productId
          ? { ...item, quantity: qty, sellingPrice: updatedPrice }
          : item
      )
    );
  };


  // Barcode handling
  const handleBarcodeEnter = (e) => {
    if (e.key === "Enter") {
      const product = products.find((p) => p.sku === barcode);
      if (product) {
        addToCart(product);
        setBarcode("");
      } else {
        toast.error("❌ Product not found");
      }
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return toast.warn("⚠️ Cart is empty");
    if (paymentMode === "Cash" && cashTendered < subtotal) {
      return toast.warn("⚠️ Cash tendered is less than total");
    }
    // --- In handleCheckout(), instead of using state, always get cashier from localStorage ---
    const cashier = localStorage.getItem("username");
    console.log("Cashier from localStorage:", localStorage.getItem("username"));

    const payload = {
      cashier, // now guaranteed to have a value
      paymentMode,
      items: cart.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.sellingPrice,
        subtotal: Number(item.sellingPrice) * Number(item.quantity),
      })),
      total: subtotal,
    };

    console.log("Checkout payload:", payload);

    try {
      const res = await axios.post("http://localhost:8080/api/sales", payload);

      setLastInvoice(res.data.invoiceNumber);

      toast.success(`✅ Sale recorded! Invoice: ${res.data.invoiceNumber}`);

      setTimeout(() => {
        navigate(`/sales/receipt`, { state: { invoiceNumber: res.data.invoiceNumber } });
      }, 1500);

      setCart([]);
      setPaymentMode("Cash");
      setCashTendered(0);
      localStorage.removeItem("posCart");
      barcodeInputRef.current.focus();

      fetchProducts();
      console.log("Sale Response:", res.data);
    } catch (err) {
      console.error("Checkout error:", err);
      const msg = err.response?.data?.message || "Failed to record sale";
      toast.error(`❌ ${msg}`);
    }
  };

  // Icons
  const PlusIcon = () => <span className="text-green-400">+</span>;
  const MinusIcon = () => <span className="text-yellow-400">-</span>;
  const TrashIcon = () => <span className="text-red-500">🗑️</span>;
  const CashIcon = () => <span className="text-green-300">💵</span>;

  // Filtered products
  const filteredProducts = products.filter(p =>
    (barcode ? p.sku.includes(barcode) : true) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format money
  const formatMoney = (amount) => new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2
  }).format(amount);

  // JSX
  return (
    <div className="flex flex-col bg-gray-900 text-gray-100 h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-gray-800 shadow-sm">
        <div className="font-semibold">Transaction #: <span className="text-blue-400">000123</span></div>
        <div className="text-gray-400">{new Date().toLocaleString()}</div>
        <div>
          Cashier: <span className="text-yellow-400">{cashierName}</span>
        </div>
        <div>Customer: <span className="text-yellow-400">Walk-in</span></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Products */}
        <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2"><CashIcon /> Scan / Search Product</h2>
          <input
            ref={barcodeInputRef}
            type="text"
            placeholder="Scan Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleBarcodeEnter}
            className="w-full mb-2 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Search Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <h3 className="font-semibold mb-2 text-gray-300">Products</h3>
          <ul className="space-y-2">
            {filteredProducts.map(product => (
              <li
                key={product._id}
                className="p-2 bg-gray-700 rounded flex justify-between items-center hover:bg-gray-600 cursor-pointer transition"
                onClick={() => addToCart(product)}
              >
                {/* LEFT SECTION */}
                <div className="flex flex-col">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-400">Stock: {product.stock}</span>
                  <span className="text-sm text-blue-300">
                    Wholesale: {formatMoney(product.wholesalePrice)}
                  </span>
                  <span className="text-sm text-yellow-300">
                    Pack: {product.wholesalePack}
                  </span>
                </div>

                {/* RIGHT SECTION (Existing) */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{formatMoney(product.sellingPrice)}</span>
                  <PlusIcon />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Center Panel - Cart */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2"><CashIcon /> Cart</h2>
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Cart is empty</div>
          ) : (
            <div className="bg-gray-800 rounded shadow p-2 space-y-2">
              <div className="grid grid-cols-5 font-semibold border-b border-gray-700 p-2 text-gray-300">
                <span>Name</span>
                <span>Unit Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span>Action</span>
              </div>
              {cart.map(item => (
                <div key={item._id} className="grid grid-cols-5 items-center border-b border-gray-700 p-2 hover:bg-gray-700 rounded transition">
                  <div>{item.name}</div>
                  <div>{formatMoney(item.sellingPrice)}</div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><MinusIcon /></button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      className="w-12 p-1 text-center rounded bg-gray-700 border border-gray-600"
                    />
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><PlusIcon /></button>
                  </div>
                  <div>{formatMoney(item.sellingPrice * item.quantity)}</div>
                  <div><button onClick={() => removeFromCart(item._id)}><TrashIcon /></button></div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 p-4 bg-gray-700 rounded shadow flex justify-between font-bold text-lg text-green-400">
            <span>Total:</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
        </div>

        {/* Right Panel - Payment */}
        <div className="w-1/4 p-4 border-l border-gray-700 flex flex-col justify-between bg-gray-800">
          <div className="space-y-2">
            {/* Last Invoice Display */}
            {lastInvoice && (
              <div className="mb-2 p-2 bg-gray-700 text-yellow-400 rounded">
                Last Invoice: <span className="font-bold">{lastInvoice}</span>
              </div>
            )}

            <label className="block">Mode of Payment</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            {paymentMode === "Cash" && (
              <>
                <label className="block">Cash Tendered</label>
                <input
                  type="text"
                  value={cashTendered.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 2,
                  })}
                  onChange={(e) => {
                    const numericValue = parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
                    setCashTendered(numericValue);
                  }}
                  placeholder="₦0"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                />

                <label className="block">Change</label>
                <input
                  type="number"
                  value={change > 0 ? change : 0}
                  placeholder="₦0"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  disabled
                />
              </>
            )}

            <div className="mt-4 space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-semibold flex items-center justify-center gap-2"
              >
                <CashIcon /> Confirm Payment
              </button>
              <button
                onClick={() => {
                  setCart([]);
                  setCashTendered(0);
                  localStorage.removeItem("posCart");
                }}
                className="w-full bg-red-600 hover:bg-red-500 py-2 rounded font-semibold flex items-center justify-center gap-2"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanItems;

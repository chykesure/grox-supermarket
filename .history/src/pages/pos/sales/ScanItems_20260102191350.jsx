// src/pages/pos/sales/ScanItems.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaPauseCircle, FaShoppingBasket, FaPlayCircle } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid"; // top of file



function ScanItems() {
  // ----- State -----
  const [products, setProducts] = useState([]);
  const productsRef = useRef([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [cashTendered, setCashTendered] = useState(0);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [cashierName, setCashierName] = useState(() => localStorage.getItem("username") || "Walk-in");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // =============================
  // Pending Cart States
  // =============================
  const [pendingCarts, setPendingCarts] = useState(() => {
    const saved = localStorage.getItem("pendingCarts");
    return saved ? JSON.parse(saved) : [];
  });
  // Save pending carts to localStorage
  const savePendingCarts = (updated) => {
    localStorage.setItem("pendingCarts", JSON.stringify(updated));
    setPendingCarts(updated);
  };
  // Generate a unique ID for the pending cart
  const generatePendingId = () => {
    return "PEND-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  };


  // =============================
  // SUSPEND CURRENT CART
  // =============================
  const suspendCart = () => {
    if (cart.length === 0) {
      Swal.fire("Empty Cart", "There is no cart to suspend.", "warning");
      return;
    }

    const pendingId = generatePendingId();

    const newPending = {
      id: pendingId,
      items: cart,
      subtotal,
      createdAt: new Date().toISOString(),
    };

    const updated = [...pendingCarts, newPending];
    savePendingCarts(updated);

    // Clear current cart
    setCart([]);
    localStorage.removeItem("cart");

    Swal.fire("Cart Suspended", `Saved as ${pendingId}`, "success");
  };

  // =============================
  // RESUME A PENDING CART
  // =============================
  const resumeCart = (pendingId) => {
    const found = pendingCarts.find((p) => p.id === pendingId);
    if (!found) return;

    // Load items back to cart
    setCart(found.items);
    localStorage.setItem("cart", JSON.stringify(found.items));

    // Remove from pending list
    const updated = pendingCarts.filter((p) => p.id !== pendingId);
    savePendingCarts(updated);

    Swal.fire("Cart Restored", `${pendingId} is now active.`, "success");
  };


  const navigate = useNavigate();

  // ----- Product lookup map for O(1) searches -----
  const productMap = useRef(new Map());

  useEffect(() => {
    const map = new Map();
    products.forEach(p => map.set(String(p.sku).trim(), p));
    productMap.current = map;
  }, [products]); // runs whenever products array changes


  // ----- Scanner input ref -----
  const barcodeInputRef = useRef(null);

  // ----- Derived totals -----
  const subtotal = cart.reduce((sum, item) => {
    let total = 0;
    if (item.type === "wholesale") {
      const packTotal = (item.quantity || 0) * item.sellingPrice;
      const leftover = (item.quantity || 0) - ((item.quantity || 0) * (item.wholesalePack || 0));
      const leftoverTotal = leftover > 0 ? leftover * (item.sellingPricePerPiece || (item.sellingPrice / item.wholesalePack)) : 0;
      total = packTotal + leftoverTotal;
    } else {
      total = (item.quantity || 0) * item.sellingPrice;
    }
    return sum + total;
  }, 0);


  const change = cashTendered - subtotal;

  // ✅ Fixed missing variable
  const totalItemsInCart = cart.reduce((s, it) => s + (it.quantity || 0), 0);

  // ----- Keep refs in sync -----
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  // ----- Fetch products -----
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products-with-stock");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("❌ Failed to load products", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ----- Persist cart in localStorage -----
  const isFirstLoad = useRef(true);
  useEffect(() => {
    const saved = localStorage.getItem("posCart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    localStorage.setItem("posCart", JSON.stringify(cart));
  }, [cart]);

  // ----- Keep cashier name in sync with localStorage changes (other tabs) -----
  useEffect(() => {
    const handleStorageChange = () => {
      setCashierName(localStorage.getItem("username") || "Walk-in");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ----- Auto-focus helper -----
  useEffect(() => {
    barcodeInputRef.current?.focus();
    const iv = setInterval(() => {
      if (!document.activeElement || document.activeElement === document.body) {
        barcodeInputRef.current?.focus();
      }
    }, 800);
    return () => clearInterval(iv);
  }, []);

  // ----- SweetAlert -----
  const fastSwal = Swal.mixin({
    showClass: { popup: "" },
    hideClass: { popup: "" },
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: true,
    focusConfirm: false,
  });

  // ----- Add to cart helper -----
  const addProductToCart = (product, { quantity = 1, packCount = 0, type = "retail", sellingPriceOverride } = {}) => {
    if (!product) return;
    if (product.stock <= 0) {
      toast.warn(`⚠️ ${product.name} is out of stock`);
      return;
    }

    const finalQuantity = Math.min(quantity, product.stock);

    const entry = {
      ...product,
      quantity: finalQuantity,
      packCount,
      type,
      sellingPrice: typeof sellingPriceOverride !== "undefined" ? sellingPriceOverride : (type === "wholesale" ? product.wholesalePrice : product.sellingPrice),
      sellingPricePerPiece: product.sellingPricePerPiece || (product.sellingPrice && product.wholesalePack ? product.sellingPrice / product.wholesalePack : product.sellingPrice),
    };

    setCart(prev => [entry, ...prev]);
  };

  // ----- SweetAlert wrapper for wholesale/retail selection -----
  const addToCartWithSweetAlert = async (product) => {
    if (!product || product.stock <= 0) {
      toast.warn(`⚠️ ${product?.name || "Product"} is out of stock`);
      return;
    }

    let chooseWholesale = false;

    if (product.wholesalePack && product.wholesalePack > 0) {
      const result = await fastSwal.fire({
        title: `Select Price Type`,
        text: `${product.name}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `Wholesale`,
        cancelButtonText: `Retail`,
        reverseButtons: true,
      });
      chooseWholesale = result.isConfirmed;
    }

    if (chooseWholesale) {
      const { value: packInput } = await fastSwal.fire({
        title: `Enter number of packs`,
        input: "number",
        inputLabel: `Pack size: ${product.wholesalePack}`,
        inputValue: 1,
        showCancelButton: true,
        inputAttributes: { min: 1 },
      });

      if (!packInput) return;

      const packCount = parseInt(packInput, 10) || 1;
      const qty = packCount * product.wholesalePack;
      if (qty > product.stock) {
        toast.warn(`⚠️ Only ${product.stock} pieces available`);
        return;
      }

      addProductToCart(product, {
        quantity: qty,
        packCount,
        type: "wholesale",
        sellingPriceOverride: product.wholesalePrice,
      });
    } else {
      const { value: pcs } = await fastSwal.fire({
        title: `Enter number of pieces`,
        input: "number",
        inputLabel: `Available Stock: ${product.stock}`,
        inputValue: 1,
        showCancelButton: true,
        inputAttributes: { min: 1, max: product.stock },
      });

      if (!pcs) return;

      const qty = parseInt(pcs, 10) || 1;
      addProductToCart(product, { quantity: qty, packCount: 0, type: "retail" });
    }
  };

  // ----- Remove / Update helpers -----
  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i._id !== productId));

  const updateQuantity = (productId, quantity, packCount = 0, type = "retail") => {
    setCart(prev =>
      prev.map(item => {
        if (item._id !== productId) return item;
        const product = productsRef.current.find(p => p._id === productId) || item;
        let q = quantity;
        if (q < 1) q = 1;
        if (q > product.stock) {
          toast.warn(`⚠️ Only ${product.stock} in stock`);
          q = product.stock;
        }

        const newPackCount = product.wholesalePack ? Math.floor(q / product.wholesalePack) : 0;
        return { ...item, quantity: q, packCount: newPackCount, type };
      })
    );
  };


  // ----- Manual add (optimized) -----
  const handleManualAdd = (codeArg) => {
    const code = (typeof codeArg !== "undefined" ? codeArg : manualBarcode || "").trim();
    if (!code) {
      setManualBarcode("");
      barcodeInputRef.current?.focus();
      return toast.warn("Enter barcode");
    }

    // Use productMap for O(1) lookup
    const found = productMap.current.get(code);

    if (found) {
      // Directly call modal without timeout
      addToCartWithSweetAlert(found);
    } else {
      toast.error("❌ Product not found");
    }

    setManualBarcode("");
    if (barcodeInputRef.current) barcodeInputRef.current.value = "";
  };


  // ----- Checkout -----
  const handleCheckout = async () => {
    if (cart.length === 0) return toast.warn("⚠️ Cart is empty");
    if (isCheckingOut) return; // prevents double-click
    if (paymentMode === "Cash" && cashTendered < subtotal) return toast.warn("⚠️ Cash tendered is less than total");

    setIsCheckingOut(true); // lock checkout
    const cashier = localStorage.getItem("username") || "Walk-in";
    const transactionId = uuidv4(); // unique ID for this checkout attempt

    const payload = {
      transactionId, // new field
      cashier,
      paymentMode,
      items: cart.map(item => {
        if (item.type === "wholesale") {
          const quantityInPieces = (item.packCount || 0) * (item.wholesalePack || 0);
          const leftover = (item.quantity || 0) - quantityInPieces;
          return {
            productId: item._id,
            quantity: quantityInPieces + (leftover > 0 ? leftover : 0),
            price: item.sellingPrice,
            subtotal: (item.packCount || 0) * item.sellingPrice + (leftover > 0 ? leftover * (item.sellingPricePerPiece || item.sellingPrice / item.wholesalePack) : 0),
            type: "wholesale",
            packCount: item.packCount,
            leftoverQty: leftover,
            pricePerPiece: item.sellingPricePerPiece || (item.sellingPrice / item.wholesalePack),
          };
        } else {
          return {
            productId: item._id,
            quantity: item.quantity,
            price: item.sellingPrice,
            subtotal: (item.quantity || 0) * item.sellingPrice,
            type: "retail",
          };
        }
      }),
      total: subtotal,
    };

    try {
      const res = await axios.post("http://localhost:8080/api/sales", payload);

      setLastInvoice(res.data.invoiceNumber);
      toast.success(`✅ Sale recorded! Invoice: ${res.data.invoiceNumber}`);

      // clear cart
      setCart([]);
      setPaymentMode("Cash");
      setCashTendered(0);
      localStorage.removeItem("posCart");
      barcodeInputRef.current?.focus();
      fetchProducts();

      setTimeout(() => {
        navigate(`/sales/receipt`, { state: { invoiceNumber: res.data.invoiceNumber } });
      }, 400);
    } catch (err) {
      if (err.response?.status === 409) {
        // duplicate transaction detected
        toast.warn(`⚠️ Sale already recorded! Invoice: ${err.response.data.invoiceNumber}`);
      } else {
        const msg = err.response?.data?.message || "Failed to record sale";
        toast.error(`❌ ${msg}`);
      }
    } finally {
      setIsCheckingOut(false); // unlock checkout
    }
  };

  // ----- Filtering & format -----
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const formatMoney = (amount) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 }).format(amount || 0);

  useEffect(() => {
    if (paymentMode === "Cash") {
      setCashTendered(subtotal);
    }
  }, [subtotal, paymentMode]);

  // ----- Icons -----
  const PlusIcon = () => <span className="text-green-400">+</span>;
  const TrashIcon = () => <span className="text-red-500">🗑️</span>;
  const CashIcon = () => <span className="text-green-300">💵</span>;

  return (
    <div className="flex flex-col bg-gray-900 text-gray-100 h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-gray-800 shadow-sm">
        <div className="text-gray-400">{new Date().toLocaleString()}</div>
        <div>
          Cashier: <span className="text-yellow-400">{cashierName}</span>
        </div>
        <div>
          Customer: <span className="text-yellow-400">Walk-in</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Products */}
        <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
            <CashIcon /> Scan / Search Product
          </h2>

          {/* Manual barcode input (optional) */}
          <div className="flex gap-2 mb-2">
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Scan barcode or type then press Enter"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.code === "Enter") {
                  // If user presses Enter while focused here, handle immediately
                  e.preventDefault();
                  handleManualAdd();
                }
              }}
              className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleManualAdd()}
              className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500"
            >
              Add
            </button>
          </div>

          <input
            type="text"
            placeholder="Search Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />

          <h3 className="font-semibold mb-2 text-gray-300">Products</h3>
          <ul className="space-y-2">
            {filteredProducts.map((product) => (
              <li
                key={product._id}
                className="p-2 bg-gray-700 rounded flex justify-between items-center hover:bg-gray-600 cursor-pointer transition"
                onClick={() => addToCartWithSweetAlert(product)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-400">Stock: {product.stock}</span>
                  <span className="text-sm text-blue-300">Wholesale: {formatMoney(product.wholesalePrice)}</span>
                  <span className="text-sm text-yellow-300">Pack: {product.wholesalePack}</span>
                </div>
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
          <h2 className="text-xl font-bold mb-2 text-blue-400 flex items-center gap-2">
            <CashIcon /> Cart
            {cart.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold">
                {cart.length} item{cart.length > 1 ? "s" : ""}
              </span>
            )}
          </h2>
          <div className="mt-4 p-4 bg-gray-700 rounded shadow flex justify-between font-bold text-lg text-green-400">
            <span>Total ({totalItemsInCart} pcs):</span>
            <span>{formatMoney(subtotal)}</span>
          </div>

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
              {cart.map((item) => (
                <div
                  key={item._id + "-" + Math.random().toString(36).slice(2, 7)} // safe key if multiple same product entries
                  className="grid grid-cols-5 items-center border-b border-gray-700 p-2 hover:bg-gray-700 rounded transition"
                >
                  <div>
                    {item.name}
                    <div className="text-xs text-yellow-300">
                      {item.type === "wholesale" ? `Wholesale (${item.packCount} pack${item.packCount > 1 ? "s" : ""})` : "Retail"}
                    </div>
                  </div>
                  <div>{formatMoney(item.sellingPrice)}</div>

                  {/* Quantity column */}
                  <div>
                    <button
                      onClick={async () => {
                        const { value: quantityType } = await Swal.fire({
                          title: `Update quantity for ${item.name}`,
                          input: "radio",
                          inputOptions: {
                            retail: "Retail",
                            wholesale: `Wholesale (${item.wholesalePack} pcs/pack)`,
                          },
                          inputValidator: (value) => (value ? null : "You need to choose one"),
                        });

                        if (!quantityType) return;

                        let newQty = 1;
                        let newPackCount = 0;

                        if (quantityType === "wholesale") {
                          const { value: packCount } = await Swal.fire({
                            title: "Enter number of packs",
                            input: "number",
                            inputLabel: `Pack size: ${item.wholesalePack}`,
                            inputValue: 1,
                            inputAttributes: { min: 1 },
                          });
                          newPackCount = parseInt(packCount, 10) || 1;
                          newQty = newPackCount * (item.wholesalePack || 1);
                        } else {
                          const { value: pcs } = await Swal.fire({
                            title: "Enter number of pieces",
                            input: "number",
                            inputValue: 1,
                            inputAttributes: { min: 1 },
                          });
                          newQty = parseInt(pcs, 10) || 1;
                          newPackCount = 0;
                        }

                        if (newQty > item.stock) {
                          toast.warn(`⚠️ Only ${item.stock} in stock`);
                          return;
                        }

                        updateQuantity(item._id, newQty, newPackCount, quantityType);
                      }}
                      className="w-full p-1 text-center bg-gray-700 rounded border border-gray-600 hover:bg-gray-600"
                    >
                      {item.type === "wholesale" ? `${item.packCount} pack(s) (${item.quantity} pcs)` : `${item.quantity} pcs`}
                    </button>
                  </div>

                  <div>
                    {(() => {
                      let total = 0;

                      if (item.type === "wholesale") {
                        const qtyFromPacks = (item.quantity || 0) * (item.wholesalePack || 0);
                        const leftover = (item.quantity || 0) - qtyFromPacks;

                        // pack price
                        const packTotal = (item.quantity || 0) * item.sellingPrice;

                        // leftover × price per piece
                        const leftoverTotal = leftover > 0
                          ? leftover * (item.sellingPricePerPiece || (item.sellingPrice / item.wholesalePack))
                          : 0;

                        total = packTotal + leftoverTotal;
                      } else {
                        total = (item.quantity || 0) * item.sellingPrice;
                      }

                      return formatMoney(total);
                    })()}
                  </div>

                  <div>
                    <button onClick={() => removeFromCart(item._id)}>
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-700 rounded shadow flex justify-between font-bold text-lg text-green-400">
            <span>Total ({totalItemsInCart} pcs):</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
        </div>

        {/* Right Panel - Payment */}
        <div className="w-1/4 p-4 border-l border-gray-700 flex flex-col justify-between bg-gray-800">
          <div className="space-y-2">
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
              <option value=""></option>
              <option value="Cash">Cash</option>
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
                onClick={async () => {
                  const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: "This will cancel the current transaction!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, cancel it',
                    cancelButtonText: 'No, keep it',
                    reverseButtons: true,
                  });

                  if (result.isConfirmed) {
                    setCart([]);
                    setCashTendered(0);
                    localStorage.removeItem("posCart");
                    toast.info("Transaction cancelled");
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-500 py-2 rounded font-semibold flex items-center justify-center gap-2"
              >
                Cancel Transaction
              </button>
            </div>

            <div className="mb-3 d-flex gap-3">
              <button
                className="btn bg-blue-600 d-flex align-items-center justify-content-center gap-3 px-4 py-2 fw-bold shadow flex-fill"
                style={{ borderRadius: "8px" }}
                onClick={suspendCart}
              >
                <FaPauseCircle size={18} />
                Suspend
              </button>
              &nbsp;&nbsp;
              <button
                className="btn bg-green-900 d-flex align-items-center justify-content-center gap-3 px-4 py-2 fw-bold shadow flex-fill"
                style={{ borderRadius: "8px" }}
                data-bs-toggle="modal"
                data-bs-target="#pendingCartsModal"
              >
                <FaShoppingBasket size={18} />
                Pending ({pendingCarts.length})
              </button>
            </div>

          </div>

          {/* =============================
              Pending Carts Modal - Modern Design
            ============================= */}
          <div
            className="modal fade"
            id="pendingCartsModal"
            tabIndex="-1"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content bg-gray-800 text-gray-100 rounded-lg shadow-lg">

                {/* Modal Header */}
                <div className="modal-header border-b border-gray-700">
                  <h5 className="modal-title text-xl font-bold text-blue-400">Pending Carts</h5>
                  <button className="btn-close" data-bs-dismiss="modal"></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body p-4">
                  {pendingCarts.length === 0 ? (
                    <p className="text-gray-400 text-center py-10">No pending carts.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-700 text-gray-200 uppercase text-sm tracking-wider">
                            <th className="px-4 py-2 rounded-tl-lg">ID</th>
                            <th className="px-4 py-2">Items</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2 rounded-tr-lg">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingCarts.map((cart, idx) => (
                            <tr
                              key={cart.id}
                              className={`transition hover:bg-gray-700 ${idx % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}
                            >
                              <td className="px-4 py-3 font-mono">{cart.id}</td>
                              <td className="px-4 py-3">{cart.items.length} items</td>
                              <td className="px-4 py-3 text-green-400 font-semibold">₦{cart.subtotal.toLocaleString()}</td>
                              <td className="px-4 py-3 text-gray-400">{new Date(cart.createdAt).toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <button
                                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                                  data-bs-dismiss="modal"
                                  onClick={() => resumeCart(cart.id)}
                                >
                                  <FaPlayCircle size={16} />
                                  Resume
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 pt-4">
            Tip: Use a barcode scanner that sends an `Enter` after the code. The global scanner captures the stream
            and adds the item automatically.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanItems;

// routes/index.js
import express from "express";
const router = express.Router();

import supplierRoutes from "./supplierRoutes.js";
import purchaseRoutes from "./purchaseRoutes.js";
import ledgerRoutes from "./ledgerRoutes.js";
import approvalRoutes from "./approvalRoutes.js"; 
import stockRoutes from "./stockRoutes.js";
import productRoutes from "./productRoutes.js";
import salesRoutes from "./salesRoutes.js";
import accountsRoutes from "./accountsRoutes.js";

router.use("/api/users", accountsRoutes);


// Example test route
router.get("/test", (req, res) => {
  res.json({ message: "Grox API working successfully!" });
});

// Mount existing routes
router.use("/suppliers", supplierRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/ledger", ledgerRoutes);
router.use("/approvals", approvalRoutes); 
router.use("/stock", stockRoutes);
router.use("/api", productRoutes);

// ADD THIS LINE
router.use("/api/sales", salesRoutes);



export default router; // <-- IMPORTANT

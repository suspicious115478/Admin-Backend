// admin-backend/src/routes/adminRoutes.js

const express = require("express");
const { 
    getAdminIdByFirebaseUid,
    registerAdmin,
    // 🔥 IMPORT THE NEW FUNCTION
    getOrdersByAdminId 
} = require("../controllers/adminController");
const router = express.Router();

// --- GET Route: Fetch Admin ID from Firebase ---
router.get("/adminid/:firebaseUid", getAdminIdByFirebaseUid); 

// --- POST Route: Register Admin in Firebase RTDB ---
router.post("/register", registerAdmin);

// --- 🔥 NEW GET Route: Fetch Orders from Supabase using Admin ID ---
router.get("/orders/:adminId", getOrdersByAdminId);

module.exports = router;

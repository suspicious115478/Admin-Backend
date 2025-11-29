// admin-backend/src/routes/adminRoutes.js
const express = require("express");
const { 
    getAdminIdByFirebaseUid,
    // 🔥 IMPORT THE NEW FUNCTION
    registerAdmin 
} = require("../controllers/adminController");
const router = express.Router();

// --- GET Route ---
// Route for fetching the Admin ID by Firebase UID
router.get("/adminid/:firebaseUid", getAdminIdByFirebaseUid); 

// --- 🔥 NEW POST Route ---
// Route for creating a new admin entry in the database after Firebase Auth success
router.post("/register", registerAdmin);

module.exports = router;

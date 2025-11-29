// admin-backend/src/routes/adminRoutes.js
const express = require("express");
const { getAdminIdByFirebaseUid } = require("../controllers/adminController");
const router = express.Router();

// Route for fetching the Admin ID by Firebase UID
router.get("/adminid/:firebaseUid", getAdminIdByFirebaseUid); 

module.exports = router;
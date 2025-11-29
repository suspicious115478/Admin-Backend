// admin-backend/src/controllers/adminController.js
const { db } = require('../utils/firebaseAdmin');

/**
 * API Handler: GET /api/admin/adminid/:firebaseUid
 * Retrieves the admin_id from the Firebase RTDB for the given Firebase UID.
 */
const getAdminIdByFirebaseUid = async (req, res) => {
    const { firebaseUid } = req.params;
    
    if (!firebaseUid) {
        return res.status(400).json({ message: 'Missing Firebase UID parameter.' });
    }

    try {
        // The path should match where you store admin/agent details, e.g., 'admins'
        // We assume you have a top-level node for 'admins'
        const adminRef = db.ref(`admins/${firebaseUid}`); 
        const snapshot = await adminRef.once('value');
        const adminData = snapshot.val();

        if (!adminData) {
            console.log(`[ADMIN ID LOOKUP] No admin found for UID: ${firebaseUid}`);
            return res.status(404).json({ message: 'Admin Not Found', details: `No admin record found for UID ${firebaseUid}` });
        }

        const admin_id = adminData.admin_id;

        if (!admin_id) {
            console.error(`[ADMIN ID LOOKUP ERROR] Admin ID property missing for UID: ${firebaseUid}`);
            return res.status(500).json({ message: 'Admin ID property is missing in the database record.' });
        }
        
        console.log(`[ADMIN ID LOOKUP SUCCESS] Found Admin ID ${admin_id} for UID ${firebaseUid}.`);
        
        // Respond with the required format: { admin_id: "..." }
        res.json({ admin_id }); 

    } catch (error) {
        console.error('[ADMIN ID LOOKUP ERROR] Database fetch failed:', error);
        res.status(500).json({ message: 'Error Fetching Admin ID from database.', details: error.message });
    }
};

module.exports = {
    getAdminIdByFirebaseUid
};

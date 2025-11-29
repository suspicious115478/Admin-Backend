// admin-backend/src/controllers/adminController.js
const { db } = require('../utils/firebaseAdmin');

// --- 🔥 NEW FUNCTION: Register Admin Handler ---
/**
 * API Handler: POST /api/admin/register
 * Saves the admin's details (email, admin_id) using the Firebase UID as key.
 */
const registerAdmin = async (req, res) => {
    const { firebase_uid, email, admin_id } = req.body;

    if (!firebase_uid || !email || !admin_id) {
        console.error('[ADMIN REGISTER ERROR] Missing required registration fields.');
        return res.status(400).json({ message: 'Missing required fields: firebase_uid, email, or admin_id.' });
    }

    try {
        // Use the Firebase UID as the key in the 'admins' node
        const adminRef = db.ref(`admins/${firebase_uid}`);

        // Check if an entry already exists for this UID
        const existingSnapshot = await adminRef.once('value');
        if (existingSnapshot.exists()) {
            console.warn(`[ADMIN REGISTER WARNING] Admin with UID ${firebase_uid} already exists.`);
            // Update the existing record instead of failing registration
            await adminRef.update({
                email, 
                admin_id, 
                last_updated: new Date().toISOString(),
            });
            return res.status(200).json({
                message: 'Admin profile already exists and was updated.',
                admin: { firebase_uid, admin_id }
            });
        }

        // Set the admin data for a new entry
        await adminRef.set({
            email, 
            admin_id, 
            registered_at: new Date().toISOString(),
        });
        
        console.log(`[ADMIN REGISTER SUCCESS] Admin ${admin_id} registered under UID ${firebase_uid} in Firebase RTDB.`);

        res.status(201).json({ 
            message: 'Admin profile created successfully.',
            admin: { firebase_uid, admin_id }
        });

    } catch (error) {
        console.error('Backend Admin Registration Error:', error);
        res.status(500).json({ message: 'Failed to register admin details in Firebase RTDB.', details: error.message });
    }
};
// -----------------------------------------------------------


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
    getAdminIdByFirebaseUid,
    // 🔥 EXPORT THE NEW REGISTRATION FUNCTION
    registerAdmin,
};

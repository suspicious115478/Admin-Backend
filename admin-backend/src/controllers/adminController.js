// admin-backend/src/controllers/adminController.js

const { db } = require('../utils/firebaseAdmin');

// --- 🔥 NEW FUNCTION: Register Admin Handler ---
/**
 * API Handler: POST /api/admin/register
 * Saves the admin's details (email, admin_id) using the Firebase UID as key.
 */
const registerAdmin = async (req, res) => {
    const { firebase_uid, email, admin_id } = req.body;

    // --- LOGGING: Request Validation ---
    console.log(`[REGISTER START] Attempting registration for Admin ID: ${admin_id} (UID: ${firebase_uid ? firebase_uid.substring(0, 8) + '...' : 'N/A'})`);

    if (!firebase_uid || !email || !admin_id) {
        console.error(`[REGISTER ERROR] Validation Failed. Received data: UID=${firebase_uid}, Email=${email}, AdminID=${admin_id}.`);
        return res.status(400).json({ message: 'Missing required fields: firebase_uid, email, or admin_id.' });
    }

    try {
        const dbPath = `admins/${firebase_uid}`;
        console.log(`[REGISTER FLOW] Defined database path: ${dbPath}`);
        const adminRef = db.ref(dbPath);

        // --- LOGGING: Existence Check ---
        console.log('[REGISTER FLOW] Checking if admin record already exists in DB...');
        const existingSnapshot = await adminRef.once('value');
        
        if (existingSnapshot.exists()) {
            // --- LOGGING: Update Existing Record ---
            console.warn(`[REGISTER WARNING] Record found for UID ${firebase_uid}. Updating timestamp and details.`);
            
            const updatePayload = {
                email, 
                admin_id, 
                last_updated: new Date().toISOString(),
            };

            await adminRef.update(updatePayload);
            
            console.log(`[REGISTER SUCCESS] Admin ${admin_id} details updated successfully. Status: 200 OK.`);
            return res.status(200).json({
                message: 'Admin profile already exists and was updated.',
                admin: { firebase_uid, admin_id }
            });
        }

        // --- LOGGING: Create New Record ---
        console.log('[REGISTER FLOW] No existing record found. Creating new admin entry.');

        const newPayload = {
            email, 
            admin_id, 
            registered_at: new Date().toISOString(),
        };
        
        await adminRef.set(newPayload);
        
        console.log(`[REGISTER SUCCESS] Admin ${admin_id} created successfully at path ${dbPath}. Status: 201 Created.`);

        res.status(201).json({ 
            message: 'Admin profile created successfully.',
            admin: { firebase_uid, admin_id }
        });

    } catch (error) {
        // --- LOGGING: Detailed Error Catch ---
        console.error(`[REGISTER CRITICAL ERROR] Failed to write to Firebase RTDB for UID ${firebase_uid}.`, {
            errorName: error.name,
            errorMessage: error.message,
            errorCode: error.code || 'N/A',
            stack: error.stack.substring(0, 500) + '...' // Limit stack trace for cleaner logs
        });
        res.status(500).json({ 
            message: 'Failed to register admin details in Firebase RTDB.', 
            details: error.message 
        });
    }
};
// -----------------------------------------------------------


/**
 * API Handler: GET /api/admin/adminid/:firebaseUid
 * Retrieves the admin_id from the Firebase RTDB for the given Firebase UID.
 */
const getAdminIdByFirebaseUid = async (req, res) => {
    const { firebaseUid } = req.params;

    // --- LOGGING: Request Start ---
    console.log(`[LOOKUP START] Attempting lookup for Firebase UID: ${firebaseUid}`);
    
    if (!firebaseUid) {
        console.error('[LOOKUP ERROR] Missing Firebase UID in request parameters.');
        return res.status(400).json({ message: 'Missing Firebase UID parameter.' });
    }

    try {
        const dbPath = `admins/${firebaseUid}`;
        console.log(`[LOOKUP FLOW] Defined database path: ${dbPath}`);
        const adminRef = db.ref(dbPath);
        
        // --- LOGGING: Database Read Attempt ---
        console.log('[LOOKUP FLOW] Fetching data from Firebase RTDB...');
        const snapshot = await adminRef.once('value');
        const adminData = snapshot.val();

        if (!adminData) {
            // --- LOGGING: Not Found ---
            console.log(`[LOOKUP FAIL] Record not found at ${dbPath}. Status: 404 Not Found.`);
            return res.status(404).json({ 
                message: 'Admin Not Found', 
                details: `No admin record found for UID ${firebaseUid}` 
            });
        }
        
        const admin_id = adminData.admin_id;
        
        if (!admin_id) {
            // --- LOGGING: Data Missing ---
            console.error(`[LOOKUP ERROR] Admin ID property is missing in DB record for UID: ${firebaseUid}. Full data:`, adminData);
            return res.status(500).json({ 
                message: 'Admin ID property is missing in the database record.', 
                details: 'Database record exists but lacks admin_id field.'
            });
        }
        
        // --- LOGGING: Success ---
        console.log(`[LOOKUP SUCCESS] Found Admin ID ${admin_id} for UID ${firebaseUid}. Status: 200 OK.`);
        
        // Respond with the required format: { admin_id: "..." }
        res.json({ admin_id }); 

    } catch (error) {
        // --- LOGGING: Detailed Error Catch ---
        console.error(`[LOOKUP CRITICAL ERROR] Database fetch failed for UID ${firebaseUid}.`, {
            errorName: error.name,
            errorMessage: error.message,
            errorCode: error.code || 'N/A',
        });
        res.status(500).json({ 
            message: 'Error Fetching Admin ID from database.', 
            details: error.message 
        });
    }
};

module.exports = {
    getAdminIdByFirebaseUid,
    // 🔥 EXPORT THE NEW REGISTRATION FUNCTION
    registerAdmin,
};

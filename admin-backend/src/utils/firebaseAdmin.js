// admin-backend/src/utils/firebaseAdmin.js
const admin = require('firebase-admin');
// ⚠️ IMPORTANT: Get your service account key file from Firebase and update the path/details.
// For Render, it's best to store this as a JSON string in an environment variable.

// If deploying on Render, use ENV variables for security
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL, // e.g., "https://your-project-id.firebaseio.com"
};

if (!admin.apps.length) {
    admin.initializeApp(firebaseConfig);
    console.log("[FIREBASE ADMIN INIT] SDK Initialized.");
}

const db = admin.database();

module.exports = {
    db,
    admin
};

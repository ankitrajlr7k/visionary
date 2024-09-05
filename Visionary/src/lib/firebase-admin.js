// lib/firebase-admin.js
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
    storageBucket: 'gs://radiant-raceway-428719-v0.appspot.com', // Ensure this matches your Firebase bucket name
  });
}

const bucket = admin.storage().bucket();

export { bucket };

import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const db = admin.database();
export const auth = admin.auth();
export { admin }; // Export the admin object

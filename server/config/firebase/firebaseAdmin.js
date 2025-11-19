import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let app, db, bucket, auth;

try {
  // Your Firebase project configuration (fftour-5ac79)
  const firebaseConfig = {
    projectId: "fftour-5ac79",
    storageBucket: "fftour-5ac79.appspot.com",
    databaseURL: "https://fftour-5ac79-default-rtdb.firebaseio.com"
  };

  // Load service account from environment or file
  let serviceAccount;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Load from environment variable (for production/CI)
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Load from file (for local development)
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
      join(__dirname, 'serviceAccountKey.json');
    
    try {
      const serviceAccountFile = readFileSync(serviceAccountPath, 'utf8');
      serviceAccount = JSON.parse(serviceAccountFile);
    } catch (err) {
      console.warn('⚠️  No service account key found. Using default credentials.');
      console.log('💡 To use Firebase Admin, download service account key from:');
      console.log('   https://console.firebase.google.com/project/fftour-5ac79/settings/serviceaccounts/adminsdk');
      
      // Try to initialize without credentials (for development)
      app = admin.initializeApp({
        ...firebaseConfig
      });
      db = admin.firestore();
      bucket = admin.storage().bucket();
      auth = admin.auth();
      
      console.log('✅ Firebase Admin initialized (default mode)');
      console.log(`   Project: ${firebaseConfig.projectId}`);
    }
  }

  if (serviceAccount) {
    // Initialize Firebase Admin with service account
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      ...firebaseConfig
    });

    db = admin.firestore();
    bucket = admin.storage().bucket();
    auth = admin.auth();

    console.log('✅ Firebase Admin initialized with credentials');
    console.log(`   Project: ${serviceAccount.project_id || firebaseConfig.projectId}`);
    console.log(`   Storage: ${bucket.name}`);
  }

} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  process.exit(1);
}

export { admin, db, bucket, auth };
export default { admin, db, bucket, auth };

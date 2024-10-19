import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    try {
      console.log('Initializing Firebase with config:', JSON.stringify(firebaseConfig));
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error; // Re-throw the error to prevent further execution
    }
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    analytics = getAnalytics(app);
  }
  console.log('Firebase initialized successfully');
}

export { auth, db, analytics };

export function getFirestoreInstance(): Firestore {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return db;
}

export function getAuthInstance(): Auth {
  if (!auth) {
    throw new Error('Auth is not initialized');
  }
  return auth;
}

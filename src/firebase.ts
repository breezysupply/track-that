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
      console.log('Firebase config:', JSON.stringify(firebaseConfig, null, 2));
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      console.error('Firebase config used:', JSON.stringify(firebaseConfig, null, 2));
      throw error;
    }
  } else {
    app = getApps()[0];
  }
  
  try {
    auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Auth:', error);
  }

  try {
    db = getFirestore(app);
    console.log('Firestore initialized successfully');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }

  if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    try {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Analytics:', error);
    }
  }
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

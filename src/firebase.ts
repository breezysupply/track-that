import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAQlQ5S4FwNj_Bszu2h1TS9ToeGamTf57I",
  authDomain: "track-that-b1c42.firebaseapp.com",
  projectId: "track-that-b1c42",
  storageBucket: "track-that-b1c42.appspot.com",
  messagingSenderId: "126690770862",
  appId: "1:126690770862:web:ec09f01da5c6a4cae3123f",
  measurementId: "G-7HP0K9F813"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

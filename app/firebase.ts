// app/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1CxFmFdGLTK0w-Zjgyf4DT-ID2A2pAik",
  authDomain: "sih-prototype-19568.firebaseapp.com",
  projectId: "sih-prototype-19568",
  storageBucket: "sih-prototype-19568.firebasestorage.app",
  messagingSenderId: "119718393495",
  appId: "1:119718393495:web:b461550f5ca281695e1bd2",
  measurementId: "G-6C8HF01T8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);

export default app;


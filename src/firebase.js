// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

// Configuració de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBxhQpX4lOpoIFmdP9mp1xpHI37cNsjXQ",
  authDomain: "profecia-bed60.firebaseapp.com",
  projectId: "profecia-bed60",
  storageBucket: "profecia-bed60.appspot.com",
  messagingSenderId: "554283222723",
  appId: "1:554283222723:web:663cbbc2e6ee334df38476",
  measurementId: "G-KFWK66K2R9"
};

// Inicialitza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc };

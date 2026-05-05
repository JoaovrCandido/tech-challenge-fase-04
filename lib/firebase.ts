import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Substitua pelas SUAS chaves que você copiou do console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyABoXbepbzGgzLc5Nw0aEr8qwCGVnE8YoQ",
  authDomain: "dashboard-financeiro-e7ae5.firebaseapp.com",
  projectId: "dashboard-financeiro-e7ae5",
  storageBucket: "dashboard-financeiro-e7ae5.firebasestorage.app",
  messagingSenderId: "606620695226",
  appId: "1:606620695226:web:ca26417888d60d4ce3e083"
};

// Evita que o Next.js tente inicializar o Firebase mais de uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta as ferramentas que vamos usar
export const auth = getAuth(app);
export const db = getFirestore(app);
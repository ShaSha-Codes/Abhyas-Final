// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdQGpKoWea0IaYa5d-6PVQgieGzjhgGNo",
  authDomain: "abhyas-1691a.firebaseapp.com",
  projectId: "abhyas-1691a",
  storageBucket: "abhyas-1691a.appspot.com",
  messagingSenderId: "1036059109042",
  appId: "1:1036059109042:web:b21355fb936c3066594bab",
  measurementId: "G-6K1BC61Q2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
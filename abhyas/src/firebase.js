// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



// Main One
const firebaseConfig = {
  apiKey: "AIzaSyCdQGpKoWea0IaYa5d-6PVQgieGzjhgGNo",
  authDomain: "abhyas-1691a.firebaseapp.com",
  projectId: "abhyas-1691a",
  storageBucket: "abhyas-1691a.appspot.com",
  messagingSenderId: "1036059109042",
  appId: "1:1036059109042:web:b21355fb936c3066594bab",
  measurementId: "G-6K1BC61Q2L"
};

// Backup One
// const firebaseConfig = {
//   apiKey: "AIzaSyBbSX6z3DGmdBKbnrgg1yx-gkDljQvKAho",
//   authDomain: "abhyas-46b00.firebaseapp.com",
//   projectId: "abhyas-46b00",
//   storageBucket: "abhyas-46b00.appspot.com",
//   messagingSenderId: "302352640026",
//   appId: "1:302352640026:web:65d4cc856aae68746d89a3",
//   measurementId: "G-T0X67N7TYK"
// };

// Backup Two
// const firebaseConfig = {
//   apiKey: "AIzaSyBvukW7amQegzrQmtvg7Jqr9CglVVk8SGY",
//   authDomain: "final-year-project-257eb.firebaseapp.com",
//   projectId: "final-year-project-257eb",
//   storageBucket: "final-year-project-257eb.appspot.com",
//   messagingSenderId: "120305997208",
//   appId: "1:120305997208:web:7b13e0c786da69a99907ed",
//   measurementId: "G-M3CS33QMQ7"
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHocpvQvoKGqz7R7x74V-jveN_8CgnCsY",
  authDomain: "vintage-notify-app.firebaseapp.com",
  projectId: "vintage-notify-app",
  storageBucket: "vintage-notify-app.firebasestorage.app",
  messagingSenderId: "375604232082",
  appId: "1:375604232082:web:94542f93480d8c5502cb4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
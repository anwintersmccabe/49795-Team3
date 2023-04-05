// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_pZvPTITijCC3BLLbC7Re04ekO9LcfyQ",
  authDomain: "ai-app-23fd3.firebaseapp.com",
  projectId: "ai-app-23fd3",
  storageBucket: "ai-app-23fd3.appspot.com",
  messagingSenderId: "1057891418279",
  appId: "1:1057891418279:web:b02613bf517645cd9e5b82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
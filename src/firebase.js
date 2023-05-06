// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdlZ_GOAgzziO1AyztJb04VnZJl6xMxNU",
  authDomain: "realtor-clone-react-d91c3.firebaseapp.com",
  projectId: "realtor-clone-react-d91c3",
  storageBucket: "realtor-clone-react-d91c3.appspot.com",
  messagingSenderId: "902379881900",
  appId: "1:902379881900:web:e895e894ed65a1c2c5e609"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();

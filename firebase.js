// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSeTkXG390D_lj_LwNsrpv4MAkTnvBEgg",
  authDomain: "inventory-management-8f804.firebaseapp.com",
  projectId: "inventory-management-8f804",
  storageBucket: "inventory-management-8f804.appspot.com",
  messagingSenderId: "1023230054438",
  appId: "1:1023230054438:web:06a422a726bbc7de7456e7",
  measurementId: "G-8HVBNE075V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore= getFirestore(app)

export{firestore}
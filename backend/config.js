// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdZjRm4-zz0Hz1ipD3mOhv4ktM4LMZWQM",
  authDomain: "imageuploaddb-afe1d.firebaseapp.com",
  projectId: "imageuploaddb-afe1d",
  storageBucket: "imageuploaddb-afe1d.appspot.com",
  messagingSenderId: "837002519115",
  appId: "1:837002519115:web:bbc3180590ef7d84a223ce"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app)
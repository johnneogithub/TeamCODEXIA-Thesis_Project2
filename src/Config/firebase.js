// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, 
        FacebookAuthProvider, 
        GoogleAuthProvider,
        signInWithPopup
       } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgtC9JuKZU1AJVS5c3idsrqY2ZXVv-XEA",
  authDomain: "planitfamit.firebaseapp.com",
  projectId: "planitfamit",
  storageBucket: "planitfamit.appspot.com",
  messagingSenderId: "753618482551",
  appId: "1:753618482551:web:d2bda2b3966b222e675d72",
  measurementId: "G-GNK8Y9QR6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore()
// Initialize Firebase Authentication and get a reference to the service

export const auth = getAuth(app);

export const crud = database;

// Sign In with providers
// Facebook Authentication (SignIn with Facebook)
const fbprovider = new FacebookAuthProvider(); 

export const FacebookAuth = async () => { 
  const result = await signInWithPopup(auth, fbprovider);
  return result;
}

// Google Authenticatin (SignIn with Google)
const googleprovider = new GoogleAuthProvider();

export const GoogleAuth = async () => {
  const result = await signInWithPopup (auth, googleprovider);
  return result;
}


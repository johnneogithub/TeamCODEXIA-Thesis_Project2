// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
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

// Initialize Firebase services
const auth = getAuth(app);
const crud = getFirestore(app);
const storage = getStorage(app);

// Sign In with providers
const fbprovider = new FacebookAuthProvider(); 

export const FacebookAuth = async () => { 
  const result = await signInWithPopup(auth, fbprovider);
  return result;
}

const googleprovider = new GoogleAuthProvider();

export const GoogleAuth = async () => {
  const result = await signInWithPopup(auth, googleprovider);
  return result;
}

// Export Firebase services
export { auth, crud, storage };

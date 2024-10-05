import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

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
const functions = getFunctions(app);

// Function to set the admin user
const setAdminUser = async () => {
  const adminEmail = 'stmrgrtdmn@gmail.com';
  try {
    await setDoc(doc(crud, 'admin', adminEmail), {
      roles: {
        0: 'admin',
        1: 'author'
      }
    });
    console.log('Admin user added successfully');
  } catch (error) {
    console.error('Error adding admin user: ', error);
  }
};

// Call the function to set the admin user (you can call this function from a component or during initial setup)
setAdminUser();

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
export { auth, crud, storage, functions };
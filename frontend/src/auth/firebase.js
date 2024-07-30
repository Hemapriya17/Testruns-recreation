import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB46WOqQOJzw34DnklHgb6cHenzItld1Uo",
  authDomain: "testruns-55a22.firebaseapp.com",
  projectId: "testruns-55a22",
  storageBucket: "testruns-55a22.appspot.com",
  messagingSenderId: "821235841377",
  appId: "1:821235841377:web:7a0993ca2cbe81d0626d20",
  measurementId: "G-ES3EMX0XDX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };

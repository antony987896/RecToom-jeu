// game/auth.js - wrapper Firebase for the game (same firebaseConfig as the site)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKDP95h9aH8Dq3OYMYPZZghy72kklb3Bg",
  authDomain: "rectoom-site.firebaseapp.com",
  projectId: "rectoom-site",
  storageBucket: "rectoom-site.appspot.com",
  messagingSenderId: "907780061957",
  appId: "1:907780061957:web:5a5f856ee56a372fb4956c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

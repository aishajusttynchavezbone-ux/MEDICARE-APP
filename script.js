// =============================
// 🔥 FIREBASE IMPORTS
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";


// =============================
// 🔥 CONFIG (usa TU config)
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyCRpqTejwguftFlxuvYjWHAXDQNDTyyK4",
  authDomain: "medicareapp-8a81c.firebaseapp.com",
  projectId: "medicareapp-8a81c",
  storageBucket: "medicareapp-8a81c.firebasestorage.app",
  messagingSenderId: "2084488890",
  appId: "1:2084488890:web:80c1bb25450beb83bda483",
  measurementId: "G-2EGRLZETGL"
};


// =============================
// 🔥 INIT
// =============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// =============================
// 🔥 ELEMENTOS HTML
// =============================
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const logoutBtn = document.getElementById("logout");


// =============================
// 🔥 REGISTRO
// =============================
registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Usuario registrado correctamente");
  } catch (err) {
    alert(err.message);
  }
});


// =============================
// 🔥 LOGIN
// =============================
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login correcto");
  } catch (err) {
    alert(err.message);
  }
});


// =============================
// 🔥 LOGOUT
// =============================
logoutBtn?.addEventListener("click", () => {
  signOut(auth);
});


// =============================
// 🔥 SESIÓN ACTIVA (MAGIA)
// =============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario logueado:", user.email);
    document.getElementById("app").style.display = "block";
  } else {
    console.log("No hay sesión");
    document.getElementById("app").style.display = "none";
  }
});
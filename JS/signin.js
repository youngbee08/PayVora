// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore,collection,doc,setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-FjdOhYEOwisGBCFUMc7r6tjfguuBQ2M",
    authDomain: "payvora-f627f.firebaseapp.com",
    projectId: "payvora-f627f",
    storageBucket: "payvora-f627f.firebasestorage.app",
    messagingSenderId: "566155557360",
    appId: "1:566155557360:web:552b145be338890cb50535"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//Initialize Authentification
const auth = getAuth(app);
//Initialize DataBase
const db = getFirestore(app);
const usersColRef = collection(db, "PayVora Users")
const signUpForm = document.getElementById("signUpForm");
const userNameINP = document.getElementById("userName");
const emailINP = document.getElementById("email");
const passwordINP = document.getElementById("password");
const phoneINP = document.getElementById("phone");
const loadingCon = document.getElementById("loading-container");
const submitBTN = document.getElementById("submitSignUpBtn");
const SignUpText = document.getElementById("SignUpText");
const errorP = document.getElementById("errorP");
const eyeCon = document.querySelector(".eye");
const eyeSlash = document.querySelector(".fa-eye-slash");
const logo = document.getElementById("logo");
logo.addEventListener("click", reDirectLogo);
eyeSlash.addEventListener("click", viewPassword)
function viewPassword() {
    passwordINP.type="text";
    eyeCon.innerHTML = "";
    eyeCon.innerHTML += `
        <i class="fa-solid fa-eye"></i>
    `;
    document.querySelector(".fa-eye").addEventListener("click", closePassword);
}
function closePassword() {
    passwordINP.type="password";
    eyeCon.innerHTML = "";
    eyeCon.innerHTML += `
        <i class="fa-solid fa-eye-slash"></i>
    `;
    document.querySelector(".fa-eye-slash").addEventListener("click", viewPassword)
    
}
function reDirectLogo() {
    location.href='../index.html';
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword,sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore,collection,doc,setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: window.env.api_key,
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
const firstNameINP = document.getElementById("firstName");
const lastNameINP = document.getElementById("lastName");
const emailINP = document.getElementById("email");
const passwordINP = document.getElementById("password");
const phoneINP = document.getElementById("phone");
const eyeCon = document.querySelector(".eye");
const eyeSlash = document.querySelector(".fa-eye-slash");
const loadingCon = document.getElementById("loading-container");
const submitBTN = document.getElementById("submitSignUpBtn");
const SignUpText = document.getElementById("SignUpText");
const errorP = document.getElementById("errorP");
signUpForm.addEventListener("submit", createAnAccount)
const logo = document.getElementById("logo");
logo.addEventListener("click", reDirectLogo);
eyeSlash.addEventListener("click", viewPassword);
const passwordFormat = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const gmailFormat =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nigeriaPhoneNumberFormat = /^(?:\+234|0)[789][01]\d{8}$/;
function generateAccountNumber() {
    let number = '';
    for (let i = 0; i < 10; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
}
async function createAnAccount(e) {
    try {
        e.preventDefault()
        errorP.textContent = "";
        loadingCon.classList.add("loadBack");
        SignUpText.style.display ="none";
        submitBTN.disabled = true;
        submitBTN.classList.add("cursorNo");
        const accountDetails = {
            firstName:firstNameINP.value.trim(),
            lastName:lastNameINP.value.trim(),
            email:emailINP.value.trim(),
            password:passwordINP.value.trim(),
            phone:phoneINP.value.trim(),
            balance:0,
            accountNumber:generateAccountNumber()
        }
        console.log(accountDetails);
        if (accountDetails.password.length < 6) {
            throw new Error("*Password Should Be More Than Six Characters");
        }
        if (!/[A-Z]/.test(accountDetails.password)) {
            throw new Error("*Password must contain at least one uppercase letter (A-Z).");
        }
        if (!/[a-z]/.test(accountDetails.password)) {
            throw new Error("*Password must contain at least one lowercase letter (a-z).");
        }
        if (!/\d/.test(accountDetails.password)) {
            throw new Error("*Password must include at least one number (0-9).");
        }
        if (!/[@$!%*?&]/.test(accountDetails.password)) {
            throw new Error("*Password must have at least one special character (@, $, !, %, *, ?, &).");
        }
        if (!nigeriaPhoneNumberFormat.test(accountDetails.phone)) {
            throw new Error("Invalid Phone Number");
        }
        if (!gmailFormat.test(accountDetails.email)) {
            throw new Error("*Invalid Email Address");
        }
        const {email,password, ...rest} = accountDetails;
        const res = await createUserWithEmailAndPassword(auth,email,password);
        console.log(res);
        const docRef = doc(usersColRef, res.user.uid);
        await setDoc(docRef, rest);
        await sendEmailVerification(res.user)
        Swal.fire({
            text: "You Have Signed Up Successfully",
            icon: "success",
            confirmButtonText: "OK",
        });
        console.log("Redirecting...");
        setTimeout(() => {
            location.href = `../Pages/dashboard.html?id=${res.user.uid}`;
        }, 2000);
    } catch (error) {
        console.log(error);
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
            errorP.style.color = "red";
            errorP.textContent = "*Email already in use";
            return
        }
        if (error.message === "Firebase: Error (auth/network-request-failed)."){
            errorP.style.color = "red";
            errorP.textContent ="Error occured, Please Try Again"
            return
        }
        errorP.textContent = error.message;
    } finally {
        loadingCon.classList.remove("loadBack");
        SignUpText.style.display ="block";
        submitBTN.disabled = false;
        submitBTN.classList.remove("cursorNo");
    }
}
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
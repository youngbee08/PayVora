// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth,signInWithEmailAndPassword,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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
const signUpForm = document.getElementById("signUpForm");
const emailINP = document.getElementById("email");
const passwordINP = document.getElementById("password");
const loadingCon = document.getElementById("loading-container");
const submitBTN = document.getElementById("submitSignUpBtn");
const SignUpText = document.getElementById("SignUpText");
const errorP = document.getElementById("errorP");
const eyeCon = document.querySelector(".eye");
const eyeSlash = document.querySelector(".fa-eye-slash");
const logo = document.getElementById("logo");
logo.addEventListener("click", reDirectLogo);
eyeSlash.addEventListener("click", viewPassword);
const passwordFormat = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const gmailFormat =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
signUpForm.addEventListener("submit", signInYourAccount)
async function signInYourAccount(e) {
    try {
        e.preventDefault()
        errorP.textContent = "";
        loadingCon.classList.add("loadBack");
        SignUpText.style.display ="none";
        submitBTN.disabled = true;
        submitBTN.classList.add("cursorNo");
        const accountDetails = {
            email:emailINP.value.trim(),
            password:passwordINP.value.trim(),
        }
        console.log(accountDetails);
        if (!passwordFormat.test(accountDetails.password || !gmailFormat.test(accountDetails.email))) {
            throw new Error("*Invalid Credential(s)");
        }
        const {email,password, ...rest} = accountDetails;
        const signInRes = await signInWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        Swal.fire({
            text: "You Have Signed In Successfully",
            icon: "success",
            confirmButtonText: "OK",
        });
        console.log("Redirecting...");
        setTimeout(() => {
            location.href = `../Pages/dashboard.html?id=${user.uid}`;
        }, 2000);
    } catch (error) {
        console.log(error);
        if (error.message === "Firebase: Error (auth/network-request-failed)."){
            errorP.style.color = "red";
            errorP.textContent ="Error occured, Please Try Again"
            return
        }
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
            errorP.style.color = "red";
            errorP.innerHTML += `
               <p>Account not found, Would you like to <a href="./signup.html" style="color: white;">Sign Up</a></p>
            `;
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
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        console.log("User is logged in");
    } else {
        console.log("User is logged out");
    }
});
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
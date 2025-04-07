// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { sendPasswordResetEmail,getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
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
//Initailize auth
const auth = getAuth(app);
const resetEmailForm = document.getElementById("signUpForm");
const resetEmail = document.getElementById("email");
resetEmailForm.addEventListener("submit", sendResetEmail);
const gmailFormat =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
async function sendResetEmail(e) {
    e.preventDefault()
    try {
        errorP.textContent = "";
        loadingCon.classList.add("loadBack");
        recoveryText.style.display ="none";
        submitBTN.disabled = true;
        submitBTN.classList.add("cursorNo");
        const email = resetEmail.value.trim();
        if (!gmailFormat.test(email)) {
            throw new Error("*Invalid Email Address");
        }
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
            text: "Email password reset email has been sent.",
            icon: "success",
            confirmButtonText: "OK",
        });
        console.log("Redirecting...");
        setTimeout(() => {
            location.href = `../Pages/signin.html`;
        }, 2000);
    } catch (error) {
        console.log(error);
        if (error.message === "Firebase: Error (auth/network-request-failed)."){
            errorP.style.color = "red";
            errorP.textContent ="Error occured, Please Try Again"
            return
        }
        errorP.textContent = error.message;
    } finally {
        loadingCon.classList.remove("loadBack");
        recoveryText.style.display ="block";
        submitBTN.disabled = false;
        submitBTN.classList.remove("cursorNo");
    }
}
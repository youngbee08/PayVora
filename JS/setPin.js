// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,collection,doc,getDoc,setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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
// Initialize Firestore
const db = getFirestore(app);
const userPinColRef = collection(db, "PayVora Users Pin");
const userColRef = collection(db, "PayVora Users");
const setPinText = document.getElementById("setPinText");
const loadingCon = document.getElementById("loading-container");
const submitBTN = document.getElementById("submitBtn");
const password = document.getElementById("password");
submitBTN.addEventListener("click", setUserPin)
const confirmPassword = document.getElementById("confirmPassword");
const errorP = document.getElementById("errorP");
let searchParams = new URLSearchParams(location.search);
let userID;
if (searchParams.has("id")) {
    userID = searchParams.get("id");
    console.log(`User ID:${userID}`);
    document.body.style.display="block";
}
else{
    location.href = 'signin.html';
}
export async function setUserPin() {
    try {
        errorP.innerHTML = "";
        loadingCon.classList.add("loadBack");
        setPinText.style.display ="none";
        submitBTN.disabled = true;
        submitBTN.classList.add("cursorNo");
        const userPinDocRef = doc(userPinColRef, userID);
        const userDocRef = doc(userColRef, userID);
        const docSnap = await getDoc(userPinDocRef);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            location.href = 'signin.html';
            return
        }
        const userPin = {pin:password.value.trim()}
        if (!password.value.trim() || !confirmPassword.value.trim()) {
            throw new Error("Please fill in all fields");
            
        }
        if (password.value.trim() !== confirmPassword.value.trim()) {
            throw new Error("Pin doesn't match");
        }
        const userData = docSnap.data();
        console.log(userData);
        await setDoc(userPinDocRef, userPin);
        Swal.fire({
            text: "You Have Set Up Your Pin Successfully",
            icon: "success",
            confirmButtonText: "OK",
        });
        console.log("Redirecting...");
        setTimeout(() => {
            location.href = `../Pages/dashboard.html?id=${userID}`;
        }, 2000);
    } catch (error) {
        console.log(error);
        errorP.textContent = error.message;
    } finally {
        loadingCon.classList.remove("loadBack");
        setPinText.style.display ="block";
        submitBTN.disabled = false;
        submitBTN.classList.remove("cursorNo");
    }
}
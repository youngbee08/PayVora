let searchParams = new URLSearchParams(location.search);
let userID;
let transactions = [];
if (searchParams.has("id")) {
    userID = searchParams.get("id");
    console.log(`User ID:${userID}`);
    document.body.style.display="flex";
}
else{
    location.href = 'signin.html';
}
export function whatUserDo() {
    return class User {
        #balance;
        constructor(name,balance) {
            this.#balance = balance;
            this.name=name;
        }
        getBalance() {
            return this.#balance;
        }
        send(amount) {
            if (this.#balance >= amount) {
                this.#balance -= amount;
                return this.#balance;
            }
            else{
                throw new Error("Insufficient Balance");
            }
        }
        deposit(amount) {
            this.#balance += amount
            return this.#balance
        }
        updateBalance(newBalance){
            return this.#balance = newBalance;
        }
    }
}
function generateAccountNumber() {
    let number = '';
    for (let i = 0; i < 10; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
}
function copyAccountNumber() {
    const number = document.getElementById('accountNumberSpan').innerText;
    navigator.clipboard.writeText(number).then(() => {
      Swal.fire('Copied', `${number} Is Copied to Clipboard`, 'success');
    });
}
if (document.querySelector(".fa-copy")) {
    const copyIcon = document.querySelector(".fa-copy");
    copyIcon.addEventListener("click", copyAccountNumber)
}
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,collection,doc,getDoc,getDocs,updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth,signOut,onAuthStateChanged,deleteUser,updatePassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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
//Initialize AUth
const auth = getAuth(app);
const userColRef = collection(db, "PayVora Users");
const transactionColRef = collection(db, `User ${userID} Transactions`);
const bodyLoader = document.querySelector(".spinner");
const overlay = document.querySelector(".overlay");
const sendForm = document.getElementById("sendForm");
async function getUserDetails() {
    try {
        bodyLoader.style.display = "block";
        overlay.style.display = "block";
        const userDocRef = doc(userColRef, userID);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
            location.href = 'signin.html';
            return
        }
        const userData = docSnap.data();
        console.log(userData);
        if (document.getElementById("greetP")) {
            const greetP = document.getElementById("greetP");
            greetP.innerHTML = "";
            greetP.innerHTML += `Hi, ${userData.lastName}👋`;
        }
        if (document.querySelector("#balanceP")) {
            const balanceP = document.querySelector("#balanceP");
            balanceP.innerHTML = `&#8358; ${userData.balance}`;
        }
        if (document.getElementById("newName")) {
            const newName = document.getElementById("newName");
            newName.value = userData.firstName;
        }        
        if (document.getElementById("newlastName")) {
            const newlastName = document.getElementById("newlastName");
            newlastName.value = userData.lastName;
        }        
        if (document.getElementById("newTel")) {
            const newTel = document.getElementById("newTel");
            newTel.value = userData.phone;
        }
        if ("profilePic" in userData) {
            console.log(true);
            document.querySelectorAll(".profileContainer2").forEach(eachPicCon =>{
                eachPicCon.style.display="block";
            });
            document.querySelectorAll(".profileImg").forEach(eachPic =>{
                eachPic.style.display="block";
                eachPic.src=`${userData.profilePic}`;
            });
            document.querySelectorAll(".fa-useri").forEach(eachIcon =>{
                eachIcon.style.display="none";
            });
        }
        if (!"profilePic" in userData) {
            console.log(true);
            document.querySelectorAll(".profileImg").forEach(eachPic => {
                eachPic.style.display="none";
            });
            document.querySelectorAll(".profileContainer2").forEach(eachPicCon =>{
                eachPicCon.style.display="none";
            });
            document.querySelectorAll(".fa-useri").forEach(eachPic => {
                eachPic.style.display="block";
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        bodyLoader.style.display = "none";
        overlay.style.display = "none";
    }
}
getUserDetails()
export async function refreshBalance() {
    const userDocRef = doc(userColRef, userID);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        const userData = docSnap.data();
        if (document.querySelector("#balanceP")) {
            const balanceP = document.querySelector("#balanceP");
            balanceP.innerHTML = `&#8358; ${userData.balance}`;
        }
    }
}
const balanceDiv = document.querySelector(".balanceDiv");
export function closeBalance(newUser) {
    if (!balanceDiv) return;
    balanceDiv.innerHTML = `
        <i class="fa-solid fa-eye-slash balanceEye-slash"></i>
        <p id="balanceP" style="font-size:30px; transform: translateY(.2rem);">****</p>
    `;
    document.querySelector(".balanceEye-slash").addEventListener("click", () => openBalance(newUser));
}
export async function openBalance(newUser) {
    if (!balanceDiv) return;
    const userDocRef = doc(userColRef, userID);
    const docSnap = await getDoc(userDocRef);
    let latestBalance = docSnap.exists() ? docSnap.data().balance : 0;
    newUser.updateBalance(latestBalance);

    balanceDiv.innerHTML = `
        <i class="fa-solid fa-eye balanceEye"></i>
        <p id="balanceP">&#8358;${latestBalance}</p>
    `;

    document.querySelector(".balanceEye").addEventListener("click", () => closeBalance(newUser));
}
if (document.querySelector(".balanceEye")) {
    const balanceEye = document.querySelector(".balanceEye");
    balanceEye.addEventListener("click", closeBalance);
}
if (document.getElementById("sendMoneyA")) {
    const sendMoneyA = document.querySelectorAll("#sendMoneyA").forEach(eachA => {
        eachA.addEventListener("click", goToSendMoney)
    });
}
if (document.getElementById("addMoneyA")) {
    const addMoneyA = document.getElementById("addMoneyA");
    addMoneyA.addEventListener("click", goToDepositMoney);
    console.log("present");
    
}
if (document.querySelectorAll("#goToProfile")) {
    const goTOProfile = document.querySelectorAll("#goToProfile");
    goTOProfile.forEach(eachLink =>{
        eachLink.addEventListener("click", goToEditProfile)
    });
}
if (document.querySelectorAll("#goToOverview")) {
    const goToOverview = document.querySelectorAll("#goToOverview");
    goToOverview.forEach(eachLink =>{
        eachLink.addEventListener("click", goToOverView)
    });
}
if (document.querySelectorAll("#goToTransaction")) {
    const goToTransaction = document.querySelectorAll("#goToTransaction");
    goToTransaction.forEach(eachLink =>{
        eachLink.addEventListener("click", goTOTRANSACTION)
    });
}
if (document.querySelectorAll("#goToLoans")) {
    const goToLoans = document.querySelectorAll("#goToLoans");
    goToLoans.forEach(eachLink =>{
        eachLink.addEventListener("click", goToLoan)
    }); 
}
if (document.querySelectorAll("#changePassA")) {
    const changePassA = document.querySelectorAll("#changePassA");
    changePassA.forEach(eachLink =>{
        eachLink.addEventListener("click", goToChangePassword)
    }); 
}
function goToSendMoney(e) {
    e.preventDefault()
    location.href = `../Pages/sendMoney.html?id=${userID}`;
}
function goToChangePassword(e) {
    e.preventDefault()
    location.href = `../Pages/changePassword.html?id=${userID}`;
}
function goToEditProfile(e) {
    e.preventDefault()
    location.href = `../Pages/account.html?id=${userID}`;
}
function goToOverView(e) {
    e.preventDefault()
    location.href = `../Pages/dashboard.html?id=${userID}`;
}
function goTOTRANSACTION(e) {
    e.preventDefault()
    location.href = `../Pages/transactions.html?id=${userID}`;
}
function goToDepositMoney(e) {
    e.preventDefault()
    location.href = `../Pages/addMoney.html?id=${userID}`;
    console.log("clicked");
    
}
function goToLoan(e) {
    e.preventDefault()
    location.href = `../Pages/loan.html?id=${userID}`;
    console.log("clicked");
    
}
function goToSettings() {
    if (document.querySelector(".hiddenSettings")) {
        const hiddenSettings = document.querySelector(".hiddenSettings");
        hiddenSettings.classList.toggle("displaySettings");
    }
}
function closeSettings() {
    if (document.querySelector(".hiddenSettings")) {
        const hiddenSettings = document.querySelector(".hiddenSettings");
        hiddenSettings.classList.remove("displaySettings");
    }
}
if (document.querySelector(".hiddenSettings")) {
    const hiddenSettings = document.querySelector(".hiddenSettings");
    hiddenSettings.addEventListener("click", closeSettings)
}
if (document.querySelector(".settingsI")) {
    const settingsI = document.querySelector(".settingsI");
    settingsI.addEventListener("click", goToSettings)
}
function goToSetPin(e) {
    e.preventDefault()
    location.href = `../Pages/setPin.html?id=${userID}`;
}
if (document.getElementById("resetA")) {
    const resetA = document.getElementById("resetA");
    resetA.addEventListener("click", goToSetPin);
}
document.addEventListener("DOMContentLoaded", function(){
    function changeTheme() {
        document.body.classList.toggle("whiteTheme");
        document.querySelector(".first-content").classList.toggle("whiteTheme2");
        document.querySelector("#header").classList.toggle("headerTheme");
        document.querySelectorAll(".headerLinks").forEach(link => {
            link.classList.toggle("headerTheme");
        });
        document.querySelectorAll(".iconsI").forEach(iconI => {
            iconI.classList.toggle("headerTheme");
        });
        document.querySelectorAll(".card").forEach(eachCard => {
            eachCard.classList.toggle("headerTheme");
        });
        document.querySelector(".hiddenlinks").classList.toggle("whiteTheme")
        document.querySelectorAll(".present2").forEach(eachPresent => {
            eachPresent.classList.toggle("whiteTheme");
        });
        document.querySelectorAll(".fas").forEach(eachfas => {
            eachfas.classList.toggle("whiteTheme3");
        });
        document.querySelector(".present").classList.toggle("whiteTheme");
        document.querySelector("#sendMoneyA").classList.toggle("whiteTheme");
        document.querySelector("#addMoneyA").classList.toggle("whiteTheme");
        document.querySelector(".transactions").classList.toggle("transactionsTheme");
        document.querySelector(".seeAllTransactionsA").classList.toggle("whiteTheme");
        document.querySelectorAll("tbody tr:nth-child(odd)").forEach(eachOddTr => {
            eachOddTr.classList.toggle("whiteTheme2");
        });
        document.querySelectorAll("tbody tr:nth-child(even)").forEach(eachOddTr => {
            eachOddTr.classList.toggle("whiteTheme4");
        });
        document.querySelector(".hiddenSettings").classList.toggle("whiteTheme");
        document.querySelector(".settingsh3").classList.toggle("whiteTheme");
        document.querySelectorAll(".settingsA").forEach(eachsettingsA => {
            eachsettingsA.classList.toggle("whiteTheme");
        });
        document.querySelectorAll(".settingsI2").forEach(eachsettingsI2 => {
            eachsettingsI2.classList.toggle("iTheme");
        });
        document.querySelectorAll(".settingsI22").forEach(eachsettingsI22 => {
            eachsettingsI22.classList.toggle("dangerTheme");
        });
        document.querySelectorAll(".danger").forEach(eachdangerA => {
            eachdangerA.classList.toggle("dangerTheme");
        });
    }
    if (document.getElementById("themeA")) {
        const themeA = document.getElementById("themeA");
        themeA.addEventListener("click", function(e){
            e.preventDefault()
            changeTheme()
        });
    }
});
export async function displayTransactions() {
    try {
        const querySnap = await getDocs(transactionColRef);
        console.log(querySnap);
        if (querySnap.empty){
            if (document.getElementById("tBody")) {
                const tBody = document.getElementById("tBody");
                tBody.innerHTML = "" ;
                tBody.innerHTML += `
                   <tr>
                     <td colspan="5" style="text-align: center;">No Recent Transaction(s)</td>
                   </tr>
                `;
            }
            return
        }
        querySnap.forEach((docSnap) =>{
            const wholeTransactions = docSnap.data();
            transactions.push(wholeTransactions);
            console.log(transactions);
            
            if (document.getElementById("tBody")) {
                const tBody = document.getElementById("tBody");
                tBody.innerHTML += "" ;
                tBody.innerHTML += `
                  <tr>
                    <td>${wholeTransactions.accountNumber}</td>
                    <td>${wholeTransactions.name}</td>
                    <td>${wholeTransactions.date}</td>
                    <td class="des">${wholeTransactions.description}</td>
                    <td class="type">${wholeTransactions.transactiontype}</td>
                  </tr>
                `;
            }
        });
        
    } catch (error) {
        console.log(error);
        
    }
}
displayTransactions()
function displayQrCode() {
    if (document.getElementById("newlastName")) {
        const newlastName = document.getElementById("newlastName");
        let userURL = `https://google.com/profile?name=${encodeURIComponent(newlastName)}`;
        document.getElementById("qrCode").innerHTML = "";
            new QRCode(document.getElementById("qrCode"), {
                text: userURL,
                width: 328,
                height: 328
            });
        }
    }
displayQrCode()
async function updateAccount(e) {
    try {
        e.preventDefault();
        errorP.textContent = "";
        const image = document.getElementById("image");
        const nigeriaPhoneNumberFormat = /^(?:\+234|0)[789][01]\d{8}$/;
        if (!image) {
            throw new Error("No file input found in this HTML file.");
            return;
        }

        if (!image.files.length) {
            throw new Error("No file selected!");
            return;
        }

        const file = image.files[0];
        const reader = new FileReader();

        reader.onloadend = async function () {
            bodyLoader.style.display = "block";
            overlay.style.display = "block";
            const result = reader.result;
            const userDetails = {
                firstName: document.getElementById("newName")?.value.trim() || "",
                lastName: document.getElementById("newlastName")?.value.trim() || "",
                phone: document.getElementById("newTel")?.value.trim() || "",
                profilePic: result
            };
            if (!nigeriaPhoneNumberFormat.test(userDetails.phone)) {
                errorP.textContent = "Invalid Phone Number"
                return
            }
            console.log(userDetails);
            const usersDocRef = doc(userColRef, userID)
            await updateDoc(usersDocRef, userDetails);
            bodyLoader.style.display = "none";
            overlay.style.display = "none";
            Swal.fire({
                text: "You Have Updated Your Profile Successfully",
                icon: "success",
                confirmButtonText: "OK",
            });
            console.log("Redirecting...");
            setTimeout(() => {
                location.href = `../Pages/dashboard.html?id=${userID}`;
            }, 2000);
        };

        reader.readAsDataURL(file);

    } catch (error) {
        errorP.textContent = error.message;
        errorP.style.color = "red";
        console.log(error);
    } finally {
    }
}
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("updateForm")) {
        const updateForm = document.getElementById("updateForm");
        updateForm.addEventListener("submit", updateAccount);
    }
});
async function logOutUser(e) {
    e.preventDefault()
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your account.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Sign out!",
        cancelButtonText: "No, cancel!",
    });
    if (result.isConfirmed) {
        try {
            bodyLoader.style.display = "block";
            overlay.style.display = "block";
            await signOut(auth);
            Swal.fire({
                text: "You Have Signed Out Successfully",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            Swal.fire(
                "Error",
                "An error occured while signing out.",
                "error",
            );
            if (error.message === "Firebase: Error (auth/requires-recent-login).") {
                Swal.fire("Session Expired", "Please Log In Again", "warning")
            }
            console.log(error);
        } finally {
            bodyLoader.style.display = "none";
            overlay.style.display = "none";
        }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
            "Cancelled",
            "You are still signed in.",
            "info",
        );
    }
}
async function deleteAccount(e) {
    e.preventDefault()
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will delete your Account Permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete!",
        cancelButtonText: "No, cancel!",
    });
    if (result.isConfirmed) {
        try {
            bodyLoader.style.display = "block";
            overlay.style.display = "block";
            const user = auth.currentUser;
            await deleteUser(user);
            Swal.fire({
                text: "You Have Deleted Your Account Successfully",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            Swal.fire(
                "Error",
                "An error occured while deleting Account.",
                "error",
            );
            console.log(error);
            if (error.message === "Firebase: Error (auth/requires-recent-login).") {
                Swal.fire("Session Expired", "Please Log In Again", "warning")
            }
        } finally {
            bodyLoader.style.display = "none";
            overlay.style.display = "none";
        }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
            "Cancelled",
            "You are still signed in.",
            "info",
        );
    }
}
async function changePassword(e) {
    e.preventDefault()
    try {
        const passwordFormat = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        errorP.textContent = "";
        loadingCon.classList.add("loadBack");
        prodeedtext.style.display ="none";
        proceedBTN.disabled = true;
        proceedBTN.classList.add("cursorNo");
        const newPassword = sendForm.password.value;
        const confirmNewPassword = sendForm.confirmPassword.value;
        if (newPassword.length < 6) {
            throw new Error("*Password Should Be More Than Six Characters");
        }
        if (!/[A-Z]/.test(newPassword)) {
            throw new Error("*Password must contain at least one uppercase letter (A-Z).");
        }
        if (!/[a-z]/.test(newPassword)) {
            throw new Error("*Password must contain at least one lowercase letter (a-z).");
        }
        if (!/\d/.test(newPassword)) {
            throw new Error("*Password must include at least one number (0-9).");
        }
        if (!/[@$!%*?&]/.test(newPassword)) {
            throw new Error("*Password must have at least one special character (@, $, !, %, *, ?, &).");
        }
        if (newPassword !== confirmNewPassword) {
            throw new Error("*Password does not match");
        }
        await updatePassword(auth.currentUser, newPassword);
        Swal.fire({
            text: "Password Changed Successfully",
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
        if (error.message === "Firebase: Error (auth/requires-recent-login)."){
            errorP.style.color = "red";
            errorP.innerHTML =`Session Expired, Please Try <a href="./signin.html">Logging In</a>Again`
            return
        }
        errorP.textContent = error.message;
    } finally {
        loadingCon.classList.remove("loadBack");
        prodeedtext.style.display ="block";
        proceedBTN.disabled = false;
        proceedBTN.classList.remove("cursorNo");
    }
}
if (document.getElementById("sendForm")) {
    const sendForm = document.getElementById("sendForm");
    sendForm.addEventListener("submit", changePassword);
}
if (document.getElementById("signOutA")) {
    const signOutA = document.getElementById("signOutA");
    signOutA.addEventListener("click", logOutUser);
}
if (document.getElementById("deleteA")) {
    const deleteA = document.getElementById("deleteA");
    deleteA.addEventListener("click", deleteAccount);
}
onAuthStateChanged(auth,async (user)=>{
    if (user) {
        console.log("User is signed in", user);
        const uid = user.uid;
        const userDocRef = doc(userColRef, uid);
        const docSnap = await getDoc(userDocRef);
        const userData = docSnap.data();
        if (docSnap.exists && userData.accountNumber) {
            document.getElementById("fa-copy").style.display = "inline-block";
            document.getElementById("accountNumberSpan").innerText = userData.accountNumber;
        } else {
            const accountNumberSpan = generateAccountNumber();
            if (!userData.accountNumber) {
                await updateDoc(userDocRef, {
                    accountNumber: accountNumberSpan,
                });
            }
            document.getElementById("fa-copy").style.display = "inline-block";
            document.getElementById("accountNumberSpan").innerText = accountNumberSpan;
        }
    }else{
        console.log("No one is signed In");
        setTimeout(() => {
            location.href = 'signin.html';
        }, 3000);
    }
})
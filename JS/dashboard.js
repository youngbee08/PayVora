let searchParams = new URLSearchParams(location.search);
let userID;
let transactions = [];
if (searchParams.has("id")) {
    userID = searchParams.get("id");
    console.log(`User ID:${userID}`);
    document.body.style.display="block";
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
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,collection,doc,getDoc,getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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
const userColRef = collection(db, "PayVora Users");
const transactionColRef = collection(db, `User ${userID} Transactions`);
async function getUserDetails() {
    try {
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
            return
        }
        if (document.querySelector("#balanceP")) {
            const balanceP = document.querySelector("#balanceP");
            balanceP.innerHTML = `&#8358; ${userData.balance}`;
        }
    } catch (error) {
        console.log(error);  
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
    const sendMoneyA = document.getElementById("sendMoneyA");
    sendMoneyA.addEventListener("click", goToSendMoney);
}
if (document.getElementById("addMoneyA")) {
    const addMoneyA = document.getElementById("addMoneyA");
    addMoneyA.addEventListener("click", goToDepositMoney);
    console.log("present");
    
}
function goToSendMoney(e) {
    e.preventDefault()
    location.href = `../Pages/sendMoney.html?id=${userID}`;
}
function goToDepositMoney(e) {
    e.preventDefault()
    location.href = `../Pages/addMoney.html?id=${userID}`;
    console.log("clicked");
    
}
function goToSettings() {
    if (document.querySelector(".hiddenSettings")) {
        const hiddenSettings = document.querySelector(".hiddenSettings");
        hiddenSettings.classList.toggle("displaySettings");
    }
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
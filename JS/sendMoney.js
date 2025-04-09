import { whatUserDo,openBalance,closeBalance,refreshBalance } from './dashboard.js';
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore,collection,doc,getDoc,addDoc,updateDoc,getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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
const db = getFirestore(app);
const userColRef = collection(db, "PayVora Users Pin");
const userColRefBalance = collection(db, "PayVora Users");
const userTransactionsColRef = collection(db, `User ${userID} Transactions`);
let newUser;
async function initializeUser() {
    try {
        const userDocRef = doc(userColRefBalance, userID);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            throw new Error("User data not found!");
        }

        const userData = docSnap.data();
        const latestBalance = userData.balance || 0;

        const User = whatUserDo();
        newUser = new User(userData.lastName, latestBalance);
        console.log("User initialized with balance:", newUser.getBalance());
        console.log(newUser);
        
        openBalance(newUser);
        closeBalance(newUser);
    } catch (error) {
        console.error("Error initializing user:", error);
    }
}
initializeUser();
let sendForm;
if (document.getElementById("sendForm")) {
    sendForm = document.getElementById("sendForm");
    sendForm.addEventListener("submit", sendMoney);
}
async function updateBalance(userID, newBalance) {
    const userDocRef = doc(userColRefBalance, userID);
    await updateDoc(userDocRef, {balance: newBalance});
    const updatedDocSnap = await getDoc(userDocRef);
    return updatedDocSnap.exists() ? updatedDocSnap.data().balance:0;
}
async function sendMoney(e) {
    errorP.textContent = "";
    try {
        loadingCon.classList.add("loadBack");
        prodeedtext.style.display ="none";
        proceedBTN.disabled = true;
        proceedBTN.classList.add("cursorNo");
        let errorP = document.getElementById("errorP");
        const senderDocRef = doc(userColRefBalance, userID);
        const senderDocSnap = await getDoc(senderDocRef);
        const senderData = senderDocSnap.data();
        const senderAccountNumber = senderData.accountNumber || "Unknown";
        const senderAccountName = senderData.lastName || "Anonymous";
        const accountInp = sendForm.accountNumber.value.trim();
        const pinInp = sendForm.pin.value.trim();
        e.preventDefault()
        const pinDocRef = doc(userColRef, userID);
        const docSnap = await getDoc(pinDocRef);
        const pin = docSnap.data();
        console.log(pin);        
        if (pinInp !== pin.pin) {
            throw new Error("*Incorrect Pin");
        }
        if (accountInp.length > 10 || accountInp.length < 10) {
            throw new Error("*Invalid Account Number");
        }
        if (!sendForm.amount.value.trim()) {
            throw new Error("*Please enter an amount to send.");
        }
        if (sendForm.amount.value.trim() <= 0) {
            throw new Error("*Invalid Amount");
        }
        console.log("Every thing Cool");
        let date = new Date;
        const transactionDetails = {
            name:sendForm.holderName.value.trim(),
            accountNumber:"To" + " " + sendForm.accountNumber.value.trim(),
            description:sendForm.description.value.trim(),
            amount:"-₦" + sendForm.amount.value.trim(),
            transactiontype:"Debit",
            date:date.toLocaleDateString()
        };
        console.log(transactionDetails);
        const allUsersSnapshot  = await getDocs(userColRefBalance);
        let receiverDoc = null;
        allUsersSnapshot.forEach(doc => {
            const data = doc.data(  );
            if (data.accountNumber && data.accountNumber === accountInp) {
                receiverDoc = doc;
            }
            console.log(data);
        });
        if (!receiverDoc) {
            throw new Error("*Receiver account not found.");
        }
        if (receiverDoc.id === userID) {
            throw new Error("*You cannot send money to yourself.");
        }
        newUser.send(+sendForm.amount.value.trim());
        const updatedBalance = await updateBalance(userID, newUser.getBalance());
        if (document.querySelector("#balanceP")) {
            const balanceP = document.querySelector("#balanceP");
            balanceP.innerHTML="";
            balanceP.innerHTML=`&#8358; ${updatedBalance}`;
        }
        await refreshBalance();
        const receiverRef = receiverDoc.ref;
        const receiverData = receiverDoc.data();
        const receiverNewBalance = (receiverData.balance || 0) + parseFloat(sendForm.amount.value.trim());
        await updateDoc(receiverRef, { balance: receiverNewBalance });
        const receiverTransactionRef = collection(db, `User ${receiverDoc.id} Transactions`);
        const receiverTransaction = {
            name: senderAccountName,
            accountNumber: "From " + senderAccountNumber,
            description: sendForm.description.value.trim(),
            amount:"₦" + sendForm.amount.value.trim(),
            transactiontype: "Credit",
            date: date.toLocaleDateString(),
        };
        const transactionDocRef = await addDoc(userTransactionsColRef, transactionDetails);
        await addDoc(receiverTransactionRef, receiverTransaction);
        console.log("Transaction Successful");
        Swal.fire({
            text: "Transaction Successful",
            icon: "success",
            confirmButtonText: "OK",
        });
        setTimeout(() => {
            location.href = `../Pages/dashboard.html?id=${userID}`;
        }, 3000);
    } catch (error) {
        console.log(error);
        if (error.message === "Cannot read properties of undefined (reading 'pin')") {
            errorP.innerHTML =`You haven't set up your pin,     <a href="../Pages/setPin.html?id=${userID}">Set Up Pin Now</a>`;
            return
        }
        if (error.message === "Failed to get document because the client is offline.") {
            errorP.innerHTML = `No Internet, Please Try Again Later`;
        }
        if (error.message === "Cannot read properties of undefined (reading 'send')") {
            errorP.innerHTML = `Transaction Failed, Please Try Again Later`;
        }
        errorP.textContent = error.message;
    } finally {
        loadingCon.classList.remove("loadBack");
        prodeedtext.style.display ="block";
        proceedBTN.disabled = false;
        proceedBTN.classList.remove("cursorNo");
    }
}
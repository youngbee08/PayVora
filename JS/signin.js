const eyeCon = document.querySelector(".eye");
const eyeSlash = document.querySelector(".fa-eye-slash");
const logo = document.getElementById("logo");
logo.addEventListener("click", reDirectLogo);
const passwordINP = document.getElementById("password");
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

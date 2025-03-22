const barsCon = document.querySelector('.bars');
const bars = document.querySelector('#bars');
bars.addEventListener('click', displayMenu);
const barContent = document.querySelector('#bar-content');
const header = document.querySelector('#header');
const signUp = document.querySelector('#signUpBTN');
const signIn = document.querySelector('#logInBTN');
const upCon = document.querySelector(".up-con");
const getStartedBtn = document.getElementById("getStartedBtn");
signUp.addEventListener('click', goTOSignUp);
signIn.addEventListener('click', goTOSignIn);
window.addEventListener('scroll', scrollHeader);
window.addEventListener("scroll", scrollUp)
upCon.addEventListener("click", toUp)
getStartedBtn.addEventListener("click", goTOSignUp)
function scrollHeader() {
    if (window.scrollY > 0) {
        header.style.backgroundColor = "white";
        barContent.style.backgroundColor = "white";
    } else {
        header.style.backgroundColor = "red";
        barContent.style.backgroundColor = "red";
    }
}
function displayMenu() {
    barContent.classList.add('dislay-back');
    barsCon.innerHTML = `<i class="fas fa-times" id="times"></i>`;
    document.querySelector('#times').addEventListener('click', closeMenu);
}
function closeMenu() {
    barContent.classList.remove('dislay-back');
    barsCon.innerHTML = `<i class="fa-solid fa-bars" id="bars"></i>`;
    document.querySelector('#bars').addEventListener('click', displayMenu);
}

function goTOSignUp() {
    location.href = "../Pages/signup.html";
}
function goTOSignIn() {
    location.href = "../Pages/signin.html";
}
function scrollUp() {
    if (window.scrollY > 100) {
        upCon.style.display="block";
    } else{
        upCon.style.display="none";
    }
}
function toUp() {
    window.scrollTo({top:0, behavior:"smooth"})
}
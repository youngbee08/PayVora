const barsCon = document.querySelector('.bars');
const bars = document.querySelector('#bars');
bars.addEventListener('click', displayMenu);
const barContent = document.querySelector('#bar-content');
const header = document.querySelector('#header');
window.addEventListener('scroll', scrollHeader);
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
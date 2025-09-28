let selectElem = document.querySelector('select'); 
let logo = document.querySelector('img');          

selectElem.addEventListener('change', changeTheme);

function changeTheme() {
    let current = selectElem.value.toLowerCase(); 

    if (current === 'dark') {
        document.body.classList.add("dark-mode");
        logo.style.filter = "brightness(0.8)";
        logo.src = "byui-logo-white.png";
    } else if (current === 'light') {
        document.body.classList.remove("dark-mode"); 
        logo.style.filter = "brightness(1)";
        logo.src = "logo.webp";
    } else {
        document.body.classList.remove("dark-mode");
        logo.style.filter = "brightness(1)";
    }
}

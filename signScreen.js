const submitBtn = document.getElementById("submitBtn");
const registerBtn = document.getElementById("SignUpBtn");
const loginBtn = document.getElementById("logInBtn");
const allLogin = document.querySelectorAll(".login");
const allRegister = document.querySelectorAll(".register");
let loginActive = false;

loginBtn.addEventListener('click', function(){
    allRegister.forEach(each => {
        each.style.display = `none`;
    });

    allLogin.forEach(each => {
        each.style.display = `inline-block`;
    });
});

registerBtn.addEventListener('click', function(){
    allLogin.forEach(each => {
        each.style.display = `none`;
    });

    allRegister.forEach(each => {
        each.style.display = `inline-block`;
    })
})
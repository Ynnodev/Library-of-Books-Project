const submitBtn = document.getElementById("submitBtn");
const registerBtn = document.getElementById("SignUpBtn");
const loginBtn = document.getElementById("logInBtn");
const allLogin = document.querySelectorAll(".login");
const allRegister = document.querySelectorAll(".register");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");
//let variables:
let loginActive = false;

//Have account - Login Button
loginBtn.addEventListener('click', function(){
    loginActive = true;
    allRegister.forEach(each => {
        each.style.display = `none`;
    });

    allLogin.forEach(each => {
        each.style.display = `inline-block`;
    });
});

//No account - Register button
registerBtn.addEventListener('click', function(){
    loginActive = false;
    allLogin.forEach(each => {
        each.style.display = `none`;
    });

    allRegister.forEach(each => {
        each.style.display = `inline-block`;
    })
})

//Submit info button
submitBtn.addEventListener('click', function(event){
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password){
        event.preventDefault();
        errorMessage.style.display = `block`
    }

    if (!loginActive){
        registerUser(username, password);
    }

    if (loginActive){
        
    }

});

//register/login logic
const usersKey = "libraryUsers";

function registerUser(username, password){
    const users = JSON.parse(localStorage.getItem(usersKey)) || {};

    if (users[username]){
        console.log("Username already taken!");
        return;
    }

    users[username] = {
        password: password,
        myBooks: {},
        favorites: {}
    }

    localStorage.setItem(usersKey, JSON.stringify(users));
    console.log("Registration successful!");
}

export function getUser(username){
    const users = JSON.parse(localStorage.getItem(usersKey));
    return users[username];
}
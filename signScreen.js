const form = document.getElementById("mainForm");
const submitBtn = document.getElementById("submitBtn");
const registerBtn = document.getElementById("SignUpBtn");
const loginBtn = document.getElementById("logInBtn");
const allLogin = document.querySelectorAll(".login");
const allRegister = document.querySelectorAll(".register");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");

const usersKey = "libraryUsers";
//let variables:
let loginActive = false;

//Have account - Login Button
loginBtn.addEventListener('click', function(){ //The form thinks this button is to send user info
    loginActive = true;
    allRegister.forEach(each => each.style.display = "none");

    allLogin.forEach(each => each.style.display = "inline-block");
});

//No account - Register button
registerBtn.addEventListener('click', function(){ //The form thinks this button is to send user info
    loginActive = false;
    allLogin.forEach(each => each.style.display = "none");

    allRegister.forEach(each => each.style.display = "inline-block")
})

//Submit form
form.addEventListener('submit', function(event){
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password){
        event.preventDefault();
        console.log("Error: missing information");
        errorMessage.textContent = `Error: missing information`
        errorMessage.style.display = "inline-block";
        return;
    }

    if (!loginActive){
        console.log("Registering...");
        registerUser(username, password);
    }

    if (loginActive){
        const users = JSON.parse(localStorage.getItem(usersKey));
        if (authenticateUser(username, password)){
            console.log(`Welcome back, ${username}`);
            errorMessage.textContent = `Welcome back, ${username}`;
            errorMessage.style.color = `green`;
            errorMessage.style.display = "inline-block"
            setTimeout(() => {
                document.location.href = "index.html";
            }, 2000)
        }else{
            console.log("Error!");
            return false;
        }
    }
});

//register/login logic
function registerUser(username, password){
    const users = JSON.parse(localStorage.getItem(usersKey)) || {};

    if (users[username]){
        console.log("Username already taken!");
        errorMessage.textContent = `Username already taken`;
        errorMessage.style.display = `block`
        return false;
    }

    users[username] = {
        password: password,
        myBooks: {},
        favorites: {}
    }

    localStorage.setItem(usersKey, JSON.stringify(users));
    console.log("Registration successful!");
    return true;
}

function authenticateUser(username, password){
    const users = JSON.parse(localStorage.getItem(usersKey));

    if (!users[username]){
        console.log("Sorry, username doesn't exist!");
        errorMessage.textContent = `Sorry, username doesn't exist!`;
        return false;
    }

    if (users[username].password !== password){
        console.log("Sorry, wrong password!");
        errorMessage.style.display = "inline-block";
        errorMessage.textContent = `Error: wrong password`;
        return false;
    }

    return true;
}

function getUser(username){ //To do: Make this available for other files!!
    const users = JSON.parse(localStorage.getItem(usersKey));
    return users[username];
}
import { loginUser, saveUser } from "../api/users.js";

const formRegister = document.querySelector("#register");
const formLogin = document.querySelector("#login");
const logoutBtn = document.querySelector("#logout");

export function register(){  
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formRegister);
        if(formData.get("password") !== formData.get("confirmPassword")) {
            alert("Passwords do not match!");
            return;
        }

        const entries = Object.fromEntries(formData.entries());
        saveUser(entries).then(res => document.cookie=`current_user_id=${res.id}; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`);

        if(document.cookie.includes("current_user_id")){
            document.location.href = "/index.html";
        }
    });
}

export function login(){
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formLogin);
        const entries = Object.fromEntries(formData.entries());

        loginUser(entries).then(res => {
            if(res.status == 500){
                alert("Usuário ou Senha inválidos!");
                return;
            }

            document.cookie=`current_user_id=${res.id}; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`
            document.location.href = "./index.html";
        });
    });
}

export function logout(){
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.cookie = "current_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        document.location.href="./login.html";
    })
}
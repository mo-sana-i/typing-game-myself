const correctPassword = "好きなパスワード";

const loginScreen = document.getElementById("loginScreen");
const siteContent = document.getElementById("siteContent");

const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

function login() {
  if (passwordInput.value === correctPassword) {
    loginScreen.classList.add("hidden");
    siteContent.classList.remove("hidden");

    passwordInput.value = "";
    loginMessage.textContent = "";
  } else {
    loginMessage.textContent =
      "パスワードが違います。";
  }
}

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    login();
  }
});

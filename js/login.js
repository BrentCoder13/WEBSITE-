const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {

      const user = userCredential.user;

      // Check if email verified
      if (user.emailVerified) {

        loginMessage.style.color = "green";
        loginMessage.textContent = "Login successful! Redirecting...";

        setTimeout(() => {
          window.location.href = "get-started.html";
        }, 1000);

      } else {

        loginMessage.style.color = "red";
        loginMessage.textContent = "Please verify your email first.";

        auth.signOut();

      }

    })
    .catch((error) => {

      loginMessage.style.color = "red";
      loginMessage.textContent = error.message;

    });
});
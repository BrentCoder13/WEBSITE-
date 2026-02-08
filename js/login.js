const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Firebase login
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Optional: show temporary success message
      loginMessage.style.color = "green";
      loginMessage.textContent = "Login successful! Redirecting...";

      // Automatic redirect
      window.location.href = "get-started.html"; // palitan ng page na gusto mo
    })
    .catch((error) => {
      loginMessage.style.color = "red";
      loginMessage.textContent = error.message;
    });
});

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    signupMessage.style.color = "red";
    signupMessage.textContent = "All fields are required.";
    return;
  }

  if (name.length > 40) {
    signupMessage.style.color = "red";
    signupMessage.textContent = "Full name must not exceed 40 characters.";
    return;
  }

  if (password.length < 10) {
    signupMessage.style.color = "red";
    signupMessage.textContent = "Password must be at least 10 characters.";
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await user.sendEmailVerification();

    await db.collection("users").doc(user.uid).set({
      name: name,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    signupMessage.style.color = "green";
    signupMessage.textContent = "Signup successful! Please check your email to verify your account.";

    signupForm.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);

  } catch (error) {
    signupMessage.style.color = "red";
    signupMessage.textContent = error.message;
  }
});
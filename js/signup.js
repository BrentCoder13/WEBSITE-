const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("full_name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Firebase signup
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save additional info to Firestore
      db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        createdAt: new Date()
      })
      .then(() => {
        // Success → redirect sa ibang page
        window.location.href = "get-started.html"; // palitan ng page na gusto mo
      })
      .catch((error) => {
        alert("Error saving user data: " + error.message);
      });
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
});

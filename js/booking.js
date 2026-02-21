const bookingForm = document.getElementById("bookingForm"); 
const bookingMessage = document.getElementById("bookingMessage");

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full_name").value;
  const email = document.getElementById("email").value;
  const contactNumber = document.getElementById("contact_number").value;
  const address = document.getElementById("address").value;
  const serviceDate = document.getElementById("service_date").value;

  const user = auth.currentUser;
  if (!user) {
    bookingMessage.style.color = "red";
    bookingMessage.textContent = "You must be logged in to submit a booking.";
    return;
  }

  // Save booking sa Firestore
  db.collection("bookings").add({
    userId: user.uid,
    fullName: fullName,
    email: email,
    contactNumber: contactNumber,
    address: address,
    serviceDate: serviceDate,
    status: "Pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then((docRef) => {
    bookingMessage.style.color = "green";
    bookingMessage.textContent = "Booking submitted successfully! Redirecting...";
    bookingForm.reset();

    // Redirect sa account management at highlight booking
    window.location.href = `Account.html?bookingId=${docRef.id}`;
  })
  .catch((error) => {
    bookingMessage.style.color = "red";
    bookingMessage.textContent = "Error: " + error.message;
  });
});

const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full_name").value;
  const email = document.getElementById("email").value;
  const contactNumber = document.getElementById("contact_number").value;
  const address = document.getElementById("address").value;
  const serviceDate = document.getElementById("service_date").value;

  // Siguraduhin na naka-login ang user
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
    createdAt: new Date()
  })
  .then(() => {
    bookingMessage.style.color = "green";
    bookingMessage.textContent = "Booking submitted successfully!";
    bookingForm.reset();

    // Optional: redirect sa confirmation page
    // window.location.href = "booking-confirmation.html";
  })
  .catch((error) => {
    bookingMessage.style.color = "red";
    bookingMessage.textContent = "Error: " + error.message;
  });
});

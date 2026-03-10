// 🔹 Booking.js - Full Updated Version

const bookingForm = document.getElementById("bookingForm"); 
const bookingMessage = document.getElementById("bookingMessage");

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const contactNumber = document.getElementById("contact_number").value.trim();
  const address = document.getElementById("address").value.trim();
  const serviceDate = document.getElementById("service_date").value;

  const user = auth.currentUser;
  if (!user) {
    bookingMessage.style.color = "red";
    bookingMessage.textContent = "You must be logged in to submit a booking.";
    return;
  }

  try {
    // 🔹 Check latest booking for this user
    const bookingsSnapshot = await db.collection("bookings")
      .where("userId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!bookingsSnapshot.empty) {
      const latestBooking = bookingsSnapshot.docs[0].data();
      if (latestBooking.status === "Rejected") {
        bookingMessage.style.color = "red";
        bookingMessage.innerHTML = `
          Your previous booking on ${latestBooking.serviceDate} was rejected.
          ${latestBooking.rejectionReason ? `<br>Reason: ${latestBooking.rejectionReason}` : ""}
          <br>Please fill out the form below to submit a new request.
        `;
      }
    }

    // 🔹 Prevent multiple pending bookings
    const pendingSnapshot = await db.collection("bookings")
      .where("userId", "==", user.uid)
      .where("status", "==", "Pending")
      .get();
    if (!pendingSnapshot.empty) {
      bookingMessage.style.color = "red";
      bookingMessage.textContent = "You already have a pending booking. Please wait for it to be processed.";
      return;
    }

    // 🔹 Save new booking sa Firestore
    const docRef = await db.collection("bookings").add({
      userId: user.uid,
      fullName,
      email,
      contactNumber,
      address,
      serviceDate,
      status: "Pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    bookingMessage.style.color = "green";
    bookingMessage.textContent = "Booking submitted successfully! Redirecting...";
    bookingForm.reset();

    // Redirect sa Account page at highlight booking
    setTimeout(() => {
      window.location.href = `Account.html?bookingId=${docRef.id}`;
    }, 1000);

  } catch (error) {
    console.error("Booking Error:", error);
    bookingMessage.style.color = "red";
    bookingMessage.textContent = "Error submitting booking: " + error.message;
  }
});
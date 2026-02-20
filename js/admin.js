// 🔹 Admin JS - Clean + Buttons + Notifications
const bookingsBody = document.getElementById("bookingsBody");

// Realtime listener sa bookings
db.collection("bookings")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    bookingsBody.innerHTML = ""; // reset table

    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.id = doc.id;

      // Kulay ng status
      let statusColor;
      switch (data.status) {
        case "Approved": statusColor = "green"; break;
        case "Rejected": statusColor = "red"; break;
        default: statusColor = "orange"; // Pending
      }

      row.innerHTML = `
        <td>${data.fullName || ""}</td>
        <td>${data.serviceDate || ""}</td>
        <td style="color:${statusColor}; font-weight:bold;">${data.status || "Pending"}</td>
        <td>
          <button class="approve-btn" data-id="${doc.id}" style="background-color:green;color:white;border:none;padding:5px 10px;border-radius:4px;">Approve</button>
          <button class="reject-btn" data-id="${doc.id}" style="background-color:red;color:white;border:none;padding:5px 10px;border-radius:4px;">Reject</button>
        </td>
      `;
      bookingsBody.appendChild(row);
    });
  });

// Event delegation para sa dynamic buttons
bookingsBody.addEventListener("click", (e) => {
  const bookingId = e.target.dataset.id;
  if (!bookingId) return;

  if (e.target.classList.contains("approve-btn")) {
    updateBookingStatus(bookingId, "Approved");
  } else if (e.target.classList.contains("reject-btn")) {
    updateBookingStatus(bookingId, "Rejected");
  }
});

// Update booking status + create notification sa user
function updateBookingStatus(bookingId, newStatus) {
  const bookingRef = db.collection("bookings").doc(bookingId);

  bookingRef.get().then(doc => {
    if (!doc.exists) return;

    const bookingData = doc.data();

    bookingRef.update({ status: newStatus })
      .then(() => {
        console.log(`Status updated: ${newStatus}`);

        // Notification sa user
        db.collection("users")
          .doc(bookingData.userId)
          .collection("notifications")
          .add({
            message: `Your booking on ${bookingData.serviceDate} has been ${newStatus}!`,
            status: newStatus,
            bookingId: bookingId,
            read: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
          .catch(err => console.error("Error creating notification:", err));
      })
      .catch(err => console.error("Error updating booking:", err));
  });
}

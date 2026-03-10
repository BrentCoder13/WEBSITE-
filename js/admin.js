// 🔹 Admin JS - Clean + Buttons + Notifications + Filters

const bookingsBody = document.getElementById("bookingsBody");

let allBookings = [];
let currentFilter = "All";


// 🔹 Realtime listener sa bookings
db.collection("bookings")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {

    allBookings = [];

    snapshot.forEach(doc => {

      const data = doc.data();
      data.id = doc.id;

      allBookings.push(data);

    });

    renderBookings();

  });


// 🔹 FILTER FUNCTION
function filterBookings(status){

  currentFilter = status;

  renderBookings();

}


// 🔹 DISPLAY BOOKINGS
function renderBookings(){

  bookingsBody.innerHTML = "";

  allBookings.forEach(data => {

    if(currentFilter !== "All" && data.status !== currentFilter){
      return;
    }

    const row = document.createElement("tr");
    row.id = data.id;

    // 🔹 Status Color
    let statusColor;

    switch (data.status) {

      case "Approved":
        statusColor = "green";
        break;

      case "Rejected":
        statusColor = "red";
        break;

      case "Finished":
        statusColor = "blue";
        break;

      default:
        statusColor = "orange"; // Pending

    }

    row.innerHTML = `
      <td>${data.fullName || ""}</td>

      <td>${data.serviceDate || ""}</td>

      <td style="color:${statusColor}; font-weight:bold;">
      ${data.status || "Pending"}
      </td>

      <td>

        <button class="approve-btn" data-id="${data.id}"
        style="background-color:green;color:white;border:none;padding:5px 10px;border-radius:4px;">
        Approve
        </button>

        <button class="reject-btn" data-id="${data.id}"
        style="background-color:red;color:white;border:none;padding:5px 10px;border-radius:4px;">
        Reject
        </button>

        <button class="finish-btn" data-id="${data.id}"
        style="background-color:blue;color:white;border:none;padding:5px 10px;border-radius:4px;">
        Finished
        </button>

      </td>
    `;

    bookingsBody.appendChild(row);

  });

}


// 🔹 Event delegation para sa buttons
bookingsBody.addEventListener("click", (e) => {

  const bookingId = e.target.dataset.id;

  if (!bookingId) return;

  if (e.target.classList.contains("approve-btn")) {

    updateBookingStatus(bookingId, "Approved");

  }

  else if (e.target.classList.contains("reject-btn")) {

    updateBookingStatus(bookingId, "Rejected");

  }

  else if (e.target.classList.contains("finish-btn")) {

    updateBookingStatus(bookingId, "Finished");

  }

});


// 🔹 Update booking status + create notification sa user
function updateBookingStatus(bookingId, newStatus) {

  const bookingRef = db.collection("bookings").doc(bookingId);

  bookingRef.get().then(doc => {

    if (!doc.exists) return;

    const bookingData = doc.data();

    bookingRef.update({ status: newStatus })

      .then(() => {

        console.log(`Status updated: ${newStatus}`);

        // 🔔 Notification sa user
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
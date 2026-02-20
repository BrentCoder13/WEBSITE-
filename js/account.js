const fullNameInput = document.getElementById("full_name");
const emailInput = document.getElementById("email");
const accountMessage = document.getElementById("accountMessage");
const bookingsBody = document.getElementById("bookingsBody");
const updateBtn = document.getElementById("updateBtn");

// Track previous statuses for notifications
let previousStatuses = {};

auth.onAuthStateChanged(user => {
  if (!user) {
    accountMessage.style.color = "red";
    accountMessage.textContent = "You must be logged in to access this page.";
    return;
  }

  // Load user data
  db.collection("users").doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        fullNameInput.value = data.name || "";
        emailInput.value = data.email || "";
      }
    });

  // Realtime bookings listener
  db.collection("bookings")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      bookingsBody.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();
        const row = document.createElement("tr");
        row.id = doc.id; // important para sa highlight

        let statusColor;
        switch(data.status) {
          case "Approved": statusColor = "green"; break;
          case "Rejected": statusColor = "red"; break;
          default: statusColor = "orange"; // Pending
        }

        row.innerHTML = `
          <td>${data.serviceDate || ""}</td>
          <td>${data.fullName || ""}</td>
          <td style="color:${statusColor}; font-weight:bold;">${data.status || "Pending"}</td>
        `;
        bookingsBody.appendChild(row);

        // 🔔 Notification alert kapag nagbago status
        if (previousStatuses[doc.id] && previousStatuses[doc.id] !== data.status) {
          alert(`Your booking on ${data.serviceDate} has been ${data.status}!`);
        }
        previousStatuses[doc.id] = data.status;
      });

      // Highlight kung may query param bookingId
      const urlParams = new URLSearchParams(window.location.search);
      const highlightId = urlParams.get("bookingId");
      if (highlightId) {
        const row = document.getElementById(highlightId);
        if (row) {
          row.style.backgroundColor = "#fffa90";
          row.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
});

// Update full name
updateBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("users").doc(user.uid).update({
    name: fullNameInput.value,
    lastUpdated: new Date()
  })
  .then(() => {
    accountMessage.style.color = "green";
    accountMessage.textContent = "Account updated successfully!";
  })
  .catch(error => {
    accountMessage.style.color = "red";
    accountMessage.textContent = "Error updating account: " + error.message;
  });
});

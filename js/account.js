const fullNameInput = document.getElementById("full_name");
const emailInput = document.getElementById("email");
const accountMessage = document.getElementById("accountMessage");
const bookingsBody = document.getElementById("bookingsBody");
const updateBtn = document.getElementById("updateBtn");

let previousStatuses = {}; // para sa notification

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

  // Real-time bookings listener
  db.collection("bookings")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      bookingsBody.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();

        const row = document.createElement("tr");
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

        // 🔔 Notification kapag nagbago ang status
        if(previousStatuses[doc.id] && previousStatuses[doc.id] !== data.status) {
          alert(`Your booking on ${data.serviceDate} has been ${data.status}!`);
        }
        previousStatuses[doc.id] = data.status;
      });
    });
});

// Update Full Name
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

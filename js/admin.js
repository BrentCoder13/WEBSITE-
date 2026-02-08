const bookingsBody = document.getElementById("bookingsBody");
const statusFilter = document.getElementById("statusFilter");

// Function to render bookings
function renderBookings(snapshot, filter = "All") {
  bookingsBody.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    if (filter !== "All" && data.status !== filter) return;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.email || ""}</td>
      <td>${data.fullName || ""}</td>
      <td>${data.serviceDate || ""}</td>
      <td style="font-weight:bold; color:${data.status === "Approved" ? "green" : data.status === "Rejected" ? "red" : "orange"}">
        ${data.status || "Pending"}
      </td>
      <td>
        <button class="status-btn approve" data-id="${doc.id}">Approve</button>
        <button class="status-btn reject" data-id="${doc.id}">Reject</button>
      </td>
    `;
    bookingsBody.appendChild(row);
  });

  // Event listeners sa buttons
  document.querySelectorAll(".status-btn.approve").forEach(btn => {
    btn.addEventListener("click", () => updateStatus(btn.dataset.id, "Approved"));
  });
  document.querySelectorAll(".status-btn.reject").forEach(btn => {
    btn.addEventListener("click", () => updateStatus(btn.dataset.id, "Rejected"));
  });
}

// Real-time listener sa bookings
db.collection("bookings")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    renderBookings(snapshot, statusFilter.value);
  });

// Filter dropdown
statusFilter.addEventListener("change", () => {
  db.collection("bookings")
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => renderBookings(snapshot, statusFilter.value));
});

// Function para i-update ang status
function updateStatus(docId, status) {
  db.collection("bookings").doc(docId).update({
    status: status,
    lastUpdated: new Date()
  })
  .then(() => console.log("Status updated:", status))
  .catch(err => console.error("Error updating status:", err));
}

// ===== PROFILE DROPDOWN =====
const profileBtn = document.querySelector('.profile-btn');
const profileContainer = document.querySelector('.profile-container');

profileBtn.addEventListener('click', () => {
  profileContainer.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!profileContainer.contains(e.target)) {
    profileContainer.classList.remove('active');
  }
});

// ===== BOOK NOW BUTTON =====
document.querySelector('.book').addEventListener('click', () => {
  window.location.href = 'booking.html';
});

// ===== FIREBASE NOTIFICATIONS =====
// ✅ Gamitin ang existing auth at db, huwag ulitin ang const
// const auth = firebase.auth();
// const db = firebase.firestore();

const notificationBell = document.getElementById("notificationBell");
const notificationDropdown = document.getElementById("notificationDropdown");
const notificationCount = document.getElementById("notificationCount");

auth.onAuthStateChanged(user => {
  if (!user) return; // walang notification kung hindi logged in

  // Listen to user's notifications in real-time
  db.collection("users")
    .doc(user.uid)
    .collection("notifications")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      notificationDropdown.innerHTML = ""; // reset dropdown
      let unreadCount = 0;

      snapshot.forEach(doc => {
        const notif = doc.data();
        const item = document.createElement("div");
        item.className = "notification-item";
        item.textContent = notif.message;
        notificationDropdown.appendChild(item);

        if (!notif.read) unreadCount++;
      });

      // Update bell badge
      notificationCount.textContent = unreadCount;
      notificationCount.style.display = unreadCount > 0 ? "inline-block" : "none";
    });
});

// ===== TOGGLE NOTIFICATION DROPDOWN =====
notificationBell.addEventListener("click", () => {
  notificationDropdown.style.display =
    notificationDropdown.style.display === "block" ? "none" : "block";
});

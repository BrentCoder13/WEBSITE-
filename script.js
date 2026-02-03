const openAuthBtn = document.querySelector(".open-auth");
const bookNowBtn = document.querySelector("#bookNowBtn"); // select Book Now button
const modal = document.getElementById("authModal");
const closeModalBtn = document.getElementById("closeModal");

// open modal on Register/Login button click
openAuthBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

// open modal on Book Now button click
bookNowBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

// close modal
closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

// close when clicking outside modal box
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

const newHamburger = document.getElementById('newHamburger');
const newMenu = document.querySelector('.new-navbar .menu');

newHamburger.addEventListener('click', () => {
  newMenu.classList.toggle('active');
});

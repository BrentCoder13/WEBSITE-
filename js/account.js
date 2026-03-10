// 🔹 Account.js - Full Version with Auto Contact System

const fullNameInput = document.getElementById("full_name");
const emailInput = document.getElementById("email");
const accountMessage = document.getElementById("accountMessage");
const bookingsBody = document.getElementById("bookingsBody");
const updateBtn = document.getElementById("updateBtn");

let previousStatuses = {};

auth.onAuthStateChanged(user => {

if (!user) {
accountMessage.style.color = "red";
accountMessage.textContent = "You must be logged in.";
return;
}

// LOAD USER
db.collection("users").doc(user.uid).get()
.then(doc => {

if(doc.exists){
const data = doc.data();
fullNameInput.value = data.name || "";
emailInput.value = data.email || "";
}

});

// BOOKINGS
db.collection("bookings")
.where("userId","==",user.uid)
.orderBy("createdAt","desc")
.onSnapshot(snapshot => {

bookingsBody.innerHTML="";

snapshot.forEach(doc => {

const data = doc.data();
const row = document.createElement("tr");

let statusColor="orange";

if(data.status==="Approved") statusColor="green";
if(data.status==="Rejected") statusColor="red";
if(data.status==="Cancelled") statusColor="gray";

let cancelButton="";
let infoText="";

if(data.createdAt){

const createdAt = data.createdAt.toDate();
const now = new Date();

const hoursPassed = (now-createdAt)/(1000*60*60);

if(data.status==="Pending"){

if(hoursPassed < 48){

const remaining = 48 - hoursPassed;
const hrs = Math.floor(remaining);
const mins = Math.floor((remaining-hrs)*60);

infoText = `Cancel available for: ${hrs}h ${mins}m`;

cancelButton = `
<button class="cancel-btn" data-id="${doc.id}">
Cancel
</button>
`;

}else{

infoText = "The shop will contact you soon to confirm your appointment.";

}

}

}

row.innerHTML=`

<td>${data.serviceDate || ""}</td>

<td>${data.fullName || ""}</td>

<td style="color:${statusColor};font-weight:bold;">
${data.status || "Pending"}
</td>

<td>

<button class="view-summary-btn" data-id="${doc.id}">
View Summary
</button>

${cancelButton}

<div style="font-size:12px;color:#444;margin-top:5px;">
${infoText}
</div>

</td>

`;

bookingsBody.appendChild(row);

// STATUS CHANGE ALERT
if(previousStatuses[doc.id] &&
previousStatuses[doc.id]!==data.status){

alert(`Your booking on ${data.serviceDate} is now ${data.status}`);

}

previousStatuses[doc.id]=data.status;

// REJECT ALERT
if(data.status==="Rejected"){

const alertDiv=document.createElement("div");

alertDiv.style.color="red";
alertDiv.style.fontWeight="bold";

alertDiv.textContent=
`Your booking on ${data.serviceDate} was rejected. Please book again.`;

row.after(alertDiv);

}

});

});

});


// UPDATE ACCOUNT
updateBtn.addEventListener("click",()=>{

const user = auth.currentUser;
if(!user) return;

const newName = fullNameInput.value.trim();

if(!newName){

accountMessage.style.color="red";
accountMessage.textContent="Name cannot be empty.";
return;

}

db.collection("users")
.doc(user.uid)
.update({

name:newName,
lastUpdated:firebase.firestore.FieldValue.serverTimestamp()

})

.then(()=>{

accountMessage.style.color="green";
accountMessage.textContent="Account updated successfully.";

})

.catch(err=>{

accountMessage.style.color="red";
accountMessage.textContent="Error: "+err.message;

});

});


// BOOKING SUMMARY MODAL

const modal=document.createElement("div");

modal.style=`
display:none;
position:fixed;
top:50%;
left:50%;
transform:translate(-50%,-50%);
background:white;
padding:20px;
border-radius:10px;
border:2px solid black;
z-index:1000;
`;

modal.innerHTML=`
<h3>Booking Summary</h3>
<div id="summaryContent"></div>
<br>
<button id="closeSummary">Close</button>
`;

document.body.appendChild(modal);


// OVERLAY
const overlay=document.createElement("div");

overlay.style=`
display:none;
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.5);
z-index:900;
`;

document.body.appendChild(overlay);


// CLOSE
document.addEventListener("click",e=>{

if(e.target.id==="closeSummary" || e.target===overlay){

modal.style.display="none";
overlay.style.display="none";

}

});


// BUTTON EVENTS
bookingsBody.addEventListener("click",e=>{

// VIEW SUMMARY
if(e.target.classList.contains("view-summary-btn")){

const id=e.target.dataset.id;

db.collection("bookings").doc(id).get()
.then(doc=>{

if(!doc.exists) return;

const d=doc.data();

document.getElementById("summaryContent").innerHTML=`

<p><b>Name:</b> ${d.fullName}</p>
<p><b>Email:</b> ${d.email}</p>
<p><b>Contact:</b> ${d.contactNumber}</p>
<p><b>Address:</b> ${d.address}</p>
<p><b>Date:</b> ${d.serviceDate}</p>
<p><b>Status:</b> ${d.status}</p>

`;

modal.style.display="block";
overlay.style.display="block";

});

}


// CANCEL
if(e.target.classList.contains("cancel-btn")){

const id=e.target.dataset.id;

if(confirm("Cancel this appointment?")){

db.collection("bookings").doc(id)
.update({status:"Cancelled"})
.then(()=>{

alert("Booking cancelled.");

})
.catch(err=>{

alert("Error: "+err.message);

});

}

}

});
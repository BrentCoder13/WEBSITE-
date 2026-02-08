const firebaseConfig = {
  apiKey: "AIzaSyC6k29Vbk1tYIJ-U5MeH1SObQZUiTps_B4",
  authDomain: "lexovate-capstone.firebaseapp.com",
  databaseURL: "https://lexovate-capstone-default-rtdb.firebaseio.com",
  projectId: "lexovate-capstone",
  storageBucket: "lexovate-capstone.firebasestorage.app",
  messagingSenderId: "826448534222",
  appId: "1:826448534222:web:4ffb72b9966cadb107ce9f",
  measurementId: "G-FLSM7EV182"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore()
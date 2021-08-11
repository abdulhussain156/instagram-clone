
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBTPcleT_9axWrKwk5Y9mW6MhY-PJLBf8Y",
  authDomain: "insta-clone-1c087.firebaseapp.com",
  projectId: "insta-clone-1c087",
  storageBucket: "insta-clone-1c087.appspot.com",
  messagingSenderId: "271580303401",
  appId: "1:271580303401:web:aa8f476e1af701887f4c38",
  measurementId: "G-SQKR7QX9K9"
});



const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
  
export { db, auth, storage }; 
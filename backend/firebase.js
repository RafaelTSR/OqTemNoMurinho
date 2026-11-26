import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC2V7dwWKf_-eSsa9Ft7_W7mNJPxdOrVWI",
    authDomain: "oqtemnomurinho.firebaseapp.com",
    projectId: "oqtemnomurinho",
    storageBucket: "oqtemnomurinho.firebasestorage.app",
    messagingSenderId: "43292375225",
    appId: "1:43292375225:web:6fc697f0832ff8e8a50368"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
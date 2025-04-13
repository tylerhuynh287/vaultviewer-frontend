import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA5OyMJwzsx9VHPLNN2s4AANvRaJIX2biw",
    authDomain: "vaultviewer-ffc3d.firebaseapp.com",
    projectId: "vaultviewer-ffc3d",
    storageBucket: "vaultviewer-ffc3d.firebasestorage.app",
    messagingSenderId: "381822756458",
    appId: "1:381822756458:web:35458f86279e1a911acc13"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
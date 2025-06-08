import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCmUga0H1RdkYPbyQgxLOashnpfTL5mDeM",
    authDomain: "hivtmss.firebaseapp.com",
    projectId: "hivtmss",
    storageBucket: "hivtmss.firebasestorage.app",
    messagingSenderId: "101816014367",
    appId: "1:101816014367:web:4298f0a54dec402bcee72a",
    measurementId: "G-1CFY3P7HDD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);


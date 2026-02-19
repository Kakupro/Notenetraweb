import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getRemoteConfig } from 'firebase/remote-config';
import { getPerformance } from 'firebase/performance';
import { getDatabase } from 'firebase/database';
import { getMessaging } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGuVR7zSOU3HHGOSX_Y8ccaIY4mnKb0Wg",
    authDomain: "notenetra009.firebaseapp.com",
    projectId: "notenetra009",
    storageBucket: "notenetra009.firebasestorage.app",
    messagingSenderId: "546928743328",
    appId: "1:546928743328:web:b2810fb75b61e9f2038ac5",
    measurementId: "G-W6MDZMVG39",
    databaseURL: "https://notenetra009-default-rtdb.firebaseio.com" // Update this if your RTDB URL is different
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const remoteConfig = getRemoteConfig(app);
const performance = getPerformance(app);
const database = getDatabase(app);
const messaging = getMessaging(app);

export { app, auth, db, storage, functions, analytics, remoteConfig, performance, database, messaging };

import  firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "APIKEY",
    authDomain: "DOMAIN",
    projectId: "PROJECT_ID",
    storageBucket: "BUCKET",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    measurementId: "MEASUREMENT_ID"
};

const firebaseTool = firebase.initializeApp(firebaseConfig);

export default firebaseTool;

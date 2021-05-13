import  firebase from 'firebase';
import 'firebase/firestore'

// import "firebase/auth";
// import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC_RELmap8M_MdOr1ocihwWBme7kOLnEPM",
    authDomain: "acollida-cddc9.firebaseapp.com",
    projectId: "acollida-cddc9",
    storageBucket: "acollida-cddc9.appspot.com",
    messagingSenderId: "257249030360",
    appId: "1:257249030360:web:4ca0e0f78c49f13306e7ad",
    measurementId: "G-4MYQS6H64R"
};

 const firebaseTool = firebase.initializeApp(firebaseConfig);
 // const db = firebase.firestore();
 // export default db;

export default firebaseTool;

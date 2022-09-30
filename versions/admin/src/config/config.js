import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';

const configKeys = {
    apiKey: "AIzaSyD7rHwMdVtWfdhTGGH0fTQ1Xhk4RjRwfZI",
    authDomain: "elite-ee4b7.firebaseapp.com",
    projectId: "elite-ee4b7",
    storageBucket: "elite-ee4b7.appspot.com",
    messagingSenderId: "37474980291",
    appId: "1:37474980291:web:63150f372b3e92267dad76",
    measurementId: "G-WSZ014RCDH",
    databaseURL: "https://elite-ee4b7.firebaseio.com",
    api_local: "http://localhost:5001/elite-ee4b7/us-central1/api/v1/",
    api_dev: "http://localhost:5001/elite-ee4b7/us-central1/api/v1/",
    api_live: "https://us-central1-elite-ee4b7.cloudfunctions.net/api/v1/"
};

console.log(firebase)
if (!firebase.apps.length) {
    firebase.initializeApp(configKeys);
}

export { firebase, configKeys };
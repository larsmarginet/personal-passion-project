import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.VUE_APP_apiKey,
    authDomain: process.env.VUE_APP_authDomain,
    databaseURL: process.env.VUE_APP_databaseURL,
    projectId: process.env.VUE_APP_projectId,
    storageBucket: process.env.VUE_APP_storageBucket,
    messagingSenderId: process.env.VUE_APP_messagingSenderId,
    appId: process.env.VUE_APP_appId
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// collection references
const usersCollection = db.collection('users');
const eventsCollection = db.collection('events');
const roomsCollection = db.collection('rooms');
const menuCollection = db.collection('menu');
const merchCollection = db.collection('merch');
const songCollection = db.collection('songs');

// export utils/refs
export {
  db,
  auth,
  storage,
  usersCollection,
  eventsCollection,
  roomsCollection,
  menuCollection,
  merchCollection,
  songCollection
}
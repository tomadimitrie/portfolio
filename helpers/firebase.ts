import firebase from "firebase/app";
import "firebase/firestore";
import Constants from "expo-constants";

export default firebase.apps.length === 0
  ? firebase.initializeApp({
      apiKey: Constants.manifest.extra.FIREBASE_API_KEY,
      authDomain: Constants.manifest.extra.FIREBASE_AUTH_DOMAIN,
      databaseURL: Constants.manifest.extra.FIREBASE_DATABASE_URL,
      projectId: Constants.manifest.extra.FIREBASE_PROJECT_ID,
      storageBucket: Constants.manifest.extra.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: Constants.manifest.extra.FIREBASE_MESSAGING_SENDER_ID,
      appId: Constants.manifest.extra.FIREBASE_APP_ID,
    })
  : firebase.app();

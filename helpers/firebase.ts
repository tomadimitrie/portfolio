import firebase from "firebase/app";
import "firebase/firestore";

export default firebase.apps.length === 0
  ? firebase.initializeApp({
      apiKey: process.env.firebase_api_key,
      authDomain: process.env.firebase_auth_domain,
      databaseURL: process.env.firebase_database_url,
      projectId: process.env.firebase_project_id,
      storageBucket: process.env.firebase_storage_bucket,
      messagingSenderId: process.env.firebase_messagingSenderID,
      appId: process.env.firebase_app_id,
    })
  : firebase.app();

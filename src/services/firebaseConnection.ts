import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlhUzHPAqnjWMKW-_VnxtxoEihyRk1TF4",
  authDomain: "webcarros-1a39c.firebaseapp.com",
  projectId: "webcarros-1a39c",
  storageBucket: "webcarros-1a39c.appspot.com",
  messagingSenderId: "739120144087",
  appId: "1:739120144087:web:91df59d2db5468bf199a92"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage}
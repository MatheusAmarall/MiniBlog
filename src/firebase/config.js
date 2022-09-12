import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZ6aX0LmcCPdoMOPP-0xxu0eBSGb6lI9E",
  authDomain: "miniblog-react-5920f.firebaseapp.com",
  projectId: "miniblog-react-5920f",
  storageBucket: "miniblog-react-5920f.appspot.com",
  messagingSenderId: "1065435165834",
  appId: "1:1065435165834:web:382cf5a102189d8fa3a973"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
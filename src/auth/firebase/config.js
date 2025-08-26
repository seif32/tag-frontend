import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0DAupxsz4MSfWbszxgbf823OmZaevs80",
  authDomain: "tagdb-208b9.firebaseapp.com",
  projectId: "tagdb-208b9",
  storageBucket: "tagdb-208b9.firebasestorage.app",
  messagingSenderId: "1009264598926",
  appId: "1:1009264598926:web:a76982e86d038c486acedf",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Importa a função para o Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDe9CPKih-TRNGkdgP5rhfQ56RsfSnswYc",
  authDomain: "cultivesmart-d2ed3.firebaseapp.com",
  databaseURL: "https://cultivesmart-d2ed3-default-rtdb.firebaseio.com",
  projectId: "cultivesmart-d2ed3",
  storageBucket: "cultivesmart-d2ed3.firebasestorage.app",
  messagingSenderId: "315015582385",
  appId: "1:315015582385:web:b98d685ddebc00e6c58890",
  measurementId: "G-BEY3277FDF"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém as instâncias dos serviços
export const auth = getAuth(app); // Exporta a instância de autenticação
export const db = getFirestore(app); // Exporta a instância do Firestore
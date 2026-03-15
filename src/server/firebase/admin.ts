// src/server/firebase/admin.ts
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
	let privateKey = import.meta.env.FIREBASE_PRIVATE_KEY;

	if (privateKey) {
		// 1. Limpiamos comillas accidentales al principio o final
		privateKey = privateKey.trim().replace(/^["']|["']$/g, "");

		// 2. Arreglamos los saltos de línea (el problema principal)
		privateKey = privateKey.replace(/\\n/g, "\n");
	}

	try {
		initializeApp({
			credential: cert({
				projectId: import.meta.env.FIREBASE_PROJECT_ID,
				clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
				privateKey: privateKey,
			}),
		});
		console.log("✅ Firebase Admin conectado con éxito");
	} catch (error) {
		console.error("❌ Error al inicializar Firebase Admin:", error);
	}
}

export const db = getFirestore();

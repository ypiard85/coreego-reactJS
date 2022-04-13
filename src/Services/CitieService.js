import { db, storage } from "../backend/config.js";
//import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const col = collection(db, "cities");

export const CitieService = {
    getAll: async () => {
        try {
            const c = []
            await getDocs(col).then((snap) => {
                snap.forEach((doc) => {
                    c.push(doc.data());
                });
              });
            return c

        } catch (error) {
            console.log(error)
        }

    }
}
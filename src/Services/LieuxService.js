import { db, storage } from "../backend/config.js";
//import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";

export const LieuxService = {

    getAll: async () => {
        try {
        let lieux = []
        const r = collection(db, "lieux");

           await getDocs(r).then((snap) => {
               snap.forEach((doc) => {
                  lieux.push({...doc.data(), id: doc.id });
                });
            })

            return lieux

        } catch (error) {
            console.log(error)
        }


    }

}
import { db, storage } from "../backend/config.js";
//import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";


const col = collection(db, "lieux");
export const LieuService = {
  getAll: async () => {
    try {
      const col = collection(db, "lieux");
      const l = []
      await getDocs(col).then((snap) => {
        snap.forEach((doc) => {
          l.push({ ...doc.data(), id: doc.id });
        });
      });
      return l

    } catch (error) {
      console.log(error);
    }
  },

};

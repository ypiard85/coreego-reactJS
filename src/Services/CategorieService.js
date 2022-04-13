import { db, storage } from "../backend/config.js";
//import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";


export const CategorieService = {
  getAll: async () => {
    try {
      const col = collection(db, "categories");
      const c = []
      const doc = await getDocs(col).then((snap) => {
        snap.forEach((doc) => {
          c.push(doc.data());
        });
      });
      return c;
    } catch (error) {
      console.log(error);
    }
  },
};

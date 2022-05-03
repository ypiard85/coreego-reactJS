import { db, storage } from "../backend/config.js";
//import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";

const col = collection(db, "lieux");
export const LieuService = {
  getAll: async () => {
    try {
      const col = collection(db, "lieux");
      const l = [];
      await getDocs(col).then((snap) => {
        snap.forEach((doc) => {
          l.push({ ...doc.data(), id: doc.id });
        });
      });
      return l;
    } catch (error) {
      console.log(error);
    }
  },

  getOneLieu: async (id) => {
    try {
      const lieu = [];
      await getDocs(col)
        .then((snap) => {
          snap.forEach((doc) => {
            if (doc.id === id) {
              lieu.push(doc.data());
            }
          });
        })
        .catch((erreur) => console.log(erreur));

      return lieu;
    } catch (error) {
      console.log(error);
    }
  },

  getLieuxFromUSer: async (user) => {
    try {
      const lieux = [];
      await getDocs(col)
        .then((snap) => {
          snap.forEach((doc) => {
            if (doc.data().user === user) {
              lieux.push({ ...doc.data(), id: doc.id });
            }
          });
        })
        .catch((erreur) => console.log(erreur));

      return lieux;
    } catch (error) {
      console.log(error);
    }
  },
};

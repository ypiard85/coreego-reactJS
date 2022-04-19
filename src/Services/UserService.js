import { db, storage } from "../backend/config.js";
//import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";

const usercol = collection(db, 'users');

export const UserService = {
    hasProfil : async (id) => {
        try {
            let hasLogin = false;
            getDocs(usercol).then((snap) => {
                snap.forEach(docs => {
                  if(docs && docs.id === id ){
                      hasLogin = true
                    }else{
                    hasLogin = false
                    }
                })
          });
          return hasLogin;
        } catch (error) {
            console.log(error)
        }
    },

    verifPseudo: async (p) => {
        try {
            var message = "";
          await getDocs(usercol).then((snap) => {
                snap.forEach(docs => {
                if(docs.data().pseudo == p.trim()){
                        message = "Le pseudo est le même"
                    }else{
                        message = null
                    }
                })
          });
          return message;
        } catch (error) {
            console.log(error)
        }
    }
}
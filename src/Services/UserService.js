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
            var message = null;
          await getDocs(usercol).then((snap) => {
                snap.forEach(docs => {
                if(p.length <= 5){
                    message = "Votre mot de passe doit avoir au minimum 5 caractères"
                }else if(docs.data().pseudo == p){
                    message = "Le pseudo " + p + " existe déjâ"
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
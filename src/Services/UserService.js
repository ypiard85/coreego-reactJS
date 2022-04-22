import { db, auth } from "../backend/config.js";
//import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs, where, query } from "firebase/firestore";

const usercol = collection(db, 'users');

export const UserService = {
    hasProfil : async () => {
        try {
        const userpseudo = []
        var haveAcount = false
           await getDocs(usercol).then((snap) => {
                snap.forEach(docs => {
                    if(auth.currentUser){
                        if(docs.id === auth.currentUser.uid){
                            userpseudo.push(docs.id)
                            if(userpseudo.length === 1){
                                haveAcount = true
                            }else{
                                haveAcount = false
                            }
                        }
                    }
                })
          });

          return haveAcount;

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
    },

    getUSer: async () => {
        try {
            var users;
                    await getDocs(usercol).then((snap) => {
                        snap.forEach(docs => {
                            if(auth.currentUser){
                                if(docs.id === auth.currentUser.uid){
                                    users = docs.data()
                                }
                            }
                        })
                    });


          return users
        } catch (error) {
            console.log(error)
        }
    }

}

import { db, storage } from "../config.js";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export  function GetAllLieux(){
    const [lieux, setLieux] = useState([])

    useEffect(()=> {
        const lieuxCollection = collection(db, "lieux");
        getDocs(lieuxCollection)
        .then((snap) => {
            snap.forEach((doc) => {
                lieux.push({ ...doc.data(), id: doc.id });
            });
        })
        .catch((erreur) => console.log(erreur));
    }, [])

      return lieux
}

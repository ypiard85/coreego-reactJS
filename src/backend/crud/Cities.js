
import { db } from "../config.js";
import { collection, getDocs } from "firebase/firestore";

export  function GetAllCities(){

    const cities = [];
    const citiesCollection = collection(db, "cities");
     getDocs(citiesCollection).then((snap) => {
        snap.forEach((doc) => {
            cities.push(doc.data());
        });
    });

    return cities
}

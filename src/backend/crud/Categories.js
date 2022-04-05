
import { db } from "../config.js";
import { collection, getDocs } from "firebase/firestore";

export function getAllCategories(){

    const categories = [];
    const citiesCollection = collection(db, "categories");
    getDocs(citiesCollection).then((snap) => {
      snap.forEach((doc) => {
        categories.push(doc.data());
      });
    });
    return categories
}

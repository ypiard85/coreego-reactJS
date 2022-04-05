import {useState} from 'react'
import { storage } from "./config.js";
import { ref } from "firebase/storage";



function getImage(id){

    const [imgUrl, setImgUrl] = useState([]);

    const imageRef = ref(storage, `lieux/${id}`);

    return imageRef;
}
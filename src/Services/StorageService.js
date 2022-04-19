import { storage } from "../backend/config.js";
import { ref, getDownloadURL } from "firebase/storage";

export const StorageService = {
  getOne: async (id) => {
    try {
      let url;
      const getRef = ref(storage, "lieux/" + id);
      await getDownloadURL(getRef).then((x) => {
        url = x;
      });
      return url;
    } catch (error) {}
  },
};

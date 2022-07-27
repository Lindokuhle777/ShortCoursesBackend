import express from "express";
import {
  collection,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase-config.js";

const router = express.Router();

const getData = async () => {
  const usersCollectionRef = collection(db, "Courses");
  try {
    const data = await getDocs(usersCollectionRef);
    // console.log(data);

    return data;
  } catch (e) {
    console.log(e);
  }

  return null;
};

router.get("/", async (req, res) => {
  const response = [];

  const data = await getData();

  if (data === null) {
  } else {
    data.forEach((doc) => {
      response.push(doc.data());
    });

    res.send(response);
  }
  // res.send(tempData);
});

export default router;

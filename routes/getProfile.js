import express from "express";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const userID = req.body.userID;
  const userRef = doc(db, "Users", userID);
  const dataSnap = await getDoc(userRef);
  const enrolledArrSnap = dataSnap.data().enrolled;
  const createdArrSnap = dataSnap.data().created;
  const bioSnap = dataSnap.data().bio;

  //object with profile data
  const profile = {
    bio: bioSnap,
    enrolled: enrolledArrSnap.length,
    created: createdArrSnap.length,
  };

  res.send(profile);
});

export default router;

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
  const newBio = req.body.newBio;

  const userRef = doc(db, "Users", userID);
  await updateDoc(userRef, { bio: newBio });
  res.send("bio updated");
});

export default router;
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

  // get user data

  const docRef = doc(db, "Users", userID);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const data = {
      bio: "Set bio",
      enrolled: [],
      created: [],
      interestsAndSkills: [],
    };
    await setDoc(doc(db, "Users", userID), data);
  }
  res.send("Done");
});

export default router;

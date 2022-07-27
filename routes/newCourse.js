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
  const courseID = req.body.courseID;
  const courseName = req.body.courseName;
  const duration = req.body.duration;
  const userID = req.body.creator;
  const outcomes = req.body.outcomes;
  const images = req.body.images;
  const description = req.body.description;

  const courseRef = doc(db, "Courses", courseID);

  const data = {
    courseID,
    courseName,
    duration,
    creator: userID,
    enrolled: [],
    outcomes,
    images,
    description,
  };

  await setDoc(courseRef, data);

  const userRef = doc(db, "Users", userID);

  const userSnap = await getDoc(userRef);

  await updateDoc(userRef, { created: [...userSnap.data().created, courseID] });

  res.send("Course created");
});

export default router;

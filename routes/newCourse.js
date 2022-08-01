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

const handleCourseData = async (courseData) => {
  const courseID = courseData.courseID;
  const courseName = courseData.courseName;
  const duration = courseData.duration;
  const userID = courseData.userID;
  const outcomes = courseData.outcomes;
  const images = courseData.images;
  const description = courseData.description;

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
};

const handleSlideData = async (slideData) => {
  await setDoc(doc(db, "Slides", slideData.courseID), slideData);
};

router.post("/", async (req, res) => {
  await handleCourseData(req.body.courseData);
  await handleSlideData(req.body.slideData);

  res.send("course created");
});

export default router;

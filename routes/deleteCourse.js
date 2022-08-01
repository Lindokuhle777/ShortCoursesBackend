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
  
    const courseRef = doc(db, "Courses", courseID);
  
    const courseData = await getDoc(courseRef);
  
    const tempEnrolledArr = courseData.data().enrolled;
    const userID = courseData.data().creator;
  
    for (let i = 0; i < tempEnrolledArr.length; i++) {
      const currUserID = tempEnrolledArr[i];
  
      const userRef = doc(db, "Users", currUserID);
  
      const coursesSnap = await getDoc(userRef);
  
      const coursesArrSnap = coursesSnap.data().enrolled;
  
      await updateDoc(userRef, {
        enrolled: coursesArrSnap.filter((item) => item !== courseID),
      });
    }

    const userRef = doc(db, "Users", userID);
  
    const coursesSnap = await getDoc(userRef);
  
    const coursesArrSnap = coursesSnap.data().created;
  
    await updateDoc(doc(db, "Users", userID), {
      created: coursesArrSnap.filter((item) => item !== courseID),
    });
    await deleteDoc(doc(db, "Courses", courseID));

    await deleteDoc(doc(db, "Slides"),courseID);

    res.send("deleted");
  });

export default router;
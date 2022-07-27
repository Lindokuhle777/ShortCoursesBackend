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
  
    const coursesSnap = await getDoc(userRef);
  
    const coursesArrSnap = coursesSnap.data().enrolled;
  
    let coursesArr = [];
  
    for (let i = 0; i < coursesArrSnap.length; i++) {
      const currCourse = coursesArrSnap[i];
  
      const courseRef = doc(db, "Courses", currCourse);
  
      const courseData = await getDoc(courseRef);
      const tempData = {
        courseID: courseData.data().courseID,
        courseName: courseData.data().courseName,
        images: courseData.data().images,
      };
      coursesArr.push(tempData);
    }
  
    res.send(coursesArr);
  });


  export default router;
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
  const userID = req.body.userID;

  // get user data

  const docRef = doc(db, "Users", userID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    //user exists/ is already on the db

    let enrolledArr = docSnap.data().enrolled;
    let found = false;
    for (let i = 0; i < enrolledArr.length; i++) {
      let curr = enrolledArr[i];
      if (curr === courseID) {
        found = true;
        break;
      }
    }

    if (!found) {
      //not enrooled in this course
      await updateDoc(docRef, { enrolled: [...enrolledArr, courseID] });

      const courseRef = doc(db, "Courses", courseID);

      const courseData = await getDoc(courseRef);

      let enrolledCoursesArr = courseData.data().enrolled;

      await updateDoc(courseRef, { enrolled: [...enrolledCoursesArr, userID] });

      res.send("Enrolled");
    } else {
      res.send("Already enrolled");
    }
  } else {
    // basically a new used

    const data = { bio: "Set bio", enrolled: [courseID], created: [] };

    await setDoc(doc(db, "Users", userID), data);

    const courseRef = doc(db, "Courses", courseID);

    const courseData = await getDoc(courseRef);

    let enrolledArr = courseData.data().enrolled;

    await updateDoc(courseRef, { enrolled: [...enrolledArr, userID] });

    res.send("Enrolled");
  }
});

export default router;
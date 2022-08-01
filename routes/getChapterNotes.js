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
  const courseID = req.body.courseID;
  const chapterName = req.body.chapterName;

  // const userRef = ;

  const notesSnap = await getDoc(doc(db, "Notes", userID));
  if (notesSnap.exists()) {
    const currNotes = notesSnap
      .data()
      .Notes.filter((item) => item.courseID === courseID);

    if (currNotes.length > 0) {
      const notes = currNotes[0].content.filter(
        (item) => item.chapName === chapterName
      );
      if (notes.length > 0) {
        res.send(notes[0].notes);
      } else {
        res.send("");
      }
    } else {
      res.send("");
    }
  } else {
    res.send("");
  }

  // res.send(notesSnap.data())
});

export default router;

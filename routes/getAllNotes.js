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

router.post("/",async (req, res) => {
    const userID = req.body.userID;

    const notesSnap = await getDoc(doc(db, "Notes", userID))

    if(notesSnap.exists()) {
        let temp = notesSnap.data().Notes;
        let last = [];

        for(let i = 0; i < temp.length; i++) {
            let item = temp[i];
            const tempDoc = await getDoc(doc(db, "Courses", item.courseID));
            if(tempDoc.exists()) last.push({...item,courseName:tempDoc.data().courseName})
            

        }

        res.send(last);

    }else{
        res.send([]);
    }

})

export default router;
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
  const notes = req.body.notes;

  const notesSnap = await getDoc(doc(db, "Notes", userID));

  if (!notesSnap.exists()) {
    //first time saving notes
    await setDoc(doc(db, "Notes", userID), {
      Notes: [{ courseID, content: [{ chapName: chapterName, notes: notes }] }],
    });
    res.send("done");
  } else {
    //has notes
    let notesArr = notesSnap
      .data()
      .Notes.filter((item) => item.courseID === courseID);

    if (notesArr.length === 0) {
      //first time creating notes for that course

      const temp = [
        ...notesSnap.data().Notes,
        { courseID, content: [{ chapName: chapterName, notes: notes }] },
      ];

      await updateDoc(doc(db, "Notes", userID), { Notes: temp });
      res.send("note");
    } else {
      //we have notes for that course
      //   res.send(notesArr[0].content)

      let li = notesArr[0].content.filter(
        (item) => item.chapName === chapterName
      );

      if (li.length > 0) {
        //chap name found
        li[0].notes = notes;
        
        let tempContent ={courseID, content:[...notesArr[0].content.filter(
            (item) => item.chapName !== chapterName
          ),li[0]]}

        let arr = notesSnap.data().Notes.filter((item)=>item.courseID!==courseID);
        arr.push(tempContent);
        await updateDoc(doc(db, "Notes", userID),{Notes:arr})

        res.send("done");
      }else{
        // chap name not found
        let tempContent ={courseID, content:[...notesArr[0].content.filter(
            (item) => item.chapName !== chapterName
          ),{chapName: chapterName,notes: notes}]}

        let arr = notesSnap.data().Notes.filter((item)=>item.courseID!==courseID);
        arr.push(tempContent);
        await updateDoc(doc(db, "Notes", userID),{Notes:arr})

        res.send("done");


      }

    //   res.send(li);
    }
  }
});

export default router;

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

router.post("/", async (req, res)=>{
  const courseID = req.body.courseID;
  
  const slidesSnap = await getDoc(doc(db, "Slides", courseID));

  res.send(slidesSnap.data());
  
})



export default router;
import cors from "cors";
import express from "express";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase-config.js";

const app = express();


app.use(express.json());
app.use(cors());

const tempData = [
    {
      name:"Course1",
      courseID:"CourseOneID",
      images:[]
    },
    {
      name:"Some Course2",
      courseID:"CourseTwoID",
      images:[]
    },
    {
      name:"Another Course3",
      courseID:"CourseThreeID",
      images:[]
    },
    {
      name:"Course4",
      courseID:"CourseFourID",
      images:[]
    },
    
    
  ];


  const PORT = process.env.PORT || 5000;


  const getData = async () => {
    const usersCollectionRef = collection(db, "Courses");
    try {
      const data = await getDocs(usersCollectionRef);
      // console.log(data);
  
      return data;
    } catch (e) {
      console.log(e);
    }
  
    return null;
  };

  app.get("/getAllCourses", async (req, res) => {
    const response = [];
  
    const data = await getData();
    
  
    if (data === null) {
    } else {
      data.forEach((doc) => {
        response.push(doc.data());
      });
  
      res.send(response);
    }
    // res.send(tempData);
  });


  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

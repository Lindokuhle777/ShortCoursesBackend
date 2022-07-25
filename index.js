import cors from "cors";
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
import { db } from "./firebase-config.js";

const app = express();

app.use(express.json());
app.use(cors());

const tempData = [
  {
    name: "Course1",
    courseID: "CourseOneID",
    images: [],
  },
  {
    name: "Some Course2",
    courseID: "CourseTwoID",
    images: [],
  },
  {
    name: "Another Course3",
    courseID: "CourseThreeID",
    images: [],
  },
  {
    name: "Course4",
    courseID: "CourseFourID",
    images: [],
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

app.post("/enroll", async (req, res) => {
  const courseID = req.body.courseID;
  const userID = req.body.userID;

  console.log(courseID);
  console.log(userID);

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

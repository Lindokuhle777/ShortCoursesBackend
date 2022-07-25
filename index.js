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

app.post("/getErolledCourses", async (req, res) => {
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

app.post("/getCreatedCourses", async (req, res) => {
  const userID = req.body.userID;

  const userRef = doc(db, "Users", userID);

  const coursesSnap = await getDoc(userRef);

  const coursesArrSnap = coursesSnap.data().created;

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
  console.log(coursesArr);

  res.send(coursesArr);
});

app.post("/newUser", async (req, res) => {
  const userID = req.body.userID;

  // get user data

  const docRef = doc(db, "Users", userID);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const data = { 
      bio: "Set bio",
      enrolled: [],
      created: [],
      interestsAndSkills: [],
      
    };
    await setDoc(doc(db, "Users", userID), data);
  }
  res.send("Done");
});

app.post("/deleteCourse", async (req, res) => {
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

    await updateDoc(doc(db, "Users", userID), {
      enrolled: coursesArrSnap.filter((item) => item !== courseID),
    });
  }
  const userRef = doc(db, "Users", userID);

  const coursesSnap = await getDoc(userRef);

  const coursesArrSnap = coursesSnap.data().created;

  // const data = {
  //   created: coursesArrSnap.filter((item) => item !== courseID),
  // };
  await updateDoc(doc(db, "Users", userID), {
    created: coursesArrSnap.filter((item) => item !== courseID),
  });
  await deleteDoc(doc(db, "Courses", courseID));
  res.send("deleted");
});

app.post("/getProfile", async(req, res) =>{
   const userID = req.body.userID;
   const userRef = doc(db, "Users", userID);
   const dataSnap = await getDoc(userRef);
   const enrolledArrSnap = dataSnap.data().enrolled;
   const createdArrSnap = dataSnap.data().created;
   const bioSnap = dataSnap.data().bio;

   //object with profile data
   const profile = {
    bio: bioSnap,
    enrolled: enrolledArrSnap.length,
    created: createdArrSnap.length,
   }

   res.send(profile);
});

app.post("/updateBio", async(req,res) =>{
  const userID = req.body.userID;
  const newBio = req.body.newBio;

  const userRef = doc(db, "Users", userID);
  await updateDoc(userRef, {bio: newBio});
  res.send("bio updated");
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import cors from "cors";
import express from "express";
import getAllCourses from "./routes/getAllCourses.js";
import enroll from "./routes/enroll.js";
import getEnrolledCourses from "./routes/getEnrolledCourses.js";
import getCreatedCourses from "./routes/getCreatedCourses.js";
import newUser from "./routes/newUser.js";
import newCourse from "./routes/newCourse.js";
import deleteCourse from "./routes/deleteCourse.js";
import getProfile from "./routes/getProfile.js";
import updateBio from "./routes/updateBio.js";
import getSlides from "./routes/getSlides.js";
import getChapterNotes from "./routes/getChapterNotes.js";
import saveNotes from "./routes/saveNotes.js";

const app = express();

const PORT = process.env.PORT || 5000;

//Middleware

app.use(express.json()); // enable json

app.use(cors());

//routes

app.use("/getAllCourses", getAllCourses);

app.use("/enroll", enroll);

app.use("/getEnrolledCourses", getEnrolledCourses);

app.use("/getCreatedCourses", getCreatedCourses);

app.use("/newUser", newUser);

app.use("/deleteCourse", deleteCourse);

app.use("/getProfile", getProfile);

app.use("/updateBio", updateBio);

app.use("/newCourse", newCourse);

app.use("/getSlides",getSlides);

app.use("/getChapterNotes", getChapterNotes);

app.use("/saveNotes", saveNotes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

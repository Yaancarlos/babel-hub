import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attendanceRoutes from "./routes/attendance.routes.js";
import {errorHandler} from "./middleware/error.middleware.js";
import gradesRoutes from "./routes/grades.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/attendance", attendanceRoutes);
app.use("/grades", gradesRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})
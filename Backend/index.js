import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import Studentdata from "./models/User.js";
import "dotenv/config";

const app = express();
connectDb();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true,
  allowedHeaders: ["content-type"],
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/users", async (req, res) => {
  try {
    const users = await Studentdata.find();
    if (!users) {
      res
        .status(204)
        .json({ message: "Successfull,but there is no content to return" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, dob, gender, city, state } = req.body;

    if (!name || !email || !dob || !gender || !city || !state) {
      return res.status(400).json({ message: "Please fill all the detail." });
    }

    const ExistingUser = await Studentdata.findOne({ email });
    if (ExistingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const newStudent = new Studentdata({
      name,
      email,
      dob,
      gender,
      city,
      state,
    });
    const savedStudent = await newStudent.save();
    res.status(201).json({ message: "User added", student: savedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, dob, gender, city, state } = req.body;

    const updatedUser = await Studentdata.findByIdAndUpdate(
      id,
      { name, email, dob, gender, city, state },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Studentdata.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Your Backend is runnig at port ${PORT}`);
});

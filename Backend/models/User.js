import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const Studentdata = mongoose.model("Student", studentSchema);
export default Studentdata;

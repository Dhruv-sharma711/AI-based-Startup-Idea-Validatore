const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, default: "" },
  email:      { type: String, required: true, unique: true,match: [/^\S+@\S+\.\S+$/, "Please use a valid email"] },
  password:   { type: String, required: true, minlength: 8}
});

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
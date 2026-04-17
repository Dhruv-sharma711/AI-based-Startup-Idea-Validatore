const express = require("express");
const router = express.Router();

const {
  createRegistration,
  loginUser,
  getAllRegistrations
} = require("../controller/registrationcontroller");

router.post("/register", createRegistration);
router.post("/login", loginUser);        // ✅ NEW: Login endpoint
router.get("/users", getAllRegistrations);

module.exports = router;
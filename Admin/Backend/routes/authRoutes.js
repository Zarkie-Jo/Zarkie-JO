const express = require("express");
const authController = require("../controller/authadminController");

const router = express.Router();

// Add CORS handling for the login route specifically
router.options("/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5174");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

router.post("/login", authController.adminLogin);

module.exports = router;

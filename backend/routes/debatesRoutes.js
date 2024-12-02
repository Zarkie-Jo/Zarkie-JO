const express = require("express");
const router = express.Router();
const debateController = require("../controllers/debateController");

// Public Routes
router.get("/", debateController.getAllDebates);
router.get("/:id", debateController.getDebateById);

module.exports = router;

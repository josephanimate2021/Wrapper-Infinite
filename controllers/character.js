const express = require("express"),
	router = express.Router(),
	Character = require("../models/character");

//useless
router.post("/getCCPremadeCharacters", (req, res) => res.end(""))

module.exports = router

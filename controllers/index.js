const express = require("express"),
	router = express.Router();

// goapi
router.use("/ajax", require("./ajax"))
router.use("/app", require("./flash"))
router.use("/goapi", require("./asset"))
router.use("/goapi", require("./movie"))
router.use("/goapi", require("./theme"))
router.use("/goapi", require("./tts"))
router.use("/api_v2", require("./asset"))

module.exports = router

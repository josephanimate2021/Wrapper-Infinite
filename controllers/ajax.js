const express = require("express"),
	router = express.Router(),
	Movie = require("../models/movie");

router.get("/movie/list", async (req, res) => {
	const list = await Movie.list()
	console.log(list.map(meta => meta))
	json = {
		status: "ok",
		movies: list.map(meta => meta)
	}
	res.json(json)
})

module.exports = router

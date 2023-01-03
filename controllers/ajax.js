const express = require("express"),
	router = express.Router(),
	Movie = require("../models/movie");

router.get("/movie/list", (req, res) => {
	const list = Movie.list()
	console.log(list.map(meta => meta))
	json = {
		status: "ok",
		movies: list.map(meta => meta)
	}
	res.json(json)
})

router.get("/deleteMovie/:mId", (req, res) => {
	Movie.delete(req.params.mId);
	res.end();
})

module.exports = router

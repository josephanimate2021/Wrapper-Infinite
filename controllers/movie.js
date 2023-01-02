const express = require("express"),
	router = express.Router(),
	Movie = require("../models/movie");

router.post("/saveTemplate/", async (req, res) => {
	id = await Movie.save(req.body, true);
	if(!id) { //an error happened
		console.error("Error while saving starter.")
		res.status(500).end("1")
	}
	else
		res.end(`0${id}`)
})
router.post("/saveMovie/", async (req, res) => {
	id = await Movie.save(req.body);
	if(!id) { //an error happened
		console.error("Error while saving movie.")
		res.status(500).end("1")
	}
	else
		res.end(`0${id}`)
})
router.post("/getMovie/", async (req, res) => {
	const id = req.query.movieId;
	Movie.load(id).then(buf => {
		res.setHeader("Content-Type", "application/zip");
		res.end(buf);
	}).catch((err) => {
		console.log("Error loading movie:", err);
		res.status(404);
		res.end("1" + err);
	});
});
router.get("/movie_thumbs/:mId", async (req, res) => {
	const mId = req.params.mId;
	res.setHeader("Content-Type", "image/png");
	const buffer = await Movie.loadThumb(mId);
	res.end(buffer);
})

module.exports = router

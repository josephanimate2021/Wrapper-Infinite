const express = require("express");
const router = express.Router();
const fs = require("fs");
const JSZip = require("jszip");

router.post("/getThemelist/", (req, res) => {
	// short themelist option
	const short = req.cookies.shortthemelist == 1;

	try {
		var xml = fs.readFileSync((short) ? `${__dirname}/${process.env.store_path}/_short-themelist.xml` : `${__dirname}/${process.env.store_path}/_themelist.xml`);
	} catch(err) { // themelist doesn't exist
		console.error("Themelist doesn't exist? You may be missing the wrapper/static folder.");
		res.status(500).json({ status: "forbidden", message: "Themelist doesn't exist." });
		res.end();
	}
	const zip = new JSZip();
	// add themelist to zip
	zip.file("themelist.xml", xml);

	res.set("Content-Type", "application/zip")
	// generate a zip file
	zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
		.pipe(res)
		.on("finish", () => res.end());
});

router.post("/getTheme/", (req, res) => {
	// check if there's no theme specified
	if (!req.body.themeId) req.status(400).json({ status: "forbidden", message: "Theme not specified." });

	try {
		var xml = fs.readFileSync(`${__dirname}/${process.env.store_path}/${req.body.themeId}/theme.xml`);
	} catch(err) { // theme doesn't exist
		console.error("Theme doesn't exist.");
		res.status(404).json({ status: "forbidden", message: "Theme doesn't exist." });
		res.end();
	}
	const zip = new JSZip();
	// add themelist to zip
	zip.file("theme.xml", xml);

	res.set("Content-Type", "application/zip")
	// generate a zip file
	zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
		.pipe(res)
		.on("finish", () => res.end());
});

module.exports = router;

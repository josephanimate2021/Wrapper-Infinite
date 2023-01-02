const fUtil = require("../helpers/file"),
	fs = require("fs");

/**
 * @summary Unzips a movie, and saves it
 * @param {string} bytes
 * @param {string} thumb
 * @param {string} id
 * @param {boolean} autosave
 * @returns {string}
 */
exports.save = async function(xml, thumb, id = false) {
	id = (!id) ? newMovieId() : id
	if (autosave && checkIfSaved(id) || !autosave) {
		var zipBuffer = Buffer.from(bytes, "base64"),
			thumbBuffer = Buffer.from(thumb, "base64"),
			zip = nodezip.unzip(zipBuffer),
			xml = ""
		await zip["movie.xml"].toReadStream()
			.on("data", b => xml = b)
			.on("end", async () => {
				fs.writeFile(`${__dirname}/${process.env.SAVED_FOLDER}/movie-${id}.xml`, xml, (err) => { return false })
				fs.writeFile(`${__dirname}/${process.env.SAVED_FOLDER}/movie-${id}.png`, thumbBuffer, (err) => { return false })
			});
	}
	return id
};

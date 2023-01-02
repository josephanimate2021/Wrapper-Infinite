const fUtil = require("../helpers/file"),
	folder = process.env.ASSET_FOLDER,
	mp3Duration = require("mp3-duration"),
	fs = require("fs");
var duration



/**
 * @summary Generates a random asset id
 * @returns {string}
 */
function newAssetId() {
	var id = fUtil.generateId()
	//check if id is taken
	return (checkIfSaved(id)) ? newAssetId() : id
}
/**
 * @summary Checks if an asset is saved
 * @param {string} id
 * @returns {string}
 */
function checkIfSaved(id) {
	fs.access(`${__dirname}/${folder}/movie-${id}.xml`, fs.constants.F_OK, (err) => {
		if (err) return true
		else return false
	})
}
function checkIfSaved(id) {
	fs.access(`${__dirname}/${folder}/movie-${id}.xml`, fs.constants.F_OK, (err) => {
		if (err) return true
		else return false
	})
}
async function getSoundDuration(buffer) {
	//get mp3 duration
	await mp3Duration(buffer).then(d => {
		duration = d * 1e3
	}).catch(e => {throw e});
}

exports.load = function(id) {
	var match = false
	fs.readdirSync(`${__dirname}/${folder}`)
		.forEach((filename) => {
			if (filename.search(id) !== -1) match = filename
		})
	return (match) ? fs.readFileSync(`${__dirname}/${folder}/${match}`) : ""
}

exports.saveAsset = function(data, type, subtype, ext) {
	const id = newAssetId()
	fs.writeFileSync(`${__dirname}/${folder}/${type}-${subtype}-${id}.${ext}`, data)
	return id
}

exports.list = async function(type, subtype = "") {
	var table = []
	//support for subtype listing
	subtype = (subtype !== "") ? `-${subtype}` : ""
	for(const filename of fs.readdirSync(`${__dirname}/${folder}`)) {
		if (filename.search(`${type}${subtype}-`) !== -1) {
			const pieces = filename.split(/[-.]/)
			switch(type) {
				case "sound": {
					await getSoundDuration(`${__dirname}/${folder}/${filename}`)
					var metadata = {
						type: pieces[0],
						subtype: pieces[1],
						id: pieces[2],
						ext: pieces[3],
						"duration": duration
					}
					break;
				}
				case "background":
				case "prop":
				default: {
					var metadata = {
						type: pieces[0],
						subtype: pieces[1],
						id: pieces[2],
						ext: pieces[3]
					}
					break;
				}
			}
			table.push(metadata)
		}
	}
	return table
}


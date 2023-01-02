const folder = `${__dirname}/.${process.env.SAVED_FOLDER}`,
	nodezip = require("node-zip"),
	fs = require("fs"),
	http = require("http"),
	https = require("https");

/**
 * @summary generates a random id
 * @returns {string}
 */
exports.generateId = function() {
	return Math.random().toString(16).substr(2, 9);
};

exports.getUrl = function(url, options = {}) {
	var data = [];
	return new Promise((res, rej) => {
		try {
			http.get(url, options, (response) =>
				response
					.on("data", (v) => data.push(v)) // push data to object
					.on("end", () => res(Buffer.concat(data))) // return data
					.on("error", rej)
			);
		} catch(err) {
			https.get(url, options, (response) =>
				response
					.on("data", (v) => data.push(v)) // push data to object
					.on("end", () => res(Buffer.concat(data))) // return data
					.on("error", rej)
			);
		}
	});
};

/**
 * @summary creates a zip file
 * @param {string} fileName
 * @param {string} zipName
 */
exports.makeZip = function(fileName, zipName) {
	if (!fs.existsSync(fileName)) { console.log("File does not exist"); } //file doesn't exist
	const buffer = fs.readFileSync(fileName);
	const zip = nodezip.create();
	this.addToZip(zip, zipName, buffer);
	return zip.zip();
};

/**
 * @summary fixed version of ZipFile.add
 * @param {nodezip.ZipFile} zip
 * @param {string} zipName
 * @param {string} buffer
 */
exports.addToZip = function(zip, zipName, buffer) {
	zip.add(zipName, buffer);
	//i don't know what this does but i feel like something will go wrong if i remove it so i'm leaving it here
	if (zip[zipName].crc32 < 0) zip[zipName].crc32 += 4294967296;
};


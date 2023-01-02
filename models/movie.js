const fUtil = require("../helpers/file"),
	jszip = require('jszip'),
	Parse = require("./movieParser"),
	base = Buffer.alloc(1, 0),
	fs = require("fs");

exports.loadThumb = function(mId) {
	return new Promise(res => {
		try {
			try {
				const buffer = fs.readFileSync(`./saved/movies/movie-${mId}.png`);
				res(buffer);
			} catch (e) {
				const buffer = fs.readFileSync(`./saved/movies/starter-${mId}.png`);
				res(buffer);
			}
		} catch (e) {
			rej(e);
		}
	})
}
exports.unzipXmls = async function(id, mode) {
	const fileContent = fs.readFileSync(`${id}.zip`);
	const jszipInstance = new jszip();
	const result = await jszipInstance.loadAsync(fileContent);
	const keys = Object.keys(result.files);
	for (let key of keys) {
		const item = result.files[key];
		fs.writeFileSync(`./saved/movies/${mode}-${id}.xml`, Buffer.from(await item.async("arraybuffer")));
	}
};
exports.list = function(starter = false) {
	const mode = starter ? "starter" : "movie";
	const table = [];
	fs.readdirSync('./saved/movies').forEach(file => {
		if (!file.includes(".png")) return;
		const [ beg, mid ] = file.split("-");
		const [ id, end ] = mid.split(".");
		if (!fs.existsSync(`./saved/movies/${mode}-${id}.xml`)) return;
		const xml = fs.existsSync(`./saved/movies/${mode}-${id}.xml`);
		const png = fs.existsSync(`./saved/movies/${mode}-${id}.png`);
		const buffer = fs.readFileSync(`./saved/movies/${mode}-${id}.xml`);
		const begTitle = buffer.indexOf("<title>") + 16;
		const endTitle = buffer.indexOf("]]></title>");
		const title = buffer.slice(begTitle, endTitle).toString().trim();
		const begDuration = buffer.indexOf('duration="') + 10;
		const endDuration = buffer.indexOf('"', begDuration);
		const duration = Number.parseFloat(buffer.slice(begDuration, endDuration));
		const min = ("" + ~~(duration / 60)).padStart(2, "0");
		const sec = ("" + ~~(duration % 60)).padStart(2, "0");
		const durationStr = `${min}:${sec}`;
		const data = {
			durationString: durationStr,
			title: title,
			id: id
		}
		if (xml && png) table.push(data);
	});
	console.log(table);
	return table;
};
exports.generateThumbFromUrl = function() {
	return new Promise((res, rej) => {
		fUtil.getUrl('https://raw.githubusercontent.com/GoAnimate-Wrapper/GoAnimate-Thumbnails/master/thumbnails/257666432.jpg').then(v => {
			res(v);
		}).catch(e => rej(e));
	});
}
exports.load = async function(mId) {
	try {
		const filepath = `./saved/movies/movie-${mId}.xml`;
		const buffer = fs.readFileSync(filepath);
		const parsed = await Parse.pack(buffer);
		return Buffer.concat([base, parsed]);
	} catch (e) {
		const filepath = `./saved/movies/starter-${mId}.xml`;
		const buffer = fs.readFileSync(filepath);
		const parsed = await Parse.pack(buffer);
		return Buffer.concat([base, parsed]);
	}
},



/**
 * @summary Unzips a movie, and saves it
 * @param {string} bytes
 * @param {string} thumb
 * @param {string} id
 * @param {boolean} autosave
 * @returns {string}
 */
exports.save = function(data, starter = false) {
	const mode = starter ? "starter" : "movie";
	var thumb;
	const body = Buffer.from(data.body_zip, "base64");
	if (data.save_thumbnail) thumb = Buffer.from(data.thumbnail, "base64");
	else thumb = this.generateThumbFromUrl();
	const id = !data.movieId ? fUtil.generateId() : data.movieId;
	fs.writeFileSync(`${id}.zip`, body);
	fs.writeFileSync(`./saved/movies/${mode}-${id}.png`, thumb);
	this.unzipXmls(id, mode);
	fs.unlinkSync(`${id}.zip`);
	return id;
};
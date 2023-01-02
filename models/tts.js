const fUtil = require("../helpers/file"),
	fs = require("fs"),
	https = require("https"),
	list = require("../json/voices"),
	voices = list.voices,
	langs = {};



/**
 * @summary Generates a voice xml the studio can read
 * @param {string} bytes
 * @param {string} thumb
 * @param {string} id
 * @param {boolean} autosave
 * @returns {string}
 */
exports.list = function() {
	//sort voices into an array
	Object.keys(voices).forEach(id => {
		console.log(id)
		const v = voices[id]
		console.log(v)
		langs[v.language] = langs[v.language] || []
		langs[v.language].push(`<voice id="${id}" desc="${v.desc}" sex="${v.sex}" demo-url="" country="${v.country}" plus="N" />`)
	})
	
	const xml = `${process.env.XML_HEADER}<voices>${Object.keys(langs).sort()
		.map(lang => {
			const voices = langs[lang],
				desc = list.languages[lang];
			return `<language id="${lang}" desc="${desc}">${voices.join("")}</language>`;
		}).join("")}</voices>`
	return xml
};

/**
 * @summary Unzips a movie, and saves it
 * @param {string} bytes
 * @param {string} thumb
 * @param {string} id
 * @param {boolean} autosave
 * @returns {string}
 */
exports.generate = async function(id, text) {
	return new Promise(async (res, rej) => {
		const voice = voices[id]
		if (!voice) rej("Voice doesn't exist?")
		switch (voice.source) {
			//polly voices
			case "polly": {
				/**
				 * Does a POST request to https://pollyvoices.com/.
				 * The response is a redirect to /play/(id).mp3.
				 * Then it gets the redirect link and removes the "/play" part and requests that URL, which returns the file.
				 * 
				 * Example: (path - method - data - headers (optional))
				 * / - POST - text=(text)&voice=(voice)
				 * 	   Redirected to /play/(id)
				 * /(id) - GET
				 *     File
				 */
				const params = new URLSearchParams({
					"text": text,
					"voice": voice.arg
				}).toString()
				var req = https.request(
					{
						hostname: "pollyvoices.com",
						port: "443",
						path: "/",
						method: "POST",
						headers: {
							"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
							"Accept-Encoding": "application/x-www-form-urlencoded",
							"Accept-Language": "en-US,en;q=0.5",
							"Connection": "keep-alive",
							"Content-Type": "application/x-www-form-urlencoded",
							"Host": "pollyvoices.com",
							"Origin": "https://pollyvoices.com",
							"Referer": "https://pollyvoices.com/",
							"Sec-Fetch-Dest": "document",
							"Sec-Fetch-Mode": "navigate",
							"Sec-Fetch-Site": "same-origin",
							"Sec-Fetch-User": "?1",
							"Sec-GPC": "1",
							"Upgrade-Insecure-Requests": "1",
							"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0",
							"Pragma": "no-cache",
							"Cache-Control": "no-cache",
						},
					},
					(r) => {
						const file = r.headers.location.substring(6)
						r.on("data", (b) => {
							fUtil.get(`https://pollyvoices.com/${file}`)
								.then(buffer => res(buffer, voice.desc))
								.catch(err => rej(err))
						})
						r.on("error", (err) => rej("Unable to generate TTS. Please check your internet connection."))
					}
				)
				req.write(params)
				req.end()
			}
		}
	})
};

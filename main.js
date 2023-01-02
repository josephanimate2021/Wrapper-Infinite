/***
this file starts infinite
***/

const express = require("express");
const { forEach } = require("jszip");
const app = express();
const pages = require("./pages");
// assign config.json to process.env
Object.assign(process.env, require("./config"));

// http logging
app.use(require("morgan")("dev"))
// page templates
app.set("view engine", "pug")
app.set("views", "./views")
// post body
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
// cookie parser, used for options like the short themelist
app.use(require("cookie-parser")())
// static files
app.use(express.static("static", { fallthrough: true }))
// the pages
app.use(require("./controllers"))
// fake pages
app.use((req, res) => {
	console.log("fuck");
	var methodLinks = pages[req.method];
	for (let linkIndex in methodLinks) { // look for correct page
		var regex = new RegExp(linkIndex);
		if (regex.test(req.url)) { // match
			var t = methodLinks[linkIndex];
			var headers = t.headers;

			try {
				for (var headerName in headers || {}) { // set headers
					res.set(headerName, headers[headerName]);
				}
				res.status(t.statusCode || 200);
				res.end(t.content);
			} catch (e) { // send 404
				res.status(404).sendFile(`${__dirname}/static/404.html`);
			}
		}
	}
	// not found
	res.status(404).sendFile(`${__dirname}/static/404.html`);
})

// MEAAAAAAAAAAAHH!
app.listen(process.env.port || 4343)

/***
this file starts infinite
***/

const express = require("express");
const { forEach } = require("jszip");
const app = express();
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

// MEAAAAAAAAAAAHH!
app.listen(process.env.port || 4343)

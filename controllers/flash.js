const express = require("express"),
	router = express.Router()

router.get("/cc", (req, res) => {
	const flashvars = new URLSearchParams({
		appCode: "go",
		bs: req.body.bs || "adam",
		ctc: "go",
		isEmbed: 1,
		isLogin: "Y",
		m_mode: "school",
		original_asset_id: req.query.id || null,
		page: "",
		siteId: "go",
		themeId: req.body.themeId || "custom",
		tlang: "en_US",
		ut: 60,
		apiserver: "/",
		storePath: "../static/store/<store>",
		clientThemePath: "../static/<client_theme>",
	}).toString()
	res.render("flash", { title: "Character Creator", swf: "../static/animation/cc.swf", flashvars: flashvars, extra: "<script>function characterSaved() {$(window).attr('location', '/')}</script>" })
});
router.get("/cc_browser", (req, res) => {
	const flashvars = new URLSearchParams({
		appCode: "go",
		ctc: "go",
		isEmbed: 1,
		isLogin: "Y",
		lid: 13,
		m_mode: "school",
		page: "",
		siteId: "go",
		themeId: req.body.themeId || "family",
		tlang: "en_US",
		ut: 60,
		apiserver: "/",
		storePath: "../static/store/<store>",
		clientThemePath: "../static/<client_theme>",
	}).toString()
	res.render("flash", { title: "Character Browser", swf: "../static/animation/cc_browser.swf", flashvars: flashvars, extra: "" })
});

router.get("/studio", (req, res) => {
	const flashvars = new URLSearchParams({
		appCode: "go",
		collab: 0,
		ctc: "go",
		goteam_draft_only: 1,
		isLogin: "Y",
		isWide: 1,
		lid: 13,
		nextUrl: "/",
		page: "",
		retut: 1,
		siteId: "go",
		tray: req.query.tray || "custom",
		movieId: req.query.movieId || "",
		tlang: "en_US",
		ut: 60,
		apiserver: "/",
		storePath: "/static/store/<store>",
		clientThemePath: "/static/<client_theme>",
	}).toString()
	res.render("studio", { flashvars: flashvars })
});
router.get("/player", (req, res) => {
	const flashvars = new URLSearchParams({
		autostart: 1,
		isWide: 1,
		ut: 50,
		apiserver: "/",
		storePath: "../static/store/<store>",
		clientThemePath: "../static/<client_theme>",
		movieId: req.query.movieId || ""
	}).toString()
	res.render("flash", { title: "Video Player", swf: "../static/animation/player.swf", flashvars: flashvars, extra: "" })
});

module.exports = router

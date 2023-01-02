const express = require("express"),
	router = express.Router(),
	nodezip = require("node-zip"),
	header = process.env.XML_HEADER,
	fUtil = require("../helpers/file"),
	Asset = require("../models/asset"),
	Movie = require("../models/movie"),
	fs = require("fs");

/**
 * @summary Organizes an asset array into an XML
 * @param {Array} data 
 * @returns {object}
 */
async function listAssets(data) {
	var json;
	switch (data.type) {
		/* backdrops and starters */
		case "bg": {
			await Asset.list("bg").then(list => {
				//generate xml
				json = {
					"status": "ok",
					"data": {
						"xml": `${header}<ugc more="0">${list
							.map((v) => `<background subtype="0" id="${v.id}" name="Untitled" enable="Y" asset_url="/api_v2/assets/${v.id}"/>`)
							.join("")}</ugc>`
					}
				}
			})
			break
		}
		case "prop": {
			/* props */
			if(data.subtype) {
				await Asset.list("prop", "video").then(list => {
					//generate xml
					json = {
						"status": "ok",
						"data": {
							"xml": `${header}<ugc more="0">${list
								.map((v) => `<prop subtype="video" id="${v.id}" name="Untitled" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="0" height="0" asset_url="/api_v2/assets/${v.id}"/>`)
								.join("")}</ugc>`
						}
					}
				})
			}
			/* videos */
			await Asset.list("prop", 0).then(list => {
				//generate xml
				json = {
					"status": "ok",
					"data": {
						"xml": `${header}<ugc more="0">${list
							.map((v) => `<prop subtype="0" id="${v.id}" name="Untitled" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="0" height="0" asset_url="/api_v2/assets/${v.id}"/>`)
							.join("")}</ugc>`
					}
				}
			})
			break
		}
		/* sounds */
		case "sound": {
			await Asset.list("sound").then(list => {
				//generate xml
				json = {
					"status": "ok",
					"data": {
						"xml": `${header}<ugc more="0">${list
							.map((v) => `<sound subtype="${v.subtype}" id="${v.id}.${v.ext}" name="${v.id}" enable="Y" duration="${v.duration}" downloadtype="progressive" asset_url="/api_v2/assets/${v.id}"/>`)
							.join("")}</ugc>`
					}
				}
			})
			break
		}
		case "movie": {
			const list = await Movie.list(true);
			//generate xml
			json = {
				"status": "ok",
				"data": {
					"xml": `${header}<ugc more="0">${list.map((v) => `<movie id="${v.id}" enc_asset_id="${v.id}" path="/_SAVED/${v.id}" numScene="1" title="${v.title}" thumbnail_url="/goapi/movie_thumbs/${v.id}"><tags></tags></movie>`).join("")}</ugc>`
				}
			}
			break
		}
	}
	return json
}

/**
list all assets
**/
router.post(["/assets/team", "/assets/shared"], (req, res) => {
	listAssets(req.body.data)
		.then(json => {
			res.setHeader("Content-Type", "application/json")
			res.json(json)
		})
})

/**
load an asset
**/
router.post("/getAsset/", (req, res) => res.end(Asset.load(req.body.assetId)))
router.get("/assets/:assetId", (req, res) => res.end(Asset.load(req.params.assetId)))

/**
delete an asset
**/
router.get("/assets/delete/", (req, res) => {
	res.end("1")
})

module.exports = router

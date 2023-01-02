const express = require("express"),
	router = express.Router(),
	jszip = require("jszip"),
	header = process.env.XML_HEADER,
	zip = new jszip,
	Asset = require("../models/asset"),
	Movie = require("../models/movie"),
	base = Buffer.alloc(1, 0);
	fs = require("fs");

/**
 * @summary Organizes an asset array into an XML
 * @param {Array} data 
 * @returns {object}
 */
async function listAssets(data) {
	var xml;
	switch (data.type) {
		/* backdrops and starters */
		case "bg": {
			await Asset.list("bg").then(list => {
				//generate xml
				xml = `${header}<ugc more="0">${list.map((v) => `<background subtype="0" id="${v.id}" name="Untitled" enable="Y" asset_url="/api_v2/assets/${v.id}"/>`).join("")}</ugc>`
			})
			break
		}
		case "prop": {
			/* props */
			if(data.subtype) {
				await Asset.list("prop", "video").then(list => {
					//generate xml
					xml = `${header}<ugc more="0">${list.map((v) => `<prop subtype="video" id="${v.id}" name="Untitled" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="0" height="0" asset_url="/api_v2/assets/${v.id}"/>`).join("")}</ugc>`
				})
			} else {
				/* videos */
				await Asset.list("prop", 0).then(list => {
					//generate xml
					xml = `${header}<ugc more="0">${list.map((v) => `<prop subtype="0" id="${v.id}" name="Untitled" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="0" height="0" asset_url="/api_v2/assets/${v.id}"/>`).join("")}</ugc>`
				})
			}
			break
		}
		/* sounds */
		case "sound": {
			await Asset.list("sound").then(list => {
				//generate xml
				xml = `${header}<ugc more="0">${list.map((v) => `<sound subtype="${v.subtype}" id="${v.id}.${v.ext}" name="${v.id}" enable="Y" duration="${v.duration}" downloadtype="progressive" asset_url="/api_v2/assets/${v.id}"/>`).join("")}</ugc>`
			})
			break
		}
		case "movie": {
			const list = Movie.list(true);
			//generate xml
			xml = `${header}<ugc more="0">${list.map((v) => `<movie id="${v.id}" enc_asset_id="${v.id}" path="/_SAVED/${v.id}" numScene="1" title="${v.title}" thumbnail_url="/goapi/movie_thumbs/${v.id}"><tags></tags></movie>`).join("")}</ugc>`
			break
		}
	}
	return xml
}

/**
list all assets
**/
router.post(["/assets/team", "/assets/shared"], (req, res) => {
	listAssets(req.body.data).then(xml => {
		res.setHeader("Content-Type", "application/json")
		res.json({status: "ok", data: { xml: xml }});
	})
})
router.post("/getUserAssetsXml/", (req, res) => {
	listAssets(req.body).then(xml => {
		res.setHeader("Content-Type", "text/xml")
		res.end(Buffer.from(xml));
	});
})
router.post("/getUserAssets/", async (req, res) => {
	const data = req.body;
	res.setHeader("Content-Type", "application/zip");
	res.write(base);
	var xml, files;
	switch (data.type) {
		case "bg": {
			files = await Asset.list("bg");
			xml = `<ugc more="0">${files.map(v => `<background subtype="0" id="${v.id}" name="${v.title}" enable="Y"/>`).join("")}</ugc>`;
			break;
		} case "movie": {
			files = Movie.list(true);
			xml = `<ugc more="0">${files.map(v => `<movie id="${v.id}" enc_asset_id="${v.id}" path="${process.env.STARTER_FOLDER}/${
				v.id
			}" numScene="1" title="${v.title}" thumbnail_url="/goapi/movie_thumbs/${v.id}"><tags>${v.tags}</tags></movie>`).join("")}</ugc>`;
			break;
		} default: {
			xml = `<ugc more="0"></ugc>`;
			break;
		}
	}
	zip.file("desc.xml", Buffer.from(xml));
	zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(res).on('finish', function () {
		res.end();
	});
})

/**
loads assets using file buffers
**/
router.post(["/getAsset/", "/getAssetEx/"], (req, res) => res.end(Asset.load(req.body.assetId)))
router.get("/assets/:assetId", (req, res) => res.end(Asset.load(req.params.assetId)))

/**
loads asset meta
**/
router.post("/asset/get", (req, res) => {
	const id = req.body?.data.id || req.body?.data.starter_id;
	const info = {
		id: id,
		title: fs.readFileSync(`./saved/meta/${id}-title.txt`, 'utf-8'),
		sceneCount: 1,
		assetId: id,
		share: {
			type: "none"
		},
		published: ""
	}
	res.json({
		status: "ok",
		data: info
	});
})

module.exports = router

const express = require("express"),
	router = express.Router(),
	Asset = require("../models/asset"),
	TTS = require("../models/tts"),
	mp3Duration = require("mp3-duration");

router.post("/getTextToSpeechVoices/", (req, res) => {
	const list = TTS.list()
	res.end(list)
})

router.post("/convertTextToSoundAsset/", (req, res) => { 
	//generate tts mp3
	TTS.generate(req.body.voice, req.body.text).then((buffer, desc) => {
		//get mp3 duration
		mp3Duration(buffer, (e, d) => {
			var dur = d * 1e3;
			if (e || !dur) { //no mp3
				res.end(1 + util.xmlFail("Unable to retrieve MP3 stream."));
			}

			const title = `[${desc}] ${req.body.text}`;
			//save clip, returns id
			const id = Asset.saveAsset(buffer, "sound", "tts", "mp3")
			res.end(
				`0<response><asset><id>${id}.mp3</id><enc_asset_id>${id}.mp3</enc_asset_id><type>sound</type><subtype>tts</subtype><title>${title}</title><published>0</published><tags></tags><duration>${dur}</duration><downloadtype>progressive</downloadtype><file>${id}.mp3</file></asset></response>`
			);
		});
	}).catch((err) => res.end(1 + util.xmlFail(err)));
})

module.exports = router

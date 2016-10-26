var express = require('express');
var router = express.Router();
var PlayMusic = require('playmusic');
var loginService = require('../controllers/loginPlayMusicController.js');
var getDetails = require('../controllers/getUserDetailsPlayMusic.js');

/* GET users input and initialize play music. */
router.post('/', function(req, res) {
  pm = new PlayMusic();
  var loginObj = {
    email: req.body.email,
    password: req.body.password
  };
  return loginService.loginPlayMusic(loginObj)
      .then(loginService.initNewSession)
  .then(function() {
        return new Promise(function(resolve, reject) {
          pm.search("bastille lost fire", 5, function(err, data) { // max 5 results
            if(err) {
              return reject(err);
            }
            var song = data.entries.sort(function(a, b) { // sort by match score
              return a.score < b.score;
            }).shift(); // Take first result
            // var streamUrls = [];
            // var titles = [];
            console.log(song);
            // pm.getStreamUrl('Tsbbwp6r2wpwxb55noc6b26kwq4', console.log); // Softcoded version of getstream func
            // pm.getStreamUrl(song.track.nid, function(err, streamUrl) {
            //   console.log(streamUrl);
            //   songData.streamUrl = streamUrl;
            // });U
            resolve(song);
          });
        })
      }).then(function(song) {
        return new Promise(function(resolve, reject) {
          pm.getAlbum(song.album.albumId, true, function(err, albumUrl) {
            if(err) {
              return reject(err);
            }
            console.log('AlbumUrl: ', albumUrl);
            var trackData = {
              trackNids: [],
              trackTitles: []
            };
            for(track in albumUrl.tracks) {
              console.log("track: ", albumUrl.tracks[track].nid);
              if(albumUrl.tracks[track].nid) {
                trackData.trackNids.push(albumUrl.tracks[track].nid);
                trackData.trackTitles.push(albumUrl.tracks[track].title);
                // pm.getStreamUrl(albumUrl.tracks[track].nid, function(err, streamUrl) {
                //   var url = JSON.stringify(streamUrl);
                //   songData.streamUrl.push(url);
                //   var title = (albumUrl.tracks[track].title);
                //   songData.title.push(title);
                //   console.log("streamUrl+_+_+_+_: ", (songData.streamUrl));
                //   console.log("title_+_+_+_+: ", JSON.stringify(songData.title));
                // });
                // console.log("BEFORE RESOLVE", songData.streamUrl, songData.title);
              }
            }
            console.log("Track NIDS: " + trackData.trackNids);
            resolve(trackData);
            //console.log("streamUrls: ", songData.streamUrl)
          //resolve(songData);
          });
        })
      }).then(function(trackData) {
        //return new Promise(function(resolve, reject) {
          var songData = {
            streamUrls: [],
            title: []
          };
          pm.getStreamUrl(trackData.trackNids[0], function(err, streamUrl) {
            console.log("streamURL: ", streamUrl);
            res.render('login', {
              title: trackData.trackTitles[0],
              data:streamUrl
            });
          });
          console.log("DATA: ", JSON.stringify(songData));
    }).catch(console.log);
});

module.exports = router;

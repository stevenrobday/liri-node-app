require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var request = require('request');
var fs = require("fs");

var command = process.argv[2];

var arg = process.argv[3];

function runSwitch() {
    switch (command) {
        case "my-tweets":
            var params = { screen_name: 'Steverini1', count: 20 };
            client.get('statuses/user_timeline', params, function (err, tweets) {
                if (err) {
                    return console.log(err);
                }

                for (var i = 0; i < tweets.length; i++) {
                    console.log("\nTweet: " + tweets[i].text + "\nPosted: " + tweets[i].created_at + "\n----------------------");
                }
            });
            break;
        case "spotify-this-song":
            if (!arg) {
                arg = "Do the Donkey Kong";
            }

            spotify.search({ type: 'track', query: arg, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log(err);
                }

                var song = data.tracks.items[0];

                console.log("\nArtist: " + song.album.artists[0].name + "\nSong: " + song.name + "\nPreview: " + song.preview_url + "\nAlbum: " + song.album.name);
            });
            break;
        case "movie-this":
            if (!arg) {
                arg = "The Jerk";
            }

            request("http://www.omdbapi.com/?t=" + arg + "&apikey=trilogy", function (err, response, body) {

                if (!err && response.statusCode === 200) {
                    data = JSON.parse(body);
                    console.log("\nTitle: " + data.Title + "\nYear: " + data.Year + "\nIMDB Rating: " + data.Ratings[0].Value + "\nRotten Tomatoes Rating: " + data.Ratings[1].Value + "\nCountry produced in: " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors);
                }
                else {
                    console.log(err);
                }
            });
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var arr = data.split(",");
                command = arr[0];
                arg = arr[1];

                runSwitch();
            });
            break;
    }
}

runSwitch();


// Require our dependencies
var express = require('express');
exphbs = require('express-handlebars');

//noinspection JSAnnotator
http     = require('http');
mongoose = require('mongoose');
twitter  = require('ntwitter');
routes   = require('./routes');
config   = require('./config');
streamHandler = require('./utils/streamHandler');

// Create an express instance and set a port variable
var app  = express();
var port = process.env.PORT || 8080;

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

// Connect to our mongo database
mongoose.connect('mongo://localhost/react-tweets');

// Create a new ntwitter instance
var twit = new twitter(config.twitter);

// Index Route
app.get('/', routes.index);

// Page Route
app.get('/page/:page/:skip', routes.page);

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public"));

// Fire it up (start our server)
var server = http.createServer(app).listen(port, function () {
    console.log('Express server listening on port' + port);
});

//Initialize socket.io
var io = require('socket.io').listen(server);

/*
 Set a stream listener for tweets matching tracking keywords
 nTwitter allows us to access the Twitter streaming API, so we use the statuses/filter endpoint,
 along with the track property, to return tweets that use a #scotchio hash tag or
 mention scotch_io. You can modify this query to your liking by using
 the settings outlined within the Twitter Streaming API.
 */

twit.stream('statuses/filter',{ track: 'react_js, #reactjs'}, function(stream){
    streamHandler(stream,io);
});
/*
 We start by requiring our Model,
 and when our stream emits an event,
 we grab the data we want to save, save it,
 and emit our socket event to the client with
 the Tweet we just saved.
*/

var Tweet = require('../models/Tweet');

module.exports = function (stream, io) {

    // When tweets get sent our way
    stream.on('data', function (data) {

        // Construct a new tweet object
        var tweet = {
            twid: data['id'],
            active: false,
            author: data['user']['name'],
            avatar: data['user']['profile_image_url'],
            body: data['text'],
            date: data['created_at'],
            screenname: data['user']['screen_name']
        };

        // Create a new model instance with our object
        var tweetEntry = new Tweet(tweet);

        // Save 'er to the db
        tweetEntry.save(function (err) {
            if (!err){
                // If everything is cool , socket.io emits the tweet
                io.emit('tweet', tweet)
            }
        });
    });
};
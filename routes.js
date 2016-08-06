/*
 ---------------------------------------------------------------------------------------------
                                                                                             |
 In the code below, we have two specific requirements:                                       |
 - For our index route, we want to return a full page                                        |
    rendered from our React source                                                           |
 - For our page route, we want to return a JSON string containing                            |                     |
    additional tweets based upon our params.                                                 |
                                                                                             |
 --------------------------------------------------------------------------------------------|
                                                                                             |
 By requiring our React components, and calling the renderComponentToString method,          |
 we are converting them to a string, which is then passed into our home.handlebars           |
 template. We leverage our Tweets model to find tweets that have been stored in the          |
 database after coming in from our stream connection. Upon receiving the results of          |
 our query, we render our component to a String.                                             |
                                                                                             |
 --------------------------------------------------------------------------------------------|
                                                                                             |
 Notice that we are using non-JSX syntax when defining the component we want to render.      |
 This is because we are in our routes file and it is not being transformed.                  |
                                                                                             |
 --------------------------------------------------------------------------------------------|
                                                                                             |
 Not only are we passing our stringified markup, but we also pass a state property.          |
 In order for our server rendered application to pick up where it left off on the client,    |
 we need to pass the last state to the client so we can keep them in sync.                   |
                                                                                             |
                                                                                             |
 ---------------------------------------------------------------------------------------------
 */

var JSX   = require('node-jsx').install();
React     = require('react');
TweetsApp = require('./components/TweetsApp.react');
Tweet     = require('./models/Tweet');

module.exports = {
    index: function (req, res) {

        // Call static model method to get tweets in the db
        Tweet.getTweets(0,0, function (tweets, pages) {

            // Render React to a string, passing in our fetched tweets
            var markup = React.renderComponentToString(
                TweetsApp({
                    tweets: tweets
                })
            );

            // Render our 'home' template
            res.render('home', {
                markup: markup, // Pass rendered react markup
                state: JSON.stringify(tweets) // Pass current state to client side
            });
        });

    },

    page: function (req, res) {
        // Fetch tweets by page via param
        Tweet.getTweets(req.params.page, req.params.skip, function (tweets) {

            // Render a JSON
            res.send(tweets);
        });
    }
};

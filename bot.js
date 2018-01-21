console.log("The bot is starting...");

var Twit = require('twit');

//loads keys from config file
var config = require('./config');
var T = new Twit(config);

//setting up a user stream
var stream = T.stream('user');

stream.on('tweet', tweetEvent);

//this function gets the list of followers and list of followings
//and compares them to see which users you follow yet they do 
//not follow you back and then unfollows them
var unfollowNonFollowers = function () {
	//get followings
	T.get('friends/ids', function (err, followings) {
		if (err) {
			console.log(err);
			return;
		}
		
		//get followers
		T.get('followers/ids', function (err, followers) {
			if (err) {
				console.log(err);
				return;
			}

			//iterate through followings and see if they are in the followers list
			//unfollow if not
			for (var i = 0; i < followings.ids.length; ++i) {
				if (!followers.ids.includes(followings.ids[i])) {
					T.post('friendships/destroy', {id: followings.ids[i]}, function (err, response) {
						if(err) {
				          console.log('Error: User could not be unfollowed');
				        }
				        else {
				          console.log('Success: User has been unfollowed');
				        }
					})
				}
			}
		});
	
	});
}

//call function to unfollow users that do not follow you back
unfollowNonFollowers();
// follow a user in every 3 days
setInterval(unfollowNonFollowers, 1000*60*60*24*3);

//auto follow users
var followOnTweet = function() {
	var params = {
      q: 'getting money',
      result_type: 'recent',
      lang: 'en'
    }

    //search tweets given parameters
	T.get('search/tweets', params, function (err, reply) {
		if(err) return callback(err);

		var tweets = reply.statuses;
		var rTweet = ranDom(tweets)
		if(typeof rTweet != 'undefined') {
			var target = rTweet.user.id_str;

			T.post('friendships/create', { id: target }, function(err, response) {
		        // if there was an error while 'favorite'
		        if(err){
		          console.log('Error: User could not be followed');
		        }
		        else{
		          console.log('Success: User has been followed');
		        }
		      });
		}
	});
}

// follow as soon as program is running...
followOnTweet();
// follow a user in every 5 minutes
setInterval(followOnTweet, 1000*60*5);

//favorite tweets that include "getting money"
var favoriteTweet = function() {
  var params = {
      q: 'getting money',
      result_type: 'recent',
      lang: 'en'
  }

  // find the tweet
  T.get('search/tweets', params, function(err,data) {

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined') {
      T.post('favorites/create', {id: randomTweet.id_str}, function(err, response) {
        if(err){
          console.log('Error: Tweet could not be favorited');
        }
        else{
          console.log('Success: Tweet has been favorited');
        }
      });
    }
  });
}
// grab & favorite as soon as program is running...
favoriteTweet();
// favorite a tweet in every 5 minutes
setInterval(favoriteTweet, 1000*60*5);

// function to generate a random tweet tweet
function ranDom (arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};


//reply to people who @ you
function tweetEvent(msg) {
	var replyto = msg.in_reply_to_screen_name;
	var text = msg.text;
	var from = msg.user.screen_name;
	var name = msg.user.name;

	if (replyto === 'GetMoneyBot') {
		tweetMessage('@' + from + ' thank you for tweeting me ' 
			+ name + '! Wishing you nothing but financial gains my love');
	}
}

//anytime someone follows the bot
stream.on('follow', followed);

function followed(data) {
	var name = data.source.name;
	var screenName = data.source.screen_name;
	if (screenName != "GetMoneyBot") {
		tweetMessage('@' + screenName + ' lets get this money together ' +name);
	}
}

function tweetMessage(msg) {
	var tweet = { 
		status: msg
	}
	T.post('statuses/update', tweet, tweeted);
}

//set interval to tweet every 12 hours
setInterval(sendTweet, 1000*60*60*24);


//sends tweet to remind people to get money
function sendTweet() {
	var size = ["", "an absurd amount of", "a crazy amount of", "a foolish amount of", 
				"a goofy amount of", "an illogical amount of", "a laughable amount of", 
				"a ludricous amount of", "an insane amount of", "a nonsensical amount of", 
				"a preposterous amount of", "a silly amount of", "a wacky amount of",
				"hella", "lots", "stupid", "a gigantic amount of", "a sizable amount of",
				"immense", "huge", "a generous amount of", "a enormous amount of",
				"jumbo", "monumental", "mountainous", "bulky", "thicc", "a decent amount of",
				"a humble amount of", "oodles of", "loads of", "gobs of", "tons of",
				"acres of", "a galore of", "plenty of", "an appreciable amount of",
				"a great amount of", "a plethora of", "a good deal of", 
				"a large volume of", "heavy", "obese", "big", "fat", 
				"a hefty amount of", "a large amount of", "a massive amount of",
				"an overweight amount of", "a cumbersome amount of"];

	var r = Math.floor(Math.random()*size.length);
	var tweet = {
		status: 'we getting ' + size[r] + ' money'
	}
	console.log(tweet);
	T.post('statuses/update', tweet, tweeted);
}

function tweeted(err, data, response) {
	  if (err) {
	  	console.log("Error: Message not tweeted")
	  } else {
	  	console.log("Success: Message has been tweeted");
	  }
	}

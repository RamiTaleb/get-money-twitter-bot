console.log("The bot is starting...");

var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);


//setting up a user stream
var stream = T.stream('user');

stream.on('tweet', tweetEvent);

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

//anytime somoene follows the bot
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

//set interval to tweet every 3 hours
setInterval(sendTweet, 1000*60*60*3);


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
				"acres of", "a galore", "plenty of", "an appreciable amount of",
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
	  	console.log("Something went wrong!")
	  } else {
	  	console.log("It worked!");
	  }
	}

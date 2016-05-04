/**
 * @license egosa v1.0.0
 * (c) 2014-2016
    Magistol: https://github.com/Magistol
    ryof: https://github.com/ryof
 * License: MIT
 */
var twitter = require('ntwitter');
var pushover = require('pushover-notifications');
var colors = require('colors');
var conf = require('config');
var util = require('util');

var tw = new twitter({
  consumer_key: conf.twitter.consumer_key,
  consumer_secret: conf.twitter.consumer_secret,
  access_token_key: conf.twitter.access_token_key,
  access_token_secret: conf.twitter.access_token_secret
});

var push = new pushover({
  user: conf.pushover.user,
  token: conf.pushover.token
});

function main_process() {
  tw.stream('user', function(stream) {
    stream.on('data', function(data) {
      // if the data is tweet
      if (data && data.user && data.text) {
        if (filter_tweet(data.user.screen_name, data.text)) {
          send_pushover(data.user.screen_name, data.text, data.id_str);
          util.log((data.user.screen_name + " " + data.text).red);
        }
        else if(conf.debug.show_timeline){
          util.log(data.user.screen_name + " " + data.text);
        }
      }
    });
    stream.on('end', function(response) {
      // disconnect
      main_process();
    });
    stream.on('destroy', function(response) {
      // destroy the connection
    });
    stream.on('error', function(response) {
      util.log(response);
      main_process();
    });
  });
}

var keyword_list = conf.filter.keyword_match;
var exclude_username = conf.filter.exclude_source_username;

// filtering
// return true if tweet meets notification conditions
function filter_tweet(user, tweet) {
  // user-name exclusion if any
  for (var i = 0; i < exclude_username.length; i++) {
    if (user == exclude_username[i]) {
      return false;
    }
  }
  // return true if hits for the keywords
  for (i = 0; i < keyword_list.length; i++) {
    if (tweet.indexOf(keyword_list[i]) != -1) {
      return true;
    }
  }

  return false;
}

// send push notification via pushover
function send_pushover(source, message, message_id) {
  for (var i = 0; i < conf.target_device.length; i++) {
    var msg = {
      message: message,
      title: "Ego search from @" + source,
      sound: 'magic',
      url: "twitter://status?id=" + message_id,
      url_title: "View tweet",
      device: conf.target_device[i],
      priority: 0
    };
    push.send(msg, pushover_result);
  }
}

function pushover_result(err, result) {
  if (err) {
    throw err;
  }
  var res = JSON.parse(result);
  if (res.status !== 1) {
    util.log("notification error: " + res.request);
  }
}

main_process();

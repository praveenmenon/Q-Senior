'use strict';

module.change_code = 1; // Allow this module to be reloaded by hotswap when changed
var Alexa = require('alexa-app');
var app = new Alexa.app('hub');
var resp = require('./events_info');
var QHubDataHelper = new resp();

// Gets called whenever there is a launch request
app.launch(function(req, res) {
  var prompt = 'Hello. welcome to Q hub';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

// get transportation details
app.intent('getTransportationEvent', {
  'slots': {
    'TransportationType': 'TransportationTypeInfo'
  }
},
function(req, res) {

  var rideType = req.slot('TransportationType');
  console.log('type of ride', rideType)
  var tag;
  var response = "";
  var reprompt = "";
  var date = getDate();

  if (rideType && rideType !== null && rideType !== undefined) {
    switch (rideType.toLowerCase()) {

      case 'ride to the mall':
      case 'ride to mall':
      case 'to mall':
      case 'mall':
      tag = "ride to mall";
      break;

      case 'ride to the hospital':
      case 'ride to hospital':
      case 'to hospital':
      case 'hospital':
      tag = "ride to hospital";
      break;

      default:
      tag = "";
    }

    var aa = QHubDataHelper.getEvents(tag, date);

    return aa.then(function(results) {
      console.log('api response - ', results)
      if (results.success == 'true') {
        response = 'The next bus ' + tag + ' is at ' + results.data[0].start_time;
        res.say(response).reprompt(reprompt).shouldEndSession(false).send();
      } else {
        response = 'Currently there are no rides scheduled.';
        console.log('✅  prompt inside:', response);
        res.say(response).shouldEndSession(false).send();
      }
    }).catch(function(error) {
      console.log('❌ prompt during failure:', response);
      response = "Oops! There seems to be an error. Please try again."
      res.say(response).shouldEndSession(false).send();
    });
  } else {
    var reprompt = 'What else would you like to know?';
    var response = 'Sorry, I did not understand the question. Could you please repeat it?';
    res.say(response).reprompt(reprompt).shouldEndSession(false).send();
  }
}
);

// get meal timings
app.intent('getMealTimings', {
  'slots': {
    "MealType": "MealTypeInfo"
  }
},
function(req, res) {
  var mealTag = req.slot('MealType').toLowerCase();
  var date = getDate();
  var tag;
  console.log("Meal type:", mealTag);

  if (mealTag && mealTag !== null && mealTag !== undefined) {

    switch (mealTag.toLowerCase()) {

      case 'breakfast':
      tag = "Breakfast";
      break;
      case 'lunch':
      tag = "Lunch";
      break;
      case 'dinner':
      tag = "Dinner";
      break;

      default:
      tag = mealTag.toLowerCase();
    }
    console.log("Tag:", tag);
    var aa = QHubDataHelper.getEvents(tag, date);

    return aa.then(function(results) {
      console.log('api response - ', results)
      if (results.success == 'true') {
        switch (tag) {
          case 'Breakfast':
          console.log("Breakfast time");
          res.say('Breakfast is served every day at '+results.data[0].start_time+'. Would you like to know what is today\'s breakfast menu?').session('intentName', 'getMealTimings').session('mealType', 'breakfast').session('date', date).shouldEndSession(false);
          break;

          case 'Lunch':
          console.log("Lunch time");
          res.say('Typically lunch starts around '+results.data[0].start_time+'. Would you like to know what is today\'s lunch menu?').session('intentName', 'getMealTimings').session('mealType', 'lunch').session('date', date).shouldEndSession(false);
          break;

          case 'Dinner':
          console.log("Dinner time");
          res.say('Dinner is served at '+ results.data[0].start_time +'. Would you like to know what is today\'s menu for dinner?').session('intentName', 'getMealTimings').session('mealType', 'dinner').session('date', date).shouldEndSession(false);
          break;

          default:
          res.say("Sorry, I did not understand the question. Could you please repeat it?").shouldEndSession(false);
        }
      } else {
        res.say('Currently there are no '+ tag +' scheduled.').shouldEndSession(false).send();
      }
    }).catch(function(error) {
      console.log('❌ prompt during failure:', response);
      response = "Oops! There seems to be an error. Please try again."
      res.say(response).shouldEndSession(false).send();
    });
  }
}
);

// get meal menu
app.intent('getMealMenu', {
  'slots': {
    "MealMenu": "MealMenuType"
  }
},
function(req, res) {
  var mealTag = req.slot('MealMenu').toLowerCase();
  var date = getDate();
  var tag;
  console.log("Meal type:", mealTag);

  if (mealTag && mealTag !== null && mealTag !== undefined) {
    switch (mealTag.toLowerCase()) {
      case 'breakfast':
      tag = "Breakfast";
      break;
      case 'lunch':
      tag = "Lunch";
      break;
      case 'dinner':
      tag = "Dinner";
      break;

      default:
      tag = mealTag.toLowerCase();
    }
    console.log("Tag:", tag);
    var aa = QHubDataHelper.getEvents(tag, date);
    return aa.then(function(results) {
      console.log('api response - ', results)
      if (results.success == 'true') {
        switch (tag) {
          case 'Breakfast':
          res.say("For breakfest we have " + results.data[0].description).shouldEndSession(false).send();
          break;

          case 'Lunch':
          res.say("For Lunch we will be serving you " + results.data[0].description).shouldEndSession(false).send();
          break;

          case 'Dinner':
          res.say("For dinner we have " + results.data[0].description).shouldEndSession(false).send();
          break;

          default:
          res.say('I couldn\'t find any items on the menu.').shouldEndSession(false).send();
        }
      } else {
        console.log('I couldn\'t find any items on the menu.');
        res.say('I couldn\'t find any items on the menu.').shouldEndSession(false).send();
      }
    }).catch(function(error) {
      console.log('❌ prompt during failure:', response);
      response = "Oops! There seems to be an error. Please try again."
      res.say(response).shouldEndSession(false).send();
    });
  }
}
);


// Tag Events
app.intent('getTagEvents', {
  'slots': {
    "TagType": "TagTypeInfo"
  }
},
function(req, res) {
  var tag = req.slot('TagType').toLowerCase();
  var date = getDate();
  var prompt = ""
  var tag;
  console.log("Meal type:", tag);

  if (tag && tag !== null && tag !== undefined) {
    console.log("Tag:", tag);
    if(tag == "entertain"){
      tag =  "entertainment";
    }
    var aa = QHubDataHelper.getUpcomingTagEvents(tag);
    return aa.then(function(results) {
      console.log('api response - ', results)

      if (results.success == 'true') {
        switch (tag) {

          case 'happy hour':
          case 'dog walk':
          case 'recycle':
          case 'social night':
          case 'entertainment':
          if (results.count > 1) {
            prompt = "There are " + results.count + " " + tag + " events.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next " + tag + " event is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + "There are no "+ tag + " event scheduled today."+" Next " + tag + " event is "+ results.data[0].title +", scheduled on "+ results.data[0].date_recurrences[0] +" from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          case 'games':
          if (results.count > 1) {
            prompt = "There are " + results.count + " " + tag + " conducted.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next " + tag + " is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + "There are no games scheduled today."+ " Next " + tag + " is "+ results.data[0].title +", scheduled on "+ results.data[0].date_recurrences[0] +" from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          case 'concert':
          if (results.count > 1) {
            prompt = "There are " + results.count + "concerts held.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next " + tag + " is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + "There are no concerts scheduled today."+ " Next " + tag + " is "+ results.data[0].title +", scheduled on " + results.data[0].date_recurrences[0] + " from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          case 'movie':
          if (results.count > 1) {
            prompt = "There are " + results.count + "movie night events.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next movie night event is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + "There are no movie night scheduled today."+ " Next movie night event is "+ results.data[0].title +", scheduled on " + results.data[0].date_recurrences[0] + " from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          case 'garage sale':
          if (results.count > 1) {
            prompt = "There are " + results.count + "garage sale events.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next garage sale event is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + "There are no "+ tag + " scheduled today."+ " Next garage sale event is "+ results.data[0].title +", scheduled on " + results.data[0].date_recurrences[0] + " from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          case 'housekeeping':
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next housekeeping is scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + "There is no "+ tag + " scheduled today."+ " Next housekeeping is scheduled on " + results.data[0].date_recurrences[0] + " from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          case 'laundry':
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next laundry pickup is today between " + results.data[0].start_time + " and " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + "There are no laundry pickup scheduled today."+ " Next laundry is scheduled on " + results.data[0].date_recurrences[0] + " between " + results.data[0].start_time + " and " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          default:
          res.say('I couldn\'t find any events scheduled for ' + tag +'.').shouldEndSession(false).send();
        }
      } else {
        console.log('I couldn\'t find any events scheduled for ' + tag +'.');
        res.say('I couldn\'t find any events scheduled for ' + tag +'.').shouldEndSession(false).send();
      }
    }).catch(function(error) {
      console.log('❌ prompt during failure:', response);
      response = "Oops! There seems to be an error. Please try again."
      res.say(response).shouldEndSession(false).send();
    });
  }
}
);

// event by title
app.intent('getTitleEvents', {
  'slots': {
    "TitleType": "TitleTypeInfo"
  }
},
function(req, res) {
  var title = req.slot('TitleType').toLowerCase();
  var date = getDate();
  var prompt = ""
  var tag;
  console.log("Meal type:", title);

  if (title && title !== null && title !== undefined) {
    console.log("Tag:", title);
    var aa = QHubDataHelper.getUpcomingTitleEvents(title);
    return aa.then(function(results) {
      console.log('api response - ', results)

      if (results.success == 'true') {
        switch (title) {

          case 'tai chi':
          case 'art':
          case 'zumba':
          if (results.count > 1) {
            prompt = "There are " + results.count + " " + title + " classes.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next " + title + " class is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + " Next " + title + " class is "+ results.data[0].title +", scheduled on "+ results.data[0].date_recurrences[0] +" from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          case 'field':
          if (results.count > 1) {
            prompt = "There are " + results.count + " " + title + " trips.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next " + title + " trip is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + "There are no field trip event scheduled today."+ " Next " + title + " trip is "+ results.data[0].title +", scheduled on "+ results.data[0].date_recurrences[0] +" from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          case 'bingo':
          case 'board':
          case 'puzzle':
          case 'card':
          if (results.count > 1) {
            prompt = "There are " + results.count + " " + title + " games.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next " + title + " game is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else{
            res.say(prompt + " Next " + title + " game is "+ results.data[0].title +", scheduled on "+ results.data[0].date_recurrences[0] +" from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          break;

          default:
          if (results.count > 1) {
            prompt = "There are " + results.count + " " + title + " games.";
          }
          if (results.data[0].date_recurrences[0] == date){
            res.say(prompt + " Next " + title + " event is "+ results.data[0].title +", scheduled today from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
          else {
            res.say(prompt + " Next " + title + " event is "+ results.data[0].title +", scheduled on "+ results.data[0].date_recurrences[0] +" from " + results.data[0].start_time + " to " + results.data[0].end_time + ".").shouldEndSession(false).send();
          }
        }
      } else {
        console.log('I couldn\'t find any events scheduled.');
        res.say('I couldn\'t find any events scheduled.').shouldEndSession(false).send();
      }
    }).catch(function(error) {
      console.log('❌ prompt during failure:', response);
      response = "Oops! There seems to be an error. Please try again."
      res.say(response).shouldEndSession(false).send();
    });
  }
}
);

// AMAZON YES Intent
app.intent('AMAZON.YesIntent',
  function(req, res) {
    var intentSession = res.session('intentName');
    var mealTypeSession = res.session('mealType');
    var date = res.session('date');
    var prompt = "";
    var reprompt = ""

    if (intentSession == 'getMealTimings') {
      console.log('tag', mealTypeSession)
      console.log('date', date)
      var aa = QHubDataHelper.getEvents(mealTypeSession, date);

      return aa.then(function(results) {
        console.log('api response - ', results)
        if (results.success == 'true') {

          switch (mealTypeSession) {

            case 'breakfast':
            prompt = "For breakfest we have " + results.data[0].description;
            break;

            case 'lunch':
            prompt = "For Lunch we will be serving you " + results.data[0].description;
            break;

            case 'dinner':
            prompt = "For dinner we have " + results.data[0].description;
            break;

            default:
            prompt = 'I couldn\'t find any items on the menu.';
          }
          console.log('prompt:', prompt)
          reprompt = "What else would you like to know?"
          res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
          res.clearSession(true);
        } else {
          var prompt = 'I couldn\'t find any items on the menu. What else would you like to know?';
          res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
          res.clearSession(true);
        }
      }).catch(function(error) {
        prompt = "Oops! There seems to be an error. Please try again."
        console.log('❌ prompt during failure:', prompt);
        res.say(prompt).shouldEndSession(false).send();
      });
    }
  });

app.intent('AMAZON.HelpIntent',
  function(req, res) {
    var help = "";
    res.say(help).shouldEndSession(false); // Or let the user stop an action (but remain in the skill)
  });

app.intent('AMAZON.StopIntent',
  function(req, res) {
    var goodbye = "Had a nice time talking to you. Goodbye.";
    res.say(goodbye).shouldEndSession(true); // Or let the user stop an action (but remain in the skill)
  });

function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var today = yyyy + '-' + mm + '-' + dd;
  return today;
}

module.exports = app;
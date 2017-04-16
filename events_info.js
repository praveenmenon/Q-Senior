'use strict';
module.change_code = 1;
var rp = require('request-promise');
var ENDPOINT = 'http://test-hawa-api.qwinix.io/api/v1/events/events_by_date_alexa';

function QHubDataHelper() {}

QHubDataHelper.prototype.getEvents = function(tag, date) {
  var options = {
    method: 'POST',
    uri: ENDPOINT,
    body: {
      event: {
        tag: tag,
        date: date
      }
    },
    // resolveWithFullResponse: true,
    json: true
  };
  console.log(options)
  return rp(options);
};

QHubDataHelper.prototype.getUpcomingTagEvents = function(tag) {
  var options = {
    method: 'POST',
    uri: ENDPOINT,
    body: {
      event: {
        tag: tag
      }
    },
    // resolveWithFullResponse: true,
    json: true
  };
  console.log(options)
  return rp(options);
};

QHubDataHelper.prototype.getUpcomingTitleEvents = function(title) {
  var options = {
    method: 'POST',
    uri: ENDPOINT,
    body: {
      event: {
        title: title
      }
    },
    // resolveWithFullResponse: true,
    json: true
  };
  console.log(options)
  return rp(options);
};

module.exports = QHubDataHelper;
'use strict';
module.change_code = 1;
var rp = require('request-promise');
var ENDPOINT = 'http://test-hawa-api.qwinix.io/api/v1/events/events_by_date_alexa';
var RESERVATION_ENDPOINT = 'http://test-hawa-api.qwinix.io/api/v1/reservations/create_reservations';
var TASK_ENDPOINT = 'http://test-hawa-api.qwinix.io/api/v1/tasks/create_task';
var UPCOMING_TASK_ENDPOINT = 'http://test-hawa-api.qwinix.io/api/v1/tasks/upcoming_task';
var DATE_TASK_ENDPOINT = 'http://test-hawa-api.qwinix.io/api/v1/tasks/task_by_date/';
var TASK_STATUS_ENDPOINT = 'http://test-hawa-api.qwinix.io/api/v1/tasks/task_by_status/';
var TASK_STATUS_BY_NAME_ENDPOINT = 'http://test-hawa-api.qwinix.io/api/v1/tasks/task_by_name';

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
    json: true
  };
  console.log(options)
  return rp(options);
};

QHubDataHelper.prototype.createReservation = function(category, date, from_time, to_time) {
  var options = {
    method: 'POST',
    uri: RESERVATION_ENDPOINT,
    body: {
      reserve: {
        category: category,
        date: date,
        from_time: from_time,
        to_time: to_time
      }
    },
    json: true
  };
  console.log(options)
  return rp(options);
};

QHubDataHelper.prototype.createTask = function(category, date, from_time, to_time) {
  var options = {
    method: 'POST',
    uri: TASK_ENDPOINT,
    body: {
      task: {
        category: category,
        date: date,
        from_time: from_time,
        to_time: to_time
      }
    },
    json: true
  };
  console.log(options)
  return rp(options);
};

QHubDataHelper.prototype.TaskStatusByName = function(category, date) {
  var options = {
    method: 'POST',
    uri: TASK_STATUS_BY_NAME_ENDPOINT,
    body: {
      task: {
        category: category,
        date: date
      }
    },
    json: true
  };
  console.log(options)
  return rp(options);
};

QHubDataHelper.prototype.requestUpcomingTask = function(device_userID) {
  return this.getUpcomingTask().then(
    function(response) {
      console.log('GOT Upcoming task Details');
      return response.body;
    }
  );
};

QHubDataHelper.prototype.requestUpcomingTaskDate = function(date) {
  return this.getTaskStatusDate().then(
    function(response) {
      console.log('GOT Upcoming task based on date');
      return response.body;
    }
  );
};

QHubDataHelper.prototype.requestTaskStatus = function(status) {
  return this.getTaskStatus(status).then(
    function(response) {
      console.log('GOT task based on status');
      return response.body;
    }
  );
};

QHubDataHelper.prototype.getTaskStatus = function(status) {
  var options = {
    method: 'GET',
    uri: TASK_STATUS_ENDPOINT + status,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
};

QHubDataHelper.prototype.getUpcomingTask = function() {
  var options = {
    method: 'GET',
    uri: UPCOMING_TASK_ENDPOINT,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
};

QHubDataHelper.prototype.getTaskStatusDate = function(date) {
  var options = {
    method: 'GET',
    uri: DATE_TASK_ENDPOINT + date,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
};

module.exports = QHubDataHelper;

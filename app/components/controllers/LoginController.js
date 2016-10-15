// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('flo.login', ['ngRoute', 'datePicker'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/login', {
		controller: 'LoginController',
		templateUrl: 'components/views/loginView.html'
	});
}])

.controller('LoginController',['$scope', '$log', 'clientId', function($scope, $log, clientId) {

  var clientId = clientId;
  var scopes = 'https://www.googleapis.com/auth/calendar';

  function handleAuthResult(authResult) {
      console.log(authResult);
      var authorizeButton = document.getElementById('authorize-button');
      if (authResult && !authResult.error) {
          console.log(authResult);
          authorizeButton.style.visibility = 'hidden';
          makeApiCall();
      } else {
          authorizeButton.style.visibility = '';
          authorizeButton.onclick = handleAuthClick;
      }
  }

  $scope.handleAuthClick=function (event) {
      gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
      return false;
  }

  function makeApiCall() {
      gapi.client.load('calendar', 'v3', function() {
          var request = gapi.client.calendar.calendarList.list();
          request.execute(function(resp){
							console.log('resp', resp);
              $.each( resp.items, function( key, value ) {
                  // console.log(resp.items[key].id);
              });


							request.execute(function(resp) {
									var flo = resp.items.filter(function(item) {
										return item.summary === 'Flo';
									})

									console.log('flo', flo);
	            });
          });
          var request1 = gapi.client.calendar.events.list({
              'calendarId': 'primary',
              'timeMin': '2015-12-23T04:26:52.000Z'//Suppose that you want get data after 23 Dec 2014
           });
          request1.execute(function(resp){
              $.each( resp.items, function( key, value ) {
                  // console.log(resp.items[key].id);// here you give all events from google calendar
              });
          });
      });
  }

  $scope.createEvent = function() {

    var event = {
      'summary': 'Period #MyFlo',
      'location': 'Wherever I am',
      'description': 'bleeding all day',
      'start': {
        'dateTime': $scope.dates.minDate.format(),
      },
      'end': {
        'dateTime': $scope.dates.maxDate.format(),
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10}
        ]
      }
    };

    gapi.client.load('calendar', 'v3', function() {

			var request = gapi.client.calendar.calendarList.list();

			request.execute(function(resp){
				// Check if Flo is present, else create it
				var flo = resp.items.filter(function(item) {
					return item.summary === 'Flo';
				})
				if (flo.length === 0) {
					gapi.client.calendar.calendars.insert({
						summary: 'Flo'
					}).execute();
				}
			});

			var request = gapi.client.calendar.calendarList.list();
			request.execute(function(resp){
				// Check if Flo is present, else create it
				var floCal = resp.items.filter(function(item) {
					return item.summary === 'Flo';
				});

				var floId = floCal[0].id;

				var request = gapi.client.calendar.events.insert({
					'calendarId': floId,
					'resource': event
				});
				console.log('request', request);

				request.execute(function(event) {
					$('.event').append('Event created: ' + event.htmlLink);

					console.log('event', event);
				});

				});
    });
  }

	$scope.dates = {
		minDate: moment.tz().hour(12).startOf('h'), //12:00 User Timezone, today.
		maxDate: moment.tz().add(5, 'd').hour(12).startOf('h'), //12:00 User Timezone, in five days.
	};
	$scope.options = {
		view: 'date',
		format: 'lll',
		maxView: false,
		minView: 'hours',
	};

	$scope.formats = [
		 "MMMM YYYY",
		 "DD MMM YYYY",
		 "ddd MMM DD YYYY",
		 "D MMM YYYY HH:mm",
		 "lll",
	];

	$scope.views = ['year', 'month', 'date', 'hours', 'minutes'];
	
	$scope.callbackState = 'Callback: Not fired';

	$scope.changeDate = function (modelName, newDate) {
		console.log(modelName + ' has had a date change. New value is ' + newDate.format());
		$scope.callbackState = 'Callback: Fired';
	}

	$scope.changeData = function (type) {
		var values = {},
				pickersToUpdate = ['pickerRange'];
		switch (type) {
			case 'view':
				values.view = $scope.options.view;
				break;
			case 'minView':
				values.minView = $scope.options.minView;
				break;
			case 'maxView':
				values.maxView = $scope.options.maxView;
				break;
			case 'format':
				values.format = $scope.options.format;
				break;
		}
		if (values) {
			$scope.$broadcast('pickerUpdate', pickersToUpdate, values);
		}
	}


}]);

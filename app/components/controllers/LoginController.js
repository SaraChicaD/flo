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
                $.each( resp.items, function( key, value ) {
                    console.log(resp.items[key].id);
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




    $scope.createEvent=function () {

        var startDate = '2016-08-10T09:00:00-07:00';
        var endDate = '2016-08-16T09:00:00-07:00';

        //console.log('\n\ncreating event');
        var event = {
          'summary': 'Period #MyFlo',
          'location': 'Wherever I am',
          'description': 'My f-ing period',
          'start': {
            'dateTime': startDate,
            'timeZone': 'America/Chicago'
          },
          'end': {
            'dateTime': endDate,
            'timeZone': 'America/Chicago'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=1'
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        };

        gapi.client.load('calendar', 'v3', function() {

            var request = gapi.client.calendar.events.insert({
              'calendarId': 'primary',
              'resource': event
            });

            console.log('request', request);

            request.execute(function(event) {
              $('.event').append('Event created: ' + event.htmlLink);

              console.log('event', event);
            });

            console.log('created at the bottom ');
        });

    }



}]);

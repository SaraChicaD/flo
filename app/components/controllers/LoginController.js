// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('flo.login', ['ngRoute'])

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
           // authorizeButton.style.visibility = 'hidden';
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
                    console.log(resp.items[key].id);// here you give all events from google calendar
                });
            });
        });
    } 
 
}]);
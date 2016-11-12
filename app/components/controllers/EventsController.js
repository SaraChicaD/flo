'use strict';

angular.module('flo.events', ['ngRoute', 'datePicker'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/events', {
		controller: 'EventsController',
		templateUrl: 'components/views/eventsView.html'
	});
}])

// Controller definition for this module
.controller('EventsController',['$scope', '$log', 'clientId', function($scope, $log, clientId) {

//do we want to replicate the code in the LoginController for creating events
//or do we want to put it in the same controller with a different condition?


	$scope.dates = {
		minDate: moment.tz().hour(12).startOf('h'), //12:00 User Timezone, today.
		maxDate: moment.tz().add(5, 'd').hour(12).startOf('h'), //12:00 User Timezone, in five days.
	};
	$scope.options = {
		view: 'date',
		format: 'lll',
		maxView: false
		// ,
		// minView: 'hours',
	};

	$scope.formats = [
		 "MMMM YYYY",
		 "DD MMM YYYY",
		 "ddd MMM DD YYYY",
		 // "D MMM YYYY HH:mm",
		 "lll",
	];

	$scope.views = ['year', 'month', 'date'
	// , 
	// 'hours', 'minutes'
	];
	
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
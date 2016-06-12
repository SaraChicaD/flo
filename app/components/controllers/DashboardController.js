'use strict';

angular.module('flo.dashboard', ['ngRoute'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/', {
		controller: 'DashboardController',
		templateUrl: 'components/views/dashboardView.html'
	});
}])

// Controller definition for this module
.controller('DashboardController', ['$scope', function($scope) {

	// Just a housekeeping.
	// In the init method we are declaring all the
	// neccesarry settings and assignments to be run once
	// controller is invoked
	init();

	function init(){
	
	};

	this.message = "Hello Home!";

}]);
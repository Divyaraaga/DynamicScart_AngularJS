'use strict';

angular.module('salesUiApp').controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$modal', 'DataService',
function($rootScope, $scope, $location, $modal, DataService) {
	
	DataService.getVersion().then(function(resData) {
		console.table(resData);
		$scope.version = resData.version;
	});
	// $scope.config = {};
	// $scope.config.menu = DataService.getConfigStub().menu;
	// $scope.config.help = DataService.getConfig().help;
	// $scope.isCollapsed = true;
	//
	// $scope.$watch('mainFilter', function() {
	// $rootScope.mainFilter = $scope.mainFilter;
	// });
	//
	// $scope.isActive = function(route) {
	// if (route === $location.path() || route === '/' + $location.path().split('/')[1]) {
	// return true;
	// }
	//
	// };
	//
	// $scope.addOffer = function(type, obj) {
	// var modalInstance = $modal.open({
	// templateUrl : 'modules/offerModal/offerModal.html',
	// controller : 'OfferModalCtrl',
	// resolve : {
	// nodeObj : function() {
	// return obj;
	// },
	// entity : function() {
	// return type;
	// }
	// }
	// });
	// };

}]);

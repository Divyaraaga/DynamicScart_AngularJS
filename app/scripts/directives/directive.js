'use strict';

/**
 * @ngdoc directive
 * @name offerConfiguratorApp.directive:directive
 * @description
 * # directive
 */
angular.module('salesUiApp').directive('staticAttribute', ['$filter',
function($filter) {
	return {
		restrict : 'EA',
		replace : true,
		scope : true,
		templateUrl : 'scripts/directives/staticAttribute.html',
		link : function($scope, $element, $attribute) {
			$scope.rowList = [];
			$scope.hideList = [];
			$scope.addRow = function() {
				if ($scope.attrKey) {
					console.log("attr key index : " + $scope.rowList.indexOf($scope.attrKey));
					if ($scope.rowList.indexOf($scope.attrKey) == -1) {
						$scope.rowList.push($scope.attrKey);
					} else {
						console.log("Error attar : Need to show message that already attribute key exists");
					}
					$scope.attrKey = "";
				}
			};
			$scope.deleteRow = function(index) {
				//$scope.hideList[$scope.rowList[index]] = true;
				delete $scope.attributeData[$scope.rowList[index]];
				//console.log("Row index" + $scope.rowList[index]);
				$scope.rowList.splice(index, 1);
			};
		}
	};
}]);


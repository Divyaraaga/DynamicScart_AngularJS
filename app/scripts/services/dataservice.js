'use strict';

/**
 * @ngdoc service
 * @name salesUiApp.DataService
 * @description;
 * # DataService
 * Service in the salesUiApp.
 */
angular.module('salesUiApp').service('DataService', function($http, $q) {
	var contextPath = '/api/';
	var headers = {
		'X-Requested-With' : 'XMLHttpRequest'
	};

	headers['Content-Type'] = 'application/json';
	var sendData = function(data, entity) {
		var deferred = $q.defer();
		var url = contextPath + entity;
		//var url = action;
		$http({
			method : 'POST',
			url : url,
			headers : headers,
			data : data
		}).success(function(datas, status) {
			deferred.resolve(datas);
		}).error( function(err) {
			deferred.reject(err);
			console.log("Error:" + err);
		}.bind(this));
		return deferred.promise;
	};

	var getData = function(entity, action, success, error) {
		var deferred = $q.defer();
		var url = entity;
		$http({
			method : 'GET',
			url : url
		}).success(function(data, status) {
			deferred.resolve(data);
			//console.log("get Data :: " + angular.toJson(data));
		}).error( function(err) {
			deferred.reject(err);
			console.log("Error editing node");
		}.bind(this));
		return deferred.promise;
	};

	return {
		getSegmentMetaData : function() {
			return getData('scripts/JSONS/segmentMetadata.json');
		},
		getOffers : function(data) {
			//return sendData(data, 'validate/subscribers/3456456456fdfg/promotions');
			return getData('scripts/JSONS/getPromotions.json');
		},
		getVersion : function() {
			//return getData('management/info');
			return getData('scripts/JSONS/testVersion.json');
		}
	};
});


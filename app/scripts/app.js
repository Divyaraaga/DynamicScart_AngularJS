'use strict';

/**
 * @ngdoc overview
 * @name cijnewApp
 * @description
 * # cijnewApp
 *
 * Main module of the application.
 */
angular
  .module('salesUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch', 
    'ui.bootstrap',
    'ngLodash',
    'angular.filter'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'modules/offers/offers.html',
        controller: 'OffersCtrl'
      })
      .when('/offer', {
        templateUrl: 'modules/offers/offers.html',
        controller: 'OffersCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

/**
 * @ngdoc overview
 * @name uiGridApp
 * @description
 * # uiGridApp
 *
 * Main module of the application.
 */
angular
    .module('uiGridApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.grid',
        'ui.grid.resizeColumns',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.cellNav',
        'ui.grid.grouping',
        'addressFormatter'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/sorting', {
                templateUrl: 'views/sorting.html',
                controller: 'SortingCtrl',
                controllerAs: 'sorting'
            })
            .when('/filtering', {
                templateUrl: 'views/filtering.html',
                controller: 'FilteringCtrl',
                controllerAs: 'filtering'
            })
            .when('/editing', {
                templateUrl: 'views/editing.html',
                controller: 'EditingCtrl',
                controllerAs: 'editing'
            })
            .when('/demo', {
                templateUrl: 'views/demo.html',
                controller: 'DemoCtrl',
                controllerAs: 'demo'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .otherwise({
                redirectTo: '/'
            });
    });



angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        //Route for the home page
        .when('/', {
            templateUrl: 'app/views/pages/home.html',
            controller: 'homeController',
            controllerAs: 'home'
        })

        //Route for the leaderboard page
        .when('/leaderboard', {
            templateUrl: 'app/views/pages/leaderboard.html',
            controller: 'leaderboardController',
            controllerAs: 'leaderboard'
        })

        //Route for the play page
        .when('/play', {
            templateUrl: 'app/views/pages/play.html',
            controller: 'playController',
            controllerAs: 'play'
        })

        .when('/login', {
            templateUrl: 'app/views/pages/login.html',
            controller: 'loginController',
            controllerAs: 'login'
        });

    $locationProvider.html5Mode(true);
});
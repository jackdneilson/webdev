angular.module('coachio', [
    'app.routes',
    'authService',
    'userService',
    'leaderboardService',
    'socketService',
    'mainCtrl',
    'homeCtrl',
    'leaderboardCtrl',
    'playCtrl',

    'btford.socket-io'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInjector');
});
angular.module('coachio', [
    'app.routes',
    'authService',
    'userService',
    'leaderboardService',
    'mainCtrl'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInjector');
});
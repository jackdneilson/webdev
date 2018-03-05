angular.module('authModule', ['app.routes', 'authService'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInjector');
});
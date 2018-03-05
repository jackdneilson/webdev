angular.module('userService', [])

.factory('user', function($http) {
    var userFactory = {};

    userFactory.createUser = function(username, password) {
        return $http.post('/user', username, password);
    }
});
angular.module('userService', [])

.factory('User', function($http, AuthToken) {
    var userFactory = {};

    //Factory method to update user with exp gained
    userFactory.updateUser = function(expgained) {
        $http({
            url: '/api/user/update',
            method: 'POST',
            data: {
                experienceGained: expgained
            },
            headers: {'x-access-token': AuthToken.getToken()}
        }).catch(function(error) {
            return error;
        });
    };

    return userFactory;
});
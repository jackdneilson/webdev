angular.module('authService', [])

//Factory to handle login
.factory('Auth', function($http, $q, AuthToken) {
    var authFactory = {};

    authFactory.createAccount = function(username, password) {
        return $http.post('/api/user/new', {
            username: username,
            password: password
        })
            .then(function(data) {
                return {success: true}
            })
            .catch(function(reason) {
                return {
                    success: false,
                    reason: reason};
            });
    };

    authFactory.login = function(username, password) {
        return $http.post('/api/authenticate', {
            username: username,
            password: password
        })
            .then(function(data) {
                AuthToken.setToken(data.data.token);
                return data;
            })
            .catch(function(reason) {
                return {
                    success: false,
                    reason: reason};
            });
    };

    authFactory.getUser = function() {
        return $http.get('/api/user')
            .then(function(data) {
                return data;
            });
    };

    authFactory.logout = function() {
        AuthToken.setToken();
    };

    authFactory.isLoggedIn = function() {
        if (AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    return authFactory;
})

//Factory to handle tokens
.factory('AuthToken', function($window) {
    var authTokenFactory = {};

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    authTokenFactory.setToken = function(token) {
        if (token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    };

    return authTokenFactory;
})

//Factory to inject tokens into every request
.factory('AuthInjector', function($q, $location, AuthToken) {
    var injectorFactory = {};

    injectorFactory.request = function(config) {
        var token = AuthToken.getToken();

        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    };

    injectorFactory.responseError = function(response) {
        if (response.status === 403) {
            AuthToken.setToken();
            $location.path('/login');
        }

        return $q.reject(response);
    };

    return injectorFactory;
});
angular.module('mainCtrl', ['app.routes'])

.controller('mainController', function($rootScope, $location, Auth) {
    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function() {
        vm.loggedIn = Auth.isLoggedIn();

        Auth.getUser()
            .then(function(response) {
                vm.user = response.data;
            })
            .catch(function(reason) {
                vm.error = reason;
            });
    });

    vm.doLogin = function() {
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .then(function(data) {
                if (data.data.success) {
                    $location.path('/play');
                } else {
                    vm.error = data;
                }
            })
            .catch(function(reason) {
                vm.error = reason;
            });
    };

    vm.doLogout = function() {
        Auth.logout();

        vm.user = {};

        $location.path('/');
    };
});
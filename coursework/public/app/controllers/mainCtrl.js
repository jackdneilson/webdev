angular.module('mainCtrl', ['app.routes'])

.controller('mainController', function($rootScope, $location, Auth) {
    var vm = this;

    //Switch to display elements if user is logged in
    vm.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function() {
        vm.loggedIn = Auth.isLoggedIn();
    });

    //Function called when login form submitted
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

    //Function to logout user, called when logout button pressed
    vm.doLogout = function() {
        Auth.logout();

        vm.user = {};

        $location.path('/');
    };

    //Function to create account
    vm.createAccount = function() {
        vm.error = '';

        Auth.createAccount(vm.loginData.username, vm.loginData.password)
            .then(function(data) {
            if (data.success) {
                Auth.login(vm.loginData.username, vm.loginData.password)
                    .then(function(data) {
                        if (data.data.success) {
                            vm.loggedIn = true;
                            $location.path('/play');
                        }
                    });
            }
        });
    }
});
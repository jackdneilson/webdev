angular.module('mainCtrl', ['app.routes'])

.controller('mainController', function($rootScope, $location, Auth) {
    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function() {
        vm.loggedIn = Auth.isLoggedIn();

        Auth.getUser()
            .then(function(response) {
                vm.user = response.data;
            });
    });

    vm.doLogin = function() {
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .then(function(data) {
                if (data.success) {
                    $location.path('/');
                } else {
                    vm.error = data;
                }
            });
    };

    vm.doLogout = function() {
        Auth.logout();

        vm.user = {};

        $location.path('/');
    };
})

.controller('homeController', function() {
    var vm = this;

    vm.welcomeMessage = 'Welcome to Coach.io!'
})

.controller('leaderboardController', function($http) {
    var vm = this;

    $http.get('/leaderboard')
        .then(function(data) {
            vm.users = data.users;
        });
})

.controller('playController', function() {
    var vm = this;
})

.controller('loginController', function() {
    var vm = this;
});
angular.module('coachio', ['appRoutes'])

.controller('mainController', function() {
    var vm = this;
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
});
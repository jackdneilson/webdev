angular.module('leaderboardCtrl', ['app.routes', 'leaderboardService'])
    .controller('leaderboardController', function(Leaderboard) {
        var vm = this;

    Leaderboard.get()
        .then(function(response) {
            vm.users = response.data;
        })
        .catch(function(reason) {
            vm.error = reason;
        });
    });
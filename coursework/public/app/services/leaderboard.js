angular.module('leaderboardService', [])

.factory('Leaderboard', function($http) {
    var leaderboardFactory = {};
    leaderboardFactory.get = function() {
        return $http.get('/api/leaderboard');
    };

    return leaderboardFactory;
});
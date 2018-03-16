angular.module('socketService', ['btford.socket-io'])
    .factory('Socket', function(socketFactory) {
        return socketFactory();
    });

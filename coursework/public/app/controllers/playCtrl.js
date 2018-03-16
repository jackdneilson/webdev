angular.module('playCtrl', ['app.routes'])
    .controller('playController', function(Socket) {
        var vm = this;

        vm.gameState = {};

        vm.sendMessage = function() {
            Socket.emit('send message', 'val');
        };

        Socket.on('new message', function(data) {
            vm.gameState = data;
        });
    });
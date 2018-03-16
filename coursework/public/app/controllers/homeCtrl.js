angular.module('homeCtrl', ['app.routes'])
    .controller('homeController', function() {
        var vm = this;

        vm.welcomeMessage = 'Welcome to Coach.io!'
    });
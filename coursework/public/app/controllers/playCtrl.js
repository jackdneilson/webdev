angular.module('playCtrl', ['app.routes'])
    .controller('playController', function(Socket) {
        var vm = this;

        vm.gameState = {};
        vm.beginClicked = false;

        //TODO: Find a way to disable buttons
        vm.choice1_disabled = false;
        vm.choice2_disabled = false;
        vm.choice3_disabled = false;
        vm.choice4_disabled = false;


        vm.beginClick = function() {
            vm.beginClicked = true;
            vm.gameState = {
                turn: 1,
                jungle_camps_redside: "6",
                jungle_camps_blueside: "6",
                health: 100,
                mana: 100,
                exp: 0,
                level: 1,
                q_rank: 0,
                w_rank: 0,
                e_rank: 0,
                r_rank: 0
            };
        };

        vm.sendMessage = function() {
            Socket.emit('send message', 'val');
        };

        vm.clearBlueCamp = function() {
            vm.gameState.turn++;
            vm.gameState.jungle_camps_blueside--;
            vm.gameState.health -= 30;
            vm.gameState.mana -= 10;

            vm.gameState.exp += Math.log(vm.gameState.level) * 50;
            checkExp();
        };

        vm.clearRedCamp = function() {
            vm.gameState.turn++;
            vm.gameState.jungle_camps_redside--;
            vm.gameState.health -= 20;
            vm.gameState.mana -= 20;

            vm.gameState.exp += Math.log(vm.gameState.level) * 50;
            checkExp();
        };

        Socket.on('new message', function(data) {
            vm.gameState = data;
        });

        function checkExp() {
            //TODO: Implement
        }

        function randomEvent() {
            //TODO: Implement random events (invades, dragon attempts, friendly / enemy kills)
        }
    });
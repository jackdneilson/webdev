angular.module('playCtrl', ['app.routes', 'userService'])
    .controller('playController', function(Socket, Auth, User) {
        var vm = this;

        vm.gameState = {};
        vm.gameMessage = "Welcome to League of Legends!";
        vm.history = [];
        vm.beginClicked = false;
        vm.showResults = false;

        vm.choice1_disabled = false;
        vm.choice2_disabled = false;
        vm.choice3_disabled = false;
        vm.choice4_disabled = false;

        vm.messages = [];

        vm.sendMessage = function() {
            Auth.getUser()
                .then(function(resp) {
                    Socket.emit('send message', {username: resp.data.username, content: vm.messageContent});
                });
        };

        Socket.on('new message', function(data) {
            vm.messages.push(data);
        });


        vm.beginClick = function() {
            vm.beginClicked = true;
            vm.showResults = false;
            vm.history = [];
            vm.gameState = {
                turn: 1,
                jungle_camps_redside: 3,
                jungle_camps_blueside: 3,
                health: 550,
                exp: 0,
                level: 0,
                q_rank: 0,
                w_rank: 0,
                e_rank: 0,
                r_rank: 0,
                gold: 0
            };

            vm.options = levelUp();
        };

        vm.choice1_clicked = function() {
            updateGameState(vm.choice1);
        };

        vm.choice2_clicked = function() {
            updateGameState(vm.choice2);
        };

        vm.choice3_clicked = function() {
            updateGameState(vm.choice3);
        };

        vm.choice4_clicked = function() {
            updateGameState(vm.choice4);
        };

        function updateGameState(choice) {
            vm.gameState.turn++;

            if (vm.gameState.turn % 3 === 0 && vm.gameState.jungle_camps_blueside < 3) {
                vm.gameState.jungle_camps_blueside ++;
            }

            if (vm.gameState.turn % 3 === 0 && vm.gameState.jungle_camps_redside < 3) {
                vm.gameState.jungle_camps_redside ++;
            }

            var random = Math.random();
            switch(choice) {
                case "Level Q":
                    vm.gameState.q_rank += 1;
                    vm.gameState.level++;
                    vm.history.push("You rank up Q.");
                    break;
                case "Level W":
                    vm.gameState.w_rank += 1;
                    vm.gameState.level++;
                    vm.history.push("You rank up W.");
                    break;
                case "Level E":
                    vm.gameState.e_rank += 1;
                    vm.gameState.level++;
                    vm.history.push("You rank up E.");
                    break;
                case "Level R":
                    vm.gameState.r_rank += 1;
                    vm.gameState.level++;
                    vm.history.push("You rank up R.");
                    break;

                case "Take Red":
                    vm.history.push("You take a red side camp.");
                    clearRedCamp();
                    break;

                case "Take Blue":
                    vm.history.push("You take a blue side camp.");
                    clearBlueCamp();
                    break;

                case "Contest":
                    if (random < 0.3) {
                        vm.gameState.health -= 10;
                        vm.history.push("You fail to contest the camp, and are left with nothing to show for it.");
                    } else {
                        vm.gameState.health -= 10;
                        vm.gameState.exp += 340;
                        vm.gameState.gold += 90;
                        vm.history.push("You successfully contest the camp.");
                    }
                    break;

                case "Skirmish":
                    if (random < 0.1) {
                        vm.gameState.health -= 550;
                    } else if (random < 0.5) {
                        vm.gameState.health -= 200;
                        vm.history.push("You are out-dueled by the enemy jungler, but manage to escape.");
                    } else {
                        vm.gameState.health -= 50;
                        vm.history.push("You manage to kill the enemy jungler!");
                        vm.gameState.exp += 600;
                        vm.gameState.gold += 300;
                    }
                    break;

                case "Retreat":
                    vm.history.push("You retreat with your life intact, but the enemy jungler steals your camp.");
                    break;

                case "Take Tower":
                    if (random < 0.3) {
                        vm.gameState.health -= 50;
                        vm.history.push("You fail to take the tower, and are lucky to escape with your life.");
                    } else {
                        vm.gameState.gold += 1250;
                        vm.history.push("You successfully take the tower!");
                    }
                    break;

                case "Dive":
                    if (random < 0.1) {
                        vm.gameState.health -= 550;
                    } else if (random < 0.4) {
                        vm.gameState.health -= 200;
                        vm.history.push("The dive fails, and you run away tail between your legs.");
                    } else {
                        vm.gameState.health -= 50;
                        vm.history.push("You manage to kill the enemy and take the tower!");
                        vm.gameState.exp += 600;
                        vm.gameState.gold += 1650;
                    }
                    break;

                case "Reset":
                    vm.history.push("You take an advantageous back timing, choosing not to attack the tower.");
                    break;

                case "Help Them":
                    if (random < 0.1) {
                        vm.gameState.health -= 550;
                    } else if (random < 0.4) {
                        vm.gameState.health -= 150;
                        vm.history.push("The other team pushes you off, and you don't kill the dragon.");
                    } else {
                        vm.gameState.health -= 50;
                        vm.history.push("You manage to kill the dragon!");
                        vm.gameState.exp += 100;
                        vm.gameState.gold += 2250;
                    }
                    break;

                case "Turn and Fight":
                    if (random < 0.6) {
                        vm.gameState.health -= 550;
                    } else {
                        vm.history.push("You manage to kill the enemy team, then turn and take the dragon!");
                        vm.gameState.exp += 1500;
                        vm.gameState.gold += 4500;
                    }
                    break;

                case "Concede":
                    vm.history.push("The enemy team takes the dragon, and puts you at a deficit");
                    vm.gameState.gold -= 500;
                    break;

                case "Pass":
                    vm.history.push("You wait.");
                    break;
            }

            //Move on to next set of options - farm, random event or level up if xp has crossed threshold.
            farm();
            randomEvent();
            checkExp();

            if (vm.gameState.health <= 0) {
                vm.showResults = true;
            } else if (vm.gameState.turn > 3) {
                vm.showResults = true;
                vm.error = User.updateUser(vm.gameState.gold);
                User.updateUser(vm.gameState.gold);
            }
        }

        function checkExp() {
            if (vm.gameState.exp > 1000 && vm.gameState.level <= 18) {
                vm.gameState.exp -= 1000;
                levelUp();
            }
        }

        function randomEvent() {
            var rand = Math.random();
            if (rand < 0.7) return;
            if (rand < 0.8) {
                invade();
            } else if (rand < 0.9) {
                tower();
            } else {
                dragon();
            }
        }

        //States for game to be in (level up, farm, etc.)
        function levelUp() {
            enableOptions();

            vm.choice1 = "Level Q";
            vm.choice2 = "Level W";
            vm.choice3 = "Level E";
            vm.choice4 = "level R";

            vm.gameMessage = "What skill would you like to level up?";

            if (vm.gameState.q_rank > 4) {
                vm.choice1_disabled = true;
            }
            if (vm.gameState.w_rank === 5) {
                vm.choice2_disabled = true;
            }
            if (vm.gameState.e_rank === 5) {
                vm.choice3_disabled = true;
            }
            if (vm.gameState.r_rank === 3) {
                vm.choice4_disabled = true;
            }
            if (vm.gameState.level < 6) {
                vm.choice4_disabled = true;
            }
        }

        function farm() {
            enableOptions();

            vm.gameMessage = "What side of the map would you like to farm?";

            vm.choice1 = "Take Red";
            vm.choice2 = "Take Blue";
            vm.choice3 = "";
            vm.choice4 = "Pass";


            if (vm.gameState.jungle_camps_redside <= 0) {
                vm.choice1_disabled = true;
            }
            if (vm.gameState.jungle_camps_blueside <= 0) {
                vm.choice2_disabled = true;
            }

            vm.choice3_disabled = true;
            vm.choice4_disabled = true;

        }

        function invade() {
            enableOptions();

            vm.gameMessage = "You have been invaded by the enemy jungler! What would you like to do?";

            vm.choice1 = "Contest";
            vm.choice2 = "Skirmish";
            vm.choice3 = "Retreat";
            vm.choice4 = "";

            vm.choice4_disabled = true;
        }

        function tower() {
            enableOptions();

            vm.gameMessage = "You have pushed the enemy under tower, and have an opportunity to make a play.";

            vm.choice1 = "Take Tower";
            vm.choice2 = "Dive";
            vm.choice3 = "Reset";
            vm.choice4 = "";

            vm.choice4_disabled = true;
        }

        function dragon() {
            enableOptions();

            vm.gameMessage = "Your team are contesting the Dragon!";

            vm.choice1 = "Help Them";
            vm.choice2 = "Turn and Fight";
            vm.choice3 = "Concede";
            vm.choice4 = "";

            vm.choice4_disabled = true;

        }

        //Helper functions to keep code tidy
        function clearBlueCamp() {
            vm.gameState.jungle_camps_blueside--;
            vm.gameState.health -= 30;
            vm.gameState.gold += 100;
            vm.gameState.exp += 370;
        }

        function clearRedCamp() {
            vm.gameState.jungle_camps_redside--;
            vm.gameState.health -= 20;
            vm.gameState.gold += 70;
            vm.gameState.exp += 360;
        }

        function enableOptions() {
            vm.choice1_disabled = false;
            vm.choice2_disabled = false;
            vm.choice3_disabled = false;
            vm.choice4_disabled = false;
        }
    });
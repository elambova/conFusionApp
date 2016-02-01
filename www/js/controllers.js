/* global CameraPopoverOptions, Camera */

"use strict'";

var app = angular.module('conFusion.controllers', []);

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout,
        $localStorage, $ionicLoading, $ionicPlatform, $cordovaCamera) {
    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.reservation = {};
    $scope.registration = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.loginModal = modal;
    });

    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.reserveModal = modal;
    });

    // Create the register modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerModal = modal;
    });

    // Open the login modal
    $scope.login = function () {
        $scope.loginModal.show();
    };

    // Open the reserve modal
    $scope.reserve = function () {
        $scope.reserveModal.show();
    };

    // Open the register modal
    $scope.register = function () {
        $scope.registerModal.show();
    };

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.loginModal.hide();
    };

    // Triggered in the login modal to close it
    $scope.closeReserve = function () {
        $scope.reserveModal.hide();
    };

    // Triggered in the register modal to close it
    $scope.closeRegister = function () {
        $scope.registerModal.hide();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-energized"></ion-spinner> Login...'
        });
        $localStorage.storeObject('userinfo', $scope.loginData);
        $timeout(function () {
            $ionicLoading.hide();
            $scope.closeLogin();
        }, 2000);
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-energized"></ion-spinner> Reserving...'
        });
        $timeout(function () {
            $ionicLoading.hide();
            $scope.closeReserve();
        }, 2000);
    };

    // Perform the register action when the user submits the register form
    $scope.doRegister = function () {
        $timeout(function () {
            $scope.closeRegister();
        }, 2000);
    };
    $ionicPlatform.ready(function () {

        $scope.takePicture = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options)
                    .then(function (imageData) {
                        $scope.registration.imgSrc = 'data:image/jpeg;base64' + imageData;
                    }, function (error) {
                        console.log(error);
                    });
            $scope.registerModal.show();
        };
        $scope.choosePhoto = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options)
                    .then(function (imageData) {
                        $scope.registration.imgSrc = 'data:image/jpeg;base64' + imageData;
                    }, function (error) {
                        console.log(error);
                    });
            $scope.registerModal.show();
        };
    });
});

app.controller('DishDetailController', function ($scope, dish, baseURL,
        menuFactory, $ionicPopover, $ionicModal, $ionicLoading, favoriteFactory,
        $timeout, $localStorage, $ionicPlatform, $cordovaLocalNotification,
        $cordovaToast) {
//    $scope.showDish = false;
//    $scope.message = "Loading ...";
    $scope.baseURL = baseURL;
    $scope.dish = dish;
    $scope.newComment = $localStorage.getObject('commentinfo', '{}');

    // Create the dish-detail popover
    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    // Create the dish-comment modal
    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Open the dish-detail popover
    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };

    // Open the dish-cooment modal
    $scope.comment = function () {
        $scope.modal.show();
    };

    // Triggered in the dish-detail popover to close it
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    // Triggered in the dish-comment modal to close it
    $scope.closeComment = function () {
        $scope.modal.hide();
    };

    // Perform the comment action when the user submits the comment form
    $scope.doComment = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-energized"></ion-spinner> Sending...'
        });
        $localStorage.storeObject('commentinfo', $scope.newComment);
        $scope.newComment.date = new Date().toISOString();
        $scope.dish.comments.push($scope.newComment);
        menuFactory.update({id: $scope.dish.id}, $scope.dish);
        $timeout(function () {
            $ionicLoading.hide();
            $scope.close();
        }, 2000);
    };

    // Add the selected dish to 'My favorite' page 
    $scope.addFavorite = function () {
        favoriteFactory.addToFavorites($scope.dish.id);
        $scope.closePopover();
        $ionicPlatform.ready(function () {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: 'Added Favorite',
                text: $scope.dish.name
            }).then(function () {
                console.log('Added Favorite ' + $scope.dish.name);
            }, function () {
                console.log('Failed to add Favorite ');
            });
            $cordovaToast.show('Added Favorite ' + $scope.dish.name, 'long', 'bottom')
                    .then(function (success) {
                        console.log(success);
                    }, function (error) {
                        console.log(error);
                    });
        });
    };
});

app.controller('FavoritesController', function ($scope, favorites,
        dishes, favoriteFactory, baseURL, $ionicPopup,
        $ionicLoading, $cordovaVibration) {
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.favorites = favorites;
    $scope.dishes = dishes;

    // Show ionic loading Spinner
    $ionicLoading.show({
        template: '<ion-spinner class="spinner-energized"></ion-spinner> Loading...'
    });

    // Toggle button that displays the delete button
    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
    };

    // Delete from 'My Favorite' page
    $scope.deleteFavorite = function (index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                $cordovaVibration.vibrate(100);
                favoriteFactory.deleteFromFavorites(index);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;
    };
});

app.controller('MenuController', function ($scope, dishes, favoriteFactory,
        baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification,
        $cordovaToast) {
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.dishes = dishes;
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    // Shows which tab is select 
    $scope.select = function (setTab) {
        $scope.tab = setTab;
        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    // Shows which is selected tab
    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };


    // Toggle wrere details show or hide 
    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    // Add the selected dish to 'My favorite' page 
    $scope.addFavorite = function (index) {
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
        $ionicPlatform.ready(function () {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: 'Added Favorite',
                text: $scope.dishes[index].name
            }).then(function () {
                console.log('Added Favorite ' + $scope.dishes[index].name);
            }, function () {
                console.log('Failed to add Favorite ');
            });
            $cordovaToast.show('Added Favorite ' + $scope.dishes[index].name, 'long', 'top')
                    .then(function (success) {

                    }, function (error) {

                    });
        });
    };
});

app.controller('DishCommentController', function ($scope, menuFactory) {

    $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

    $scope.submitComment = function () {

        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);

        $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id: $scope.dish.id}, $scope.dish);

        $scope.commentForm.$setPristine();

        $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
    };
});

app.controller('IndexController', function ($scope, dish, promotion, leader, baseURL) {
    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.leader = leader;
    $scope.dish = dish;
    $scope.promotion = promotion;

});

app.controller('AboutController', function ($scope, leaders, baseURL) {
    $scope.baseURL = baseURL;
    $scope.leaders = leaders;
});

app.controller('ContactController', function ($scope) {

    $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

    var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

});

app.controller('FeedbackController', function ($scope, feedbackFactory) {
    // Send feedback
    $scope.sendFeedback = function () {
        if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
            $scope.invalidChannelSelection = true;
            alert('incorrect');
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
});

app.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;
    };
});

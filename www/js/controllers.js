"use strict'";

var app = angular.module('conFusion.controllers', []);

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.reservation = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.loginModal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeReserve = function () {
        $scope.reserveModal.hide();
    };

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.loginModal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.loginModal.show();
    };

//     Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.reserveModal = modal;
    });

    // Open the reserve modal
    $scope.reserve = function () {
        $scope.reserveModal.show();
    };
    
    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo', $scope.loginData);
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function () {
        $timeout(function () {
            $scope.closeReserve();
        }, 1000);
    }
    ;
});

app.controller('MenuController', function ($scope, dishes, favoriteFactory,
        baseURL, $ionicListDelegate) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    $scope.dishes = dishes;

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

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };
    $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
    };
});

app.controller('ContactController', function ($scope) {

    $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

    var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

});

app.controller('FeedbackController', function ($scope, feedbackFactory) {

    $scope.sendFeedback = function () {

        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
});

app.controller('DishDetailController', function ($scope, dish, baseURL,
        menuFactory, $ionicPopover, $ionicModal, $ionicLoading, favoriteFactory,
        $ionicListDelegate, $timeout) {

    $scope.baseURL = baseURL;
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.newComment = {};

    $scope.dish = dish;

    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };

    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.close = function () {
        $scope.modal.hide();
    };

    $scope.comment = function () {
        $scope.modal.show();
    };

    $scope.doComment = function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Sending...'
        });
        $scope.newComment.date = new Date().toISOString();
        $scope.dish.comments.push($scope.newComment);
        menuFactory.update({id: $scope.dish.id}, $scope.dish);
        $timeout(function () {
            $ionicLoading.hide();
            $scope.close();
        }, 1000);
    };

    $scope.addFavorite = function () {
        favoriteFactory.addToFavorites($scope.dish.id);
        $ionicListDelegate.closeOptionButtons();
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

app.controller('IndexController', function ($scope, dish, promotion,
        baseURL, corporate) {

    $scope.baseURL = baseURL;
    $scope.leader = corporate;
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.dish = dish;
    $scope.promotion = promotion;

});

app.controller('AboutController', function ($scope, corporateFactory,
        baseURL) {

    $scope.baseURL = baseURL;
    $scope.leaders = corporateFactory.query();
    console.log($scope.leaders);

});

app.controller('FavoritesController', function ($scope, favorites,
        dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup,
        $ionicLoading) {
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
    });

    $scope.favorites = favorites;

    $scope.dishes = dishes;

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
    };

    $scope.deleteFavorite = function (index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;
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
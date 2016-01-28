"use strict";

var services = angular.module('conFusion.services', ['ngResource']);

services.constant("baseURL", "http://192.168.0.100:3000/");

services.factory('menuFactory', function ($resource, baseURL) {
    return $resource(baseURL + "dishes/:id", null, {
        'update': {
            method: 'PUT'
        }
    });
});

services.factory('promotionFactory', function ($resource, baseURL) {
    return $resource(baseURL + "promotions/:id");

});

services.factory('corporateFactory', function ($resource, baseURL) {
    return $resource(baseURL + "leadership/:id");
});

services.factory('feedbackFactory', function ($resource, baseURL) {
    return $resource(baseURL + "feedback/:id");
});

services.factory('favoriteFactory', function ($localStorage) {
    var favoriteFactory = {};
    var favorites = $localStorage.getObject('favorites', '[]');

    favoriteFactory.addToFavorites = function (index) {
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].id === index) {
                return;
            }
        }

        favorites.push({id: index});
        $localStorage.storeObject('favorites', favorites);
    };

    favoriteFactory.deleteFromFavorites = function (index) {
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].id === index) {
                favorites.splice(i, 1);
                $localStorage.storeObject('favorites', favorites);
            }
        }
        ;
    };

    favoriteFactory.getFavorites = function () {
        return favorites;
    };

    return favoriteFactory;
});

services.factory('$localStorage', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
});

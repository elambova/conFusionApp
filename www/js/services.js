"use strict";

var services = angular.module('conFusion.services', ['ngResource']);

services.constant("baseURL", "http://192.168.0.100:3000/");

services.service('menuFactory', function ($resource, baseURL) {
    return $resource(baseURL + "dishes/:id", null, {
        'update': {
            method: 'PUT'
        }
    });
});

services.service('promotionFactory', function ($resource, baseURL) {
    return $resource(baseURL + "promotions/:id");

});

services.service('corporateFactory', function ($resource, baseURL) {
    return $resource(baseURL + "leadership/:id");
});

services.service('feedbackFactory', function ($resource, baseURL) {
    return $resource(baseURL + "feedback/:id");
});

services.service('favoriteFactory', function ($resource, baseURL) {
    var favoriteFactory = {};
    var favorites = [];

    favoriteFactory.addToFavorites = function (index) {
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].id === index) {
                return;
            }
        }
        favorites.push({id: index});
    };

    favoriteFactory.deleteFromFavorites = function (index) {
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].id === index) {
                favorites.splice(i, 1);
            }
        }
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

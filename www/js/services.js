"use strict";

var services = angular.module('conFusion.services', ['ngResource']);

services.constant("baseURL", "http://192.168.0.100:3000/");

services.service('menuFactory', function ($resource, baseURL) {
    var promotions = [
        {
            _id: 0,
            name: 'Weekend Grand Buffet',
            image: 'images/buffet.png',
            label: 'New',
            price: '19.99',
            description: 'Featuring mouthwatering combinations with a choice of five different salads, six enticing appetizers, six main entrees and five choicest desserts. Free flowing bubbly and soft drinks. All for just $19.99 per person '
        }
    ];

    this.getDishes = function () {
        return $resource(baseURL + "dishes/:id", null, {'update': {method: 'PUT'}});
    };

    // implement a function named getPromotion
    // that returns a selected promotion.
    this.getPromotion = function () {
        return $resource(baseURL + "promotions/:id");
    };
});

services.factory('corporateFactory', function ($resource, baseURL) {
    return $resource(baseURL + "leadership/:id");
});

services.factory('feedbackFactory', function ($resource, baseURL) {
    return $resource(baseURL + "feedback/:id");
});

services.factory('favoriteFactory', function ($resource, baseURL) {
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

    favoriteFactory.getFavorites = function () {
        return favorites;
    };

    favoriteFactory.deleteFromFavorites = function (index) {
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].id === index) {
                favorites.splice(i, 1);
            }
        }
    };
    return favoriteFactory;
});


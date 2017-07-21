var app = angular.module("luxa", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'home.html',
        controller: 'home'
    });
});

app.controller("nav", function($scope, $location) {
    $scope.tasks = ['Feed', 'Friends', 'Profile', 'Cart'];
});

app.controller("home", function($scope) {

});
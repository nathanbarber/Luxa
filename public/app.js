var app = angular.module("luxa", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'home.html',
        controller: 'home'
    })
    .when('/friends', {
        templateUrl: 'wip.html'
    })
    .when('/profile', {
        templateUrl: 'profile.html',
        controller: 'profile'
    })
    .when('/cart', {
        templateUrl: 'wip.html'
    });
});

app.controller("nav", function($scope, $location) {
    $scope.tasks = ['Feed', 'Friends', 'Profile', 'Cart'];
    $scope.to = function(data) {
        if(data == "feed") {
            $location.path("/");
            return;
        }
        $location.path(data);
    };
});

app.controller("home", function($scope) {
    $scope.dummyData = [
        {
            head: "one",
            body: "First item listed by Michael Sera. Vanilla cookies arent gay, not if Michael Sera makes them"
        },
        {
            head: "two",
            body: "Second item listed by Seth Rogen. Sometimes big guys need love too, get Seths giant inflatable whale"
        },
        {
            head: "three",
            body: "Third item listed by Emma Stone. Get this fat, gross, nasty hotdog"
        }
    ];
});

app.controller('profile', function($scope) {
    $scope.user = undefined;
    $scope.defaultImg = (function() {
        var img = new Image();
        img.src = "img/cookie.gif";
        img.className = 'img';
        return img;
    })();
    $scope.dummyuser = {
        name: "Nathan Barber",
        profile: new Image(),
        description: "I like making raspberry pi",
        status: 'seller',
        storeItems: [
            ['raspberry pi', $scope.defaultImg],
            ['blueberry pi', $scope.defaultImg]
        ]
    };
    $scope.renderUserProfile = function() {
        $('.userhead .name').text($scope.user.name);
        $('.userhead .img').css('background-image', 'img/cookie.gif');
        $('.userbody .description').text($scope.user.description);
        $('.userbody .status').text($scope.user.status.toUpperCase());
        /*for(var i = 0; i < $scope.dummyuser.storeItems.length; i++) {
            $('.userstore').append("<div class='item'></div>");
            $('.userstore .item').append($scope.dummyuser.storeItems[i][1]);
            $('.userstore .name').append($scope.dummyuser.storeItems[i][0]);
            console.log(i);
        }*/
        $('.user').css('display', 'initial');
    };
    (function() {
        if($scope.user == undefined) {
            //Request login, but for now dummydata
            $scope.user = $scope.dummyuser;
            //Callback for real server/login usage later
            $scope.renderUserProfile();
        }
    })();
});
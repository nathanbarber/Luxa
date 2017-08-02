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
    })
    .when('/signup', {
        templateUrl: 'signup.html',
        controller: 'signup'
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

app.controller('profile', function($scope, $location) {
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
    };
    $scope.login = function() {
        var loginSuccess;
        if(true) {
            loginSuccess = true;
        } else {
            loginSuccess = false;
        }
        if(loginSuccess) {
            $('.login').animate({
                opacity: 0
            }, 300);
            //Set user to dummy user for testing
            setTimeout(function() {
                $scope.user = $scope.dummyuser;
                $scope.renderUserProfile();
                $('.login').css('display', 'none');
                $('.user').animate({
                    opacity: 1
                }, 300);
            }, 300);
        }
    };
    $scope.signUp = function() {
        $location.path("signup");
    };
});

app.controller('signup', function($scope, $http) {
    (function responsiveImageInput() {
        function readURL(input) {
            if(input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $('.fill').attr('src', e.target.result);
                    $userImage = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                console.log("read failed");
            }
        }
        $('input:file').change(function() {
            readURL(this);
        });
    })();

    $scope.submitNewUser = function() {
        var data = new FormData();
        var image = $('.profilePic')[0].files[0];
        var userTokens = {
            fullName: $('.name').val(),
            username: $('.username').val(),
            password: $('.password').val(),
        };
        for(var i in userTokens) {
            data.append(i, userTokens[i]);
        }
        data.append("pic", image);

        $.ajax({
            url: '/submitNewUser',
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                alert(data);
            }
        });
    };
});
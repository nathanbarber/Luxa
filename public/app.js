var app = angular.module("luxa", ["ngRoute"]);
app.config(function($routeProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
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

app.controller('profile', function($scope, $location, $http) {
    $scope.user = {
        name: undefined,
        id: undefined,
        profile: undefined,
        bio: undefined,
        status: undefined,
        storeItems: []
    };
    $scope.renderUserProfile = function() {
        $('.userhead .name').text($scope.user.name);
        /*$('.userhead .img').css({
            background: "url('" +  + "') center no-repeat",
            backgroundSize: "cover" 
        });*/
        $('.userbody .description').text($scope.user.description);
        $('.userbody .status').text($scope.user.status.toUpperCase());
    };
    $scope.login = function() {
        var keys = {
            username: $('.username').val(),
            password: $('.password').val()
        };
        $http({
            url: '/login',
            params: keys,
            method: "GET",
        })
        .then(function(data) {
            callback(data);
        },
        function() {
            console.log("error");
        });
        function callback(res) {
            var data = res.data;
            console.log(data);
            if(data.success == true) {
                console.log("data succeeded");
                $scope.user.name = data.name;
                $scope.user.id = data.userID;
                $scope.user.description = data.userBio;
                $scope.user.status = data.status;
                $http({
                    method: "GET",
                    url: '/p-getimg',
                    params: {
                        userID: $scope.user.id
                    }
                })
                .then(function(imgres) {
                    console.log(imgres);
                    $scope.user.profile = imgres;
                    $('.login').animate({
                        opacity: 0
                    }, 300, function() {
                        $scope.renderUserProfile();
                        $('.login').css('display', 'none');
                        $('.user').animate({
                            opacity: 1
                        }, 300);
                    });
                }, function(err) {
                    console.log(err);
                });
            } else {
                console.log("login failed");
            }
        }
    };
    $scope.signUp = function() {
        $location.path("signup");
    };
});

app.controller('signup', function($scope, $http, $location) {
    (function responsiveImageInput() {
        function readURL(input) {
            if(input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $('.fill').css({
                        background: "url('" + e.target.result + "') no-repeat center",
                        backgroundSize: 'cover'
                    });
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
    $scope.fadeUI = function() {
        $('.fill').animate({
            opacity: 0.7
        }, 150);
    };
    $scope.unFadeUI = function() {
        $('.fill').animate({
            opacity: 1
        }, 150);
    };
    $scope.testRegex = function() {
        var usval = $('.username').value;
        var specials=/^[\w&.-]+$/;
        console.log(specials.test(usval));
    };
    $scope.submitNewUser = function() {
        var ajaxConditional = false;
        var advisoryMessage;
        var inputArray = $('.text').toArray();
        $('.name').val($('.name').val().replace(' ', '_'));
        for(var j in inputArray) {
            if(inputArray[j].value != '') {
                advisoryMessage = "You must fill all fields!";
                if(isNaN(inputArray[j].value) && inputArray[j].value.length > 3) {
                    advisoryMessage = "All fields must have a minimum length of 4.";
                    if(!(isNaN(inputArray[j].value))) {
                        advisoryMessage = "Please use letters and numbers.";
                    }
                    if(!(inputArray[j].value.includes("'"))) {
                        advisoryMessage = "Please remove special characters.";
                        if(inputArray[j].value != "test") {
                            var specials=/^[\w&.-_]+$/;
                            if(specials.test(inputArray[j].value)) {
                                if($('.password').val() == $('.verifypassword').val()) {
                                    ajaxConditional = true;
                                    advisoryMessage = '';
                                } else {
                                    advisoryMessage = "Passwords don\'t match!";
                                } 
                            } else {
                                advisoryMessage = "Please remove special characters.";
                                break;
                            }
                        } else {break;}
                    } else {break;}
                } else {break;}
            } else {break;}
        }
        if(ajaxConditional) {
            $('.name').val($('.name').val().replace('_', ' '));
            var data = new FormData();
            var image = $('.profilePic')[0].files[0];
            var userTokens = {
                fullName: $('.name').val(),
                username: $('.username').val().toLowerCase(),
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
                    $('form')[0].reset();
                    $('.fill').css({
                        background: "initial",
                        backgroundColor: "transparent"
                    });
                    $location.path('profile');
                }
            });
            console.log('works');
        } else {
            console.log(advisoryMessage);
            advisoryMessage = '';
        }
    };
});

// OUTER UI FUNCTIONS

function showLoadPanel() {

}

function hideLoadPanel() {

}
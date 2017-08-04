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
    })
    .when('/login', {
        templateUrl: 'login.html',
        controller: 'login'
    });
});

app.run(function($rootScope, $location) {
    if(!successfulLogin) {
        $location.path("/login");
    } 
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

app.controller('login', function($scope, $location, $http) {
    isLoginFromSignup = false;
    $scope.$on('$locationChangeStart', function(event) {
        if(!signUpRoute) {
            if(!successfulLogin) {
                $location.path("/login");
                console.log("blocking");
            } else {
                console.log("user logged in");
            }
        }
    });
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
            console.log("ERR __ COULD NOT GET USER DATA");
        });
        function callback(res) {
            var data = res.data;
            if(data.success == true) {
                u$er.name = data.name;
                u$er.id = data.userID;
                u$er.bio = data.userBio;
                u$er.status = data.status;
                $http({
                    method: "GET",
                    url: '/p-getimg',
                    params: {
                        userID: u$er.id
                    }
                })
                .then(function(imgres) {
                    u$er.profile = imgres.data;
                    $('.login').animate({
                        opacity: 0
                    }, 300, function() {
                        successfulLogin = true;
                        $location.path("/profile");
                        $scope.$apply();
                    });
                }, function(err) {
                    console.log("IMGERR __ COULD NOT GET IMAGE");
                });
            } else {
                alert("Login failed");
            }
        }
    };
    $scope.signUp = function() {
        signUpRoute = true;
        $location.path("/signup");
    };
    //AUTOEXE
    (function() {
        if(u$er.name != undefined) {
            $scope.renderUserProfile();
        } else {
            $('.login').css({
                display: 'table'
            });
        }
    })();
});

app.controller('profile', function($scope, $location, $http) {
    $scope.renderProfile = function() {
        $('.userhead .name').text(u$er.name);
        $('.userhead .img').css({
            background: "url('data:image/png;base64," + u$er.profile + "') center no-repeat",
            backgroundSize: "cover" 
        });
        $('.userbody .description').text(u$er.bio);
        $('.userbody .status').text(u$er.status.toUpperCase());
        $('.user').animate({
            opacity: 1
        }, 300);
    };
    $scope.renderProfile();
});

app.controller('signup', function($scope, $http, $location) {
    signUpRoute = false;
    $scope.$on('$locationChangeStart', function(event) {
        if(!isLoginFromSignup) {
            $location.path("/signup");
            console.log("blocked");
        } else {
            console.log("passed");
        }
    });
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
                alert("File read failed");
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
        var advisoryMessage = "none";
        var inputArray = $('.text').toArray();
        $('.name').val($('.name').val().replace(' ', '_'));
        for(var j in inputArray) {
            if(inputArray[j].value != '') {
                if(inputArray[j].value.length > 3) {
                    if(!(isNaN(inputArray[j].value))) {
                        advisoryMessage = "Please use both letters and numbers.";
                        ajaxConditional = false;
                        break;
                    }
                    if(!(inputArray[j].value.includes("'"))) {
                        var specials=/^[\w&.-_]+$/;
                        if(specials.test(inputArray[j].value)) {
                            if($('.password').val() == $('.verifypassword').val()) {
                                if(inputArray[j].value != "test") {
                                    ajaxConditional = true;
                                    isLoginFromSignup = true;
                                    advisoryMessage = '';
                                    alert("passed");
                                } else {
                                    console.log("this was just a test");
                                    ajaxConditional = false;
                                }
                            } else {
                                advisoryMessage = "Passwords don't match!";
                                ajaxConditional = false;
                                break;
                            } 
                        } else {
                            advisoryMessage = "Please remove special characters.";
                            ajaxConditional = false;
                            break;
                        }
                    } else {
                        advisoryMessage = "Please remove special characters.";
                        ajaxConditional = false;
                        break;
                    }
                } else {
                    advisoryMessage = "All fields must have a minimum length of 4.";
                    ajaxConditional = false;
                    break;
                }
            } else {
                advisoryMessage = "You must fill all fields!";
                ajaxConditional = false;
                break;
            }
        }
        console.log(ajaxConditional);
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
                    $location.path('/login');
                    $scope.$apply();
                }
            });
        } else {
            alert(advisoryMessage);
            advisoryMessage = '';
        }
    };
});

// DIRECTIVES

app.directive("renderUserProfile", function() {
    return {
        controller: function($scope) {
            
        }
    };
});

// OUTER UI FUNCTIONS AND DATA

u$er = {
    name: undefined,
    id: undefined,
    profile: undefined,
    bio: undefined,
    status: undefined,
    storeItems: []
};

successfulLogin = false;
signUpRoute = false;
isLoginFromSignup = false;

function showLoadPanel() {

}

function hideLoadPanel() {

}
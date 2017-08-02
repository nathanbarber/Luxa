var express = require("express"),
    bodyparser = require('body-parser'),
    multer = require('multer'),
    favicon = require("serve-favicon"),
    path = require("path"),
    requests = require("./requests.js"),
    pug = require("pug"),
    mime = require("mime"),
    fs = require("fs");

//BUILD
(function() {
    var all = fs.readdirSync(__dirname + "/public/pugfiles/");
    for(var i in all) {
        if(all[i].includes(".pug")) {
            var pugFilePath = __dirname + "/public/pugfiles/" + all[i];
            var htmlFilePath = pugFilePath
                .replace(".pug", ".html")
                .replace('/pugfiles', '');
            var compile = pug.compileFile(pugFilePath, {pretty: '   '});
            fs.writeFileSync(htmlFilePath, compile());
        }
    }
})();

//RUN
var app = express();
console.log("\n STATUS \n");
try {
    app.use(favicon(path.join(__dirname + "/public/img/favicon.png")));
} catch(err) { 
    console.log("favicon not found"); 
}
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.listen(8083, function() {
    console.log("listening on 8083");
});

var baseUserDir = __dirname + "/datastore/users/";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, baseUserDir);
    }
});
var upload = multer({
    dest: '/datastore/users/', 
    storage: storage
});

app.post('/submitNewUser', upload.any(), function(req, res) {
    generateNewUserID(function createNewUser(userID) {
        fs.mkdir(__dirname + "/datastore/users/" + userID, function() {
            fs.renameSync(
                baseUserDir + req.files[0].filename,
                baseUserDir + userID + "/profile." + mime.extension(req.files[0].mimetype)
            );
        });
        /*var query = "insert into users(username, password, userID, fullName) values ('" + 
            req.body.username + "', '" + 
            req.body.password + "', '" + 
            userID + "', '" + 
            req.body.fullName + "')";
        requests.database(query);*/
        requests.insertUser(req.body.username, req.body.password, userID, req.body.fullName);
    });
    console.log("new user created");
    res.end();
});

// UTILITY
function generateNewUserID(callback) {
    var newUserID = Math.floor(Math.random() * 100000000);
    requests.database("select * from users where userID = " + newUserID, function(res) {
        if(res.username == undefined) {
            callback(newUserID);
        }
    });
}
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

app.get('/login', function(req, res) {
    var keys = req.query;
    var data = {};
    var identifyQuery = "select password from users where username = '" + keys.username + "'";
    requests.database(identifyQuery, function(identifyRes) {
        if(identifyRes.length > 0) {
            if(identifyRes[0].password == keys.password) {
                console.log('\tMATCH');
                var fullLoginQuery = "select * from users where username = '" + keys.username + "'";
                requests.database(fullLoginQuery, function(fullLoginResArray) {
                    var fullLoginRes = fullLoginResArray[0];
                    data.success = true;
                    data.name = fullLoginRes.fullName;
                    data.username = fullLoginRes.username;
                    data.userID = fullLoginRes.userID;
                    data.userBio = fullLoginRes.bio;
                    data.status = fullLoginRes.status;
                    res.send(data);
                });
            } else {
                data.success = false;
                res.send(data);
            }
        } else {
            data.success = false;
            res.send(data);
            console.log("no such user");
        }
    });
});

app.get("/p-getimg", function(req, res) {
    var userID = req.query.userID;
    console.log("\t" + userID);
    fs.readdir(__dirname + "/datastore/users/" + userID, function(err, data) {
        if(err)
            throw err;
        fs.readFile(__dirname + "/datastore/users/" + userID + "/profile.png", function(err, imgData) {
            if(err)
                throw err;
            res.writeHead(200, {"Content-Type": "image/png"});
            var dataEncodedBase64 = new Buffer(imgData).toString('base64');
            res.end(dataEncodedBase64);
        });
    });
    
}); 

// MULTIPART DATA HANDLING
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
        requests.insertUser(req.body.username, req.body.password, userID, req.body.fullName);
    });
    console.log("new user created");
    res.end();
});

app.post('/updateUser', function(req, res) {
    var query = "update users set fullName = '" + req.body.fullName + 
    "', bio = '" + req.body.bio + 
    "' where username = '" + req.body.username + 
    "'";
    requests.database(query, function(res) {
        console.log(res);
    });
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
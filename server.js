var express = require("express"),
    bodyparser = require('body-parser'),
    multer = require('multer'),
    upload = multer({dest: 'datastore/users/'})
    favicon = require("serve-favicon"),
    path = require("path"),
    requests = require("./requests.js"),
    pug = require("pug"),
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

app.post('/submitNewUser', upload.any(), function(req, res) {
    generateNewUserID(function() {
    });
    console.log(req.body);
    console.log(req.files);
});

// Utility

function generateNewUserID(callback) {
    var newUserID = Math.floor(Math.random() * 100000000);
    console.log(newUserID);
    requests.database("select * from users where userID = " + newUserID, function(res) {
        console.log(res);
        if(res.username == undefined) {
            callback(newUserID);
        }
    });
}
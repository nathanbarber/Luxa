var express = require("express"),
    favicon = require("serve-favicon"),
    path = require("path"),
    requests = require("./requests.js"),
    pug = require("pug"),
    fs = require("fs");

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
app.use(express.static(__dirname + "/public"));
app.listen(8083, function() {
    console.log("listening on 8083");
});
requests.database("select * from users");
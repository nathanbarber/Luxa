var request = require("request");
var querystring = require("querystring");
var mysql = require("mysql");
module.exports = {
    get: function(queryobject) {
        var querystr = querystring.stringify(queryobject);
        request(querystr, function(err, response, body) {
            if(err) {
                console.log(err);
            }
            return response;
        });
    },
    database: function(querystring, callback) {
        var connection = mysql.createConnection({
            host: "localhost",
            user: 'nodeAuth',
            password: 'a60bpdf62ndfl',
            database: 'lux'
        });
        connection.query(querystring, function(err, res) {
            if(err) {
                console.log(err);
            }
            callback(res);
            connection.end();
        });
    },
    insertUser: function(user, password, userID, bufferedImage) {
        if(bufferedImage == undefined) {
            bufferedImage = "none";
        }
        var insertString = "insert into users values('"  + 
            user + "', '" + 
            password + "', '" + 
            userID + "', '" + 
            bufferedImage + "')";
        module.exports.database(
            insertString
        );
    }
};
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
            user: 'username',
            password: 'pass',
            database: 'lux'
        });
        connection.query(querystring, function(err, res) {
            if(err) {
                console.log(err);
            }
            if(callback) {
                callback(res);
            }
            connection.end();
        });
    },
    insertUser: function(user, password, userID, fullName) {
        var insertString = "insert into users(username, password, userID, fullName) values('"  + 
            user + "', '" + 
            password + "', '" + 
            userID + "', '" + 
            fullName + "')";
        module.exports.database(
            insertString
        );
    }
};
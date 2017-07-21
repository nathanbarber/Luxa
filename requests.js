var request = require("request");
var querystring = require("querystring");
module.exports = {
    get: function(queryobject) {
        var querystr = querystring.stringify(queryobject);
        request(querystr, function(err, response, body) {
            if(err) {
                console.log(err);
            }
            return response;
        });
    }
};
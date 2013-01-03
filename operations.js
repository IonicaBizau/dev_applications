var spawn = require("child_process").spawn;

var send  = require(CONFIG.root + "/core/send.js").send;
var apps = require(CONFIG.root + "/api/apps");

// Redeploy app function
exports.redeploy = function(link) {

}

// Start app function
exports.start = function(link) {

}

// Stop app function
exports.stop = function(link) {

}

// Edit app function
exports.edit = function(link) {

}

// Delete app function
exports.delete = function(link, callback) {
    var id = link.data;
    apps.uninstall(CONFIG.APPLICATION_ROOT + id + "/mono.json", function(err) {
        if(err) return callback(err);
        callback();
    });
}

// Get apps names function
exports.applications = function(link) {
    apps.getApplications(function(err, appsObjects){
        if(err) return send.internalservererror(link, err);
        send.ok(link.res, appsObjects);
    });
}

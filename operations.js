var spawn = require("child_process").spawn;

var send  = require(CONFIG.root + "/core/send.js").send;
var apps = require(CONFIG.root + "/api/apps");


// Redeploy app function
exports.redeploy = function(link) {
    var appId = link.data;
    var redeploy = spawn("node", [CONFIG.root + "/admin/scripts/installation/reinstall_app.js", CONFIG.APPLICATION_ROOT + "/" + appId + "/mono.json"]);

    redeploy.stderr.on("data", function (data) {
        send.internalservererror(link, data);
    });

    redeploy.on('exit', function (code) {
        send.ok(link.res, "Application " + appId + "successfully deployed.");
    });
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
exports.delete = function(link) {
    var id = link.data;
    apps.uninstall(CONFIG.APPLICATION_ROOT + id + "/mono.json", function(err) {
        if(err) return send.internalservererror(link, err);
        send.ok(link.res)
    });
}

// Get apps names function
exports.applications = function(link) {
    apps.getApplications(function(err, appsObjects){
        if(err) return send.internalservererror(link, err);
        send.ok(link.res, appsObjects);
    });
}

var spawn = require("child_process").spawn;

var send  = require(CONFIG.root + "/core/send.js").send;
var apps = require(CONFIG.root + "/api/apps");

// Redeploy app function
exports.redeploy = function(link) {

    var appId = link.data;
    var deployer = spawn("node", [CONFIG.root + "/admin/scripts/installation/reinstall_app.js", CONFIG.APPLICATION_ROOT + "/" + appId + "/mono.json"]);

    deployer.stderr.pipe(process.stderr);
    deployer.stdout.pipe(process.stdout);

    deployer.on('exit', function(code) {
        if (code) {
            send.internalservererror(link, "Redeployment failed for application: " + appId);
        } else {
            send.ok(link.res, "Application " + appId + "successfully deployed.");
        }
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

// Update app function
exports.update = function(link) {
    // Application ID
    var appId = link.data;

    // Start the Update operation
    console.log("------------");
    console.log("Starting UPDATE operation...");

    var updater = spawn("node", [CONFIG.root + "/admin/scripts/installation/update_app.js", CONFIG.APPLICATION_ROOT + "/" + appId]);

    updater.stderr.pipe(process.stderr);
    updater.stdout.pipe(process.stdout);

    // Finished the operation
    updater.on('exit', function(code) {
        if (code) {
            console.log(">>>>> Code: " + code);
            
            var errors = [
                "",
                "Please provide an application id as argument.",
                "This application doesn't contain the repository field.",
                "This application doesn't contain the repository.url field.",
                "Failed to make temp directory.",
                "Download of zip failed.",
                "The application was not found in the databse. Application deployment failed somehow. :(",
                "Unknown reason. Maybe if you check @/core/getLog you will see the error.",
                "Failed to connect to OrientDB",
                "The ID doesn't exist in database. Update failed."
            ];
            
            send.internalservererror(link, "Update failed for application: " + appId + ". Error: " + errors[code] + " Error code: " + code);
        } else {
            console.log("Application " + appId + " successfully updated.");
            console.log("------------");
            send.ok(link.res, "Application " + appId + " successfully updated.");
        }
    });
}

// Delete app function
exports.delete = function(link) {

    var id = link.data;

    apps.uninstall(CONFIG.APPLICATION_ROOT + id + "/mono.json", function(err) {

        if (err) {
            return send.internalservererror(link, err);
        }

        send.ok(link.res)
    });
}

// Get apps names function
exports.applications = function(link) {
    apps.getApplications(function(err, appsObjects){

        if (err) {
            return send.internalservererror(link, err);
        }

        appsObjects = sortAppsArray(appsObjects);

        send.ok(link.res, appsObjects);
    });
}

// Redeploy MonoDev
exports.redeployMonoDev = function(link) {
    console.log("-- MonoDev Redeployment --");
    
    var jsonFile = "/apps/00000000000000000000000000000002/mono.json";
    
    var deployer = spawn("node", [CONFIG.root + "/admin/scripts/installation/reinstall_app.js", CONFIG.root + jsonFile]);
    
    deployer.stderr.pipe(process.stderr);
    deployer.stdout.pipe(process.stdout);

    deployer.on('exit', function(code) {
        if (code) {
            send.internalservererror(link, "Redeployment failed for MonoDev");
        } else {
            send.ok(link.res, "MonoDev successfully deployed.");
        }
        console.log("-- MonoDev Redeployment Ended --");
    });
}

// Sort alphabetically
function sortAppsArray(array) {
    var names = [];
    
    var sorted = [];
    
    for (var i in array) {
        names.push(array[i].name);
    }
    
    names.sort();
    
    function getAppByName(name) {
        for(var i in array) {
            if(name === array[i].name) {
                var app = array[i];
                array.slice(i);
                return app;
            }
        }
    }
    
    for (var i in names) {
        sorted.push(getAppByName(names[i]));
    }
    
    return sorted;
}
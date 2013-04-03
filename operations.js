var spawn = require("child_process").spawn;

// Redeploy app function
exports.redeploy = function(link) {

    var appId = link.data;
    M.app.redeploy(appId, function(err) {

        if (err) {
            link.send(500, err.message);
            return;
        }

        link.send(200);
    });
};

// Start app function
exports.start = function(link) {

};

// Stop app function
exports.stop = function(link) {

};

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

    var updater = spawn("node", [M.config.root + "/admin/scripts/installation/update_app.js", M.config.APPLICATION_ROOT + "/" + appId]);

    updater.stderr.pipe(process.stderr);
    updater.stdout.pipe(process.stdout);

    // Finished the operation
    updater.on('exit', function(code) {
        if (code) {
            
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
            
            link.send(500, "Update failed for application: " + appId + ". Error: " + errors[code] + " Error code: " + code);
        } else {
            console.log("Application " + appId + " successfully updated.");
            console.log("------------");
            link.send(200, "Application " + appId + " successfully updated.");
        }
    });
}

// Delete app function
exports.delete = function(link) {

    var appId = link.data;

    M.app.remove(appId, function(err) {

        if (err) {
            return link.send(500, err.message);
        }

        link.send(200)
    });
}

// Get apps names function
exports.applications = function(link) {
    M.app.getApplications(function(err, appsObjects){

        if (err) {
            return link.send(500, err);
        }

        appsObjects = sortAppsArray(appsObjects);

        link.send(200, appsObjects);
    });
}

// Redeploy MonoDev
exports.redeployMonoDev = function(link) {
    console.log("-- MonoDev Redeployment --");
    
    var jsonFile = "/apps/00000000000000000000000000000002/mono.json";
    
    var deployer = spawn("node", [M.config.root + "/admin/scripts/installation/reinstall_app.js", M.config.root + jsonFile]);
    
    deployer.stderr.pipe(process.stderr);
    deployer.stdout.pipe(process.stdout);

    deployer.on('exit', function(code) {
        if (code) {
            link.send(500, "Redeployment failed for MonoDev");
        } else {
            link.send(200, "MonoDev successfully deployed.");
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


var spawn = require('child_process').spawn;

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

    var appId = link.data;

    M.app.update(appId, function(err, wasUpdated) {

        if (err) {
            return link.send(500, err.message);
        }

        link.send(200, wasUpdated);
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
};

// Get apps names function
exports.applications = function(link) {

    M.app.getApplications(function(err, appsObjects){

        if (err) {
            return link.send(500, err);
        }

        appsObjects = sortAppsArray(appsObjects);

        link.send(200, appsObjects);
    });
};

// Redeploy MonoDev
exports.redeployMonoDev = function(link) {

    var env = process.env;
    env.MONO_DEV_APP_ID = M.config.app.id;
    env.MONO_DEV_GIT_URL = 'git@github.com:jillix/MonoDev.git';

    var node = spawn('node', [M.config.APPLICATION_ROOT + M.config.app.id + '/reinstall.js'], { env: process.env, detached: true });

    node.stderr.pipe(process.stderr);
    node.stdout.pipe(process.stdout);

    node.on('exit', function(code) {

        switch (code) {
            case 0:
                link.send(200, { status: 0, message: 'MonoDev successfully deployed.' });
                return;
            case 1:
                link.send(200, { status: 1, message: 'MonoDev already up-to-date' });
                return;
            default:
                link.send(500, 'Redeployment failed for MonoDev');
                return;
        }
    });
};

// Sort alphabetically
function sortAppsArray(array) {
    var names = [];
    
    var sorted = [];
    
    for (var i in array) {
        names.push(array[i].name);
    }
    
    names.sort();
    
    function getAppByName(name) {
        for (var i in array) {
            if (name === array[i].name) {
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


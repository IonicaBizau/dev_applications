var self;

var Bind = require('github/jillix/bind');
var Events = require('github/jillix/events');

var appId;

module.exports = function (config, dataContext) {

    // nothing selected. e.g.: on load
    if (!dataContext) { 
        showInfoMessage("Please select an application to see its details."); 
        $(".buttons").hide();
        return;
    } else { $(".buttons").fadeIn(); }
    
    self = this;
    handlers(dataContext);
    
    // isn't this an installed application?
    // TODO

    //  if (typeof dataContext.roles !== "object") {

    // This method is a little bit hacky.
    // If an application failed to install, it doesn't have roles.
    var installed = $(".left .installedApps .active").length;

    // TODO Implement dynamic links.
    var editLink = "/edit?mongoId=" + dataContext._id;
    $(".edit-link").attr("href", editLink);

    if (!installed) {
        $(".buttons button").hide();
        $(".buttons button[data-operation='deploy']").show();
        $(".buttons button[data-operation='edit']").show();
        return;
    }

    // it's an installed application, so hide the deploy button
    $(".buttons button[data-operation='deploy']").hide();
    
    Events.call(self, config);

    appId = dataContext.id;
};

////////////////////////////
// Bootstrap alert functions
////////////////////////////

function showError (err) {
    var template = $('#errorAlert').clone().attr('id', '');
    template.find('.message').html(err);

    template.fadeIn();

    $('#alerts').append(template);
}

function showWarning (err) {
    var template = $('#warningAlert').clone().attr('id', '');
    template.find('.message').html(err);

    template.fadeIn();
    
    $('#alerts').append(template);
}

function showInfoMessage (message) {
    var template = $('#infoAlert').clone().attr('id', '');

    template.find('.message').html(message);
    template.fadeIn();
    
    $('#alerts').append(template);
}

function showSuccessMessage (message) {
    var template = $('#successAlert').clone().attr('id', '');

    template.find('.message').html(message);
    template.fadeIn();
    
    $('#alerts').append(template);
}

//////////////////////
// Operation functions
//////////////////////
function handlers(dataContext) {
    
    // click on buttons
    $(self.dom).on('click', '.btn', function() {
        var operation = $(this).attr('data-operation');

        if (operation) { confirmAction(operation, dataContext); }
    });

    // Click on Yes button of modal
    $('#yesButton').on('click', function() {
        var operationName = $('#operationName').text().toLowerCase();

        if (operationName !== 'redeploy monodev') {
            $('#' + appId).find('.spinner').show();
            $('#' + appId).find('.operations').hide();
        }
        
        $('#modal').modal('hide');
        
        var successLabel = ' <span class="label label-success">Success</span>';
        var infoLabel = ' <span class="label label-info">Info</span>';
        var errorLabel = ' <span class="label label-important">Error</span>';
        var warningLabel = ' <span class="label label-warning">Warning</span>';
        
        var icon = '<i class="icon-info-sign"></i> ';
        
        showInfoMessage(icon + 'Started <strong>' + $('#operationName').text() + '</strong> operation for <strong>' + dataContext.name + '</strong>' + infoLabel);

        switch (operationName){
            case 'delete':
                self.link('delete', { data : appId }, function(err, data) {
                    var icon = '<i class="icon-trash"></i> ';
                    if (err) {
                        $('#' + appId).find('.spinner').hide();
                        $('#' + appId).find('.operations').show();
                        return showError(icon + err + errorLabel);
                    }
                    var message = icon + '<strong>' + dataContext.name + '</strong> successfully <strong>deleted</strong>.' + successLabel;
                    showSuccessMessage(message);
                    $('#' + appId).fadeOut();
                    showInfoMessage("Please select an application to see its details."); 
                    $(".buttons").hide();
                    self.emit("installedAppsChanged");
                });
            break;
            case 'deploy':
                self.link('deploy', { data: dataContext.repo_url }, function(err, data) {
                    var icon = '<i class="icon-refresh"></i> ';
                    $('#' + appId).find('.spinner').hide();
                    $('#' + appId).find('.operations').show();
                    if (err) return showError(icon + err + errorLabel);
                    var message = icon + '<strong>' + dataContext.name + '</strong> successfully <strong>deployed</strong>.' + successLabel;
                    showSuccessMessage(message);
                    self.emit("installedAppsChanged");
                });
            break;
            case 'redeploy':
                self.link('redeploy', { data: appId }, function(err, data) {
                    var icon = '<i class="icon-refresh"></i> ';
                    $('#' + appId).find('.spinner').hide();
                    $('#' + appId).find('.operations').show();
                    if (err) return showError(icon + err + errorLabel);
                    var message = icon + '<strong>' + dataContext.name + '</strong> successfully <strong>redeployed</strong>.' + successLabel;
                    showSuccessMessage(message);
                });
            break;
            case 'update':
                self.link('update', { data: appId }, function(err, data) {
                    var icon = '<i class="icon-download"></i> ';

                    $('#' + appId).find('.spinner').hide();
                    $('#' + appId).find('.operations').show();

                    if (err) return showError(icon + err + errorLabel);
                    if (!data) return showWarning(icon + 'Application already at its newest version.' + warningLabel);

                    var message = icon + '<strong>' + dataContext.name + '</strong> successfully <strong>updated</strong>.' + successLabel;
                    showSuccessMessage(message);
                });
            break;
        }
    });
}

// Confirm Modal
function confirmAction (operation, dataContext) {
    switch (operation){
        case 'delete':
            $('#operationName').html('Delete');
            $('#question').html('Are you really <b>sure</b> that you want to delete ' + dataContext.name + '?');
            $('#modal').modal('show');
        break;
        case 'deploy':
            $('#operationName').html('Deploy');
            $('#question').html('Are you sure you want to deploy ' + dataContext.name + ' from ' + dataContext.repo_url + '?');
            $('#modal').modal('show');
        break;
        case 'redeploy':
            $('#operationName').html('Redeploy');
            $('#question').html('Are you sure that you want to redeploy ' + dataContext.name + '?');
            $('#modal').modal('show');
        break;
        case 'update':
            $('#operationName').html('Update');
            $('#question').html('Are you sure that you want to update ' + dataContext.name + '?');
            $('#modal').modal('show');
        break;
    }
}

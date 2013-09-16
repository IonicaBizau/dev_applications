var self;

var Bind = require('github/jillix/bind');
var Events = require('github/jillix/events');

var appId;

module.exports = function (config) {

    // nothing selected. e.g.: on load
    showInfoMessage("Please select an application to see its details.");
    $(".appDetails").hide();

    self = this;
    self.setInfo = function (dataContext) {

        handlers(dataContext);

        $(".appDetails").find("[data-field]").each(function () {
            var value = dataContext[$(this).data("field")];
            if (value) {
                $(this).text(value);
            }
            else {
                $(this).hide();
            }
        });

        if (!dataContext) {
            showInfoMessage("Please select an application to see its details.");
            $(".appDetails").hide();
            return;
        } else { $(".appDetails").fadeIn(); }


        // isn't this an installed application?
        // TODO

        //  if (typeof dataContext.roles !== "object") {

        // This method is a little bit hacky.
        // If an application failed to install, it doesn't have roles.
        var installed = $(".left .installedApps #" + (dataContext.appId || dataContext.id)).length;

        // TODO Implement dynamic links.
        var editLink = "/edit?givenId=" + (dataContext._id || dataContext.id);
        $(".edit-link").attr("href", editLink);

        $(".actions .btn").fadeIn();
        //////////////////////////////////////
        // THE APPLICATION IS NOT INSTALLED //
        //////////////////////////////////////
        // <DEPLOY> <EDIT> //
        /////////////////////
        if (!installed) {
            $(".actions .btn").hide();
            $(".actions .btn[data-operation='deploy']").show();
            $(".actions .btn[data-operation='edit']").show();
            return;
        }

        //////////////////////////////////////
        // THE APPLICATION IS NOT INSTALLED //
        ///////////////////////////////////////////////////////
        //  <REDEPLOY> <START/STOP> <EDIT> <UPDATE> <DELETE> //
        ///////////////////////////////////////////////////////
        $(".actions .btn[data-operation='deploy']").hide();
        appId = dataContext.id || dataContext.appId;
    };

    Events.call(self, config);
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

    // remove already set handlers
    $(self.dom).off('click', '[data-operation]');
    $('#yesButton').off('click');

    // click on buttons
    $(self.dom).on('click', '[data-operation]', function() {
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
                    $(".actions").hide();
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
            case 'stop':
                    self.link('stop', { data: appId }, function(err, data) {
                    var icon = '<i class="icon-stop"></i> ';

                    $('#' + appId).find('.spinner').hide();
                    $('#' + appId).find('.operations').show();

                    if (err) return showError(icon + err + errorLabel);
                    if (!data) return showWarning(icon + 'Application already stopped.' + warningLabel);

                    var message = icon + '<strong>' + dataContext.name + '</strong> successfully <strong>stopped</strong>.' + successLabel;
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
            $('#question').html('Are you really <b>sure</b> that you want to delete <strong>' + dataContext.name + '</strong>?');
            $('#modal').modal('show');
        break;
        case 'deploy':
            $('#operationName').html('Deploy');
            $('#question').html('Are you sure you want to deploy <strong>' + dataContext.name + '</strong> from <strong>' + dataContext.repo_url + '</strong>?');
            $('#modal').modal('show');
        break;
        case 'redeploy':
            $('#operationName').html('Redeploy');
            $('#question').html('Are you sure that you want to redeploy <strong>' + dataContext.name + '</strong>?');
            $('#modal').modal('show');
        break;
        case 'update':
            $('#operationName').html('Update');
            $('#question').html('Are you sure that you want to update <strong>' + dataContext.name + '</strong>?');
            $('#modal').modal('show');
        break;
        case 'stop':
            $('#operationName').html('Stop');
            $('#question').html('Are you sure that you want to stop <strong>' + dataContext.name + '</strong>?');
            $('#modal').modal('show');
        break;
    }
}

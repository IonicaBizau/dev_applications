
var self;

var FADE_TIME = 500;
var appsArray = [];

module.exports = function (config) {
    self = this;

    var redeployButton = $('#redeployMonoDev');
            
    // Get the applications data
    self.link('applications', function(err, data) {
        if (err) return showError(err);
        appsArray = data;
        
        buildTable(data);
    });
    
    var appId;
    
    // Click on an operation button
    $('#redeployMonoDev').on('click', function() {
        confirmAction('redeployMonoDev');
    });

    $('#appsTable').on('click', '.btn', function() {
        var operation = $(this).attr('data-operation');
        
        appId = $(this).closest('[id]').attr('id');

        if (operation) {
            confirmAction(operation);
        }
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
        
        showStartOperationMessage(icon + 'Started <strong>' + $('#operationName').text() + '</strong> operation for <strong>' + getAppNameById(appId) + '</strong>' + infoLabel);

        switch (operationName){
            case 'delete':
                self.link('delete', { data : appId }, function(err, data) {
                    var icon = '<i class="icon-trash"></i> ';
                    if (err) {
                        $('#' + appId).find('.spinner').hide();
                        $('#' + appId).find('.operations').show();
                        return showError(icon + err + errorLabel);
                    }
                    var message = icon + '<strong>' + getAppNameById(appId) + '</strong> successfully <strong>deleted</strong>.' + successLabel;
                    showSuccessMessage(message);
                    $('#' + appId).fadeOut(FADE_TIME);
                });
            break;
            case 'redeploy':
                self.link('redeploy', { data: appId }, function(err, data) {
                    var icon = '<i class="icon-refresh"></i> ';
                    $('#' + appId).find('.spinner').hide();
                    $('#' + appId).find('.operations').show();
                    if (err) return showError(icon + err + errorLabel);
                    var message = icon + '<strong>' + getAppNameById(appId) + '</strong> successfully <strong>redeployed</strong>.' + successLabel;
                    showSuccessMessage(message);
                });
            break;
            case 'redeploy monodev':
                redeployButton.button('loading');
                self.link('redeployMonoDev', { data: appId }, function(err, data) {
                    redeployButton.button('reset');
                    var icon = '<i class="icon-refresh"></i> ';

                    if (err || !data) return showError(icon + (err || 'Missing response data') + errorLabel);
                    if (data.status === 1) return showWarning(icon + data.message + warningLabel);

                    var message = icon + '<strong>MonoDev</strong> successfully<strong> redeployed. Refresh the page.</strong>.' + successLabel;
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

                    var message = icon + '<strong>' + getAppNameById(appId) + '</strong> successfully <strong>updated</strong>.' + successLabel;
                    showSuccessMessage(message);
                });
            break;

        }
    });
};

// Build table with apps names
function buildTable (apps) {   
    var template = $('.template');
    var tbody = $('#appsTable').find('tbody');
    for (var i in apps) {
        var app = apps[i];
        
        if (app.name !== 'MonoDev') {
            var tr = template.clone().removeClass('template').show();
            tr.attr('id', app.id);
            tr.find('.name').find('a').html(app.name);
            tbody.append(tr);
        }
    }
}

// Show error
function showError (err) {
    var template = $('#errorAlert').clone().attr('id', '');
    template.find('.message').html(err);

    template.fadeIn();

    $('#alerts').append(template);
}

// Show warning
function showWarning (err) {
    var template = $('#warningAlert').clone().attr('id', '');
    template.find('.message').html(err);

    template.fadeIn();
    
    $('#alerts').append(template);
}

function showStartOperationMessage (message) {
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

// Confirm Modal
function confirmAction (operation) {
    switch (operation){
        case 'delete':
            $('#operationName').html('Delete');
            $('#question').html('Are you really <b>sure</b> that you want to delete this application?');
            $('#modal').modal('show');
        break;
        case 'redeploy':
            $('#operationName').html('Redeploy');
            $('#question').html('Are you sure that you want to redeploy this application?');
            $('#modal').modal('show');
        break;
        case 'redeployMonoDev':
            $('#operationName').html('Redeploy MonoDev');
            $('#question').html('Are you sure that you want to redeploy <strong>MonoDev</strong>?');
            $('#modal').modal('show');
        break;
        case 'update':
            $('#operationName').html('Update');
            $('#question').html('Are you sure that you want to update this application?');
            $('#modal').modal('show');
        break;
    }
}

// Get application name by id
function getAppNameById (appId) {
    for (var app in appsArray) {
        if (appsArray[app].id === appId) {
            return appsArray[app].name;
        }
    }
    return '';
}


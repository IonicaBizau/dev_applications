define(function() {
    var self;

    function init(config) {
        self = this;
        getAppsNames(function(data) {
            buildTable(data);
        });
    }

    return init;
});


function getAppsNames(callback) {
    $.get("@/dev_applications/applications", function(data) {
        callback(data);
    });
}

function buildTable(apps) {
    var appsTable = $("#appsTable");
    
    var buttons = "<button class='btn btn-primary'><i class='icon-upload icon-white'></i> Redeploy</button>" +
                   "<button class='btn btn-success'><i class='icon-play icon-white'></i> Start</button>" +
                   "<button class='btn btn-warning'><i class='icon-edit icon-white'></i> Edit</button>" +
                   "<button class='btn btn-danger'><i class='icon-trash icon-white'></i> Delete</button>"
    
    var htmlTable = "<table class='table table-bordered'>" +
                        "<thead>" +
                            "<tr>" +
                                "<th style='width:60%'>Application Name</th>" +
                                "<th>Operations</th>" +
                            "</tr>" +
                        "</thead>" +
                        
                        "<tbody>"

    appsTable.append(htmlTable);
    
    for(var i in apps) {
        var row = $("<tr>");

        var col1 = $("<td>");
        col1.html(apps[i]);
        
        var col2 = $("<td>");
        col2.html(buttons);
        
        row.html(col1 + col2)
        
        appsTable.append(row);
    }
    appsTable.append("</tbody></table>");
}

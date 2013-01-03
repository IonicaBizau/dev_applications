define([
    "/jquery.js"
    ], function() {
    var self;

    function init(config) {
        self = this;
        $("#appsTable").append("<h1>Testing...</h1>");
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
    
    var htmlTable = $("<table class='table table-bordered'>");
    var thead = $("<thead>");
    var tr = $("<tr>");

    var th1 = $("<th style='width:60%'>");
    th1.html("Application Name");

    var th2 = $("<th>");
    th2.html("Operations");
    
    tr.append(th1);
    tr.append(th2);
    
    thead.append(tr);

    var tbody = $("<tbody>");
    
    for(var i in apps) {
        var row = $("<tr>");

        var col1 = $("<td>");
        col1.html(i + ". " + apps[i].name);
        
        var col2 = $("<td>");
        col2.html(buttons);
        
        row.append(col1);
        row.append(col1);
        
        tbody.append(row);
    }
    
    htmlTable.append(tbody);
    appsTable.append(htmlTable);
}

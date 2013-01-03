define([
    "/jquery.js"
    ], function() {
    var self;

    function init(config) {
        self = this;
        self.link("applications", function(data) {
            buildTable(data);
        });
    }
    return init;
});

function buildTable(apps) {
    var appsTable = $("#appsTable");
    
    // Redeploy button
    var redeployButton = $("<button class='btn btn-primary'>");
    var redeployIcon = $("<i class='icon-upload icon-white'></i>");
    redeployButton.append(redeployIcon);
    redeployButton.append(" Redeploy"); 
       
    // Start button
    var startButton = $("<button class='btn btn-success'>");
    var startIcon = $("<i class='icon-play icon-white'></i>");
    startButton.append(startIcon);
    startButton.append(" Start"); 
    
    // Edit button
    var editButton = $("<button class='btn btn-warning'>");
    var editIcon = $("<i class='icon-edit icon-white'></i>");
    editButton.append(editIcon);
    editButton.append(" Edit"); 
    
    // Delete button
    var deleteButton = $("<button class='btn btn-danger'>");
    var deleteIcon = $("<i class='icon-trash icon-white'></i>");
    deleteButton.append(deleteIcon);
    deleteButton.append(" Delete"); 
    
    // HTML Table
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
        col2.append(redeployButton);
        col2.append(startButton);
        col2.append(editButton);
        col2.append(deleteButton);
        
        row.append(col1);
        row.append(col2);
        
        tbody.append(row);
    }
    
    htmlTable.append(tbody);
    appsTable.append(htmlTable);
}

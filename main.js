define([
    "/jquery.js"
    ], function() {
    var self;
    
    var FADE_TIME = 600;
    
    function init(config) {
        self = this;
        self.link("applications", function(err, data) {
            if(err) return showError(err);
            buildTable(data);
        });
        var appId;
        $('#appsTable').on("click", ".btn", function() {
            var operation = $(this).attr("data-operation");

            appId = $(this).closest("[id]").attr("id");

            if(operation) {
                confirmAction(operation);
            }
        });
        
        // Modal buttons
        $("#noButton, .close").on("click", function() {
            $("#modal").fadeOut(FADE_TIME);
        });
        
        $("#yesButton").on("click", function() {
            self.link("delete", { data : appId }, function(err, data) {
                $("#modal").fadeOut(FADE_TIME);
                if(err) return showError(err);
                $("#" + appId).fadeOut(FADE_TIME);
            });
        });
    }
    
    function buildTable(apps) {   
        var template = $(".template");
        var tbody = $("#appsTable").find("tbody");
        for(var i in apps) {
            var app = apps[i];
            var tr = template.clone().show();
            tr.attr("id", app.id);
            tr.find('.name').find("a").html(app.name);
            tbody.append(tr);
        }
    }
    
    function showError(err) {
        $("#errorAlert").text("Error: " + err).fadeIn();
    }
    
    // Confirm Modal
    function confirmAction(operation) {
        switch(operation){
            case "delete":
                $("#question").html("Are you really <b>sure</b> that you want to delete this application?");
                $('#modal').fadeIn(FADE_TIME);
            break;
        }
    }
    
    return init;
});


